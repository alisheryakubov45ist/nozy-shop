let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

// ЗАГРУЗКА
fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderCategories(data.categories);
    renderProducts(products);
  });

// КАТЕГОРИИ
function renderCategories(cats){
  const el = document.getElementById("categories");
  el.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat";
    d.innerText = c;
    d.onclick = () => renderProducts(products.filter(p => p.category === c));
    el.appendChild(d);
  });
}

// ПРОДУКТЫ + СВАЙП
function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const slider = document.createElement("div");
    slider.className = "slider";

    let index = 0;
    let startX = 0;

    const img = document.createElement("img");
    img.src = p.images[index];

    img.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    img.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      if(startX - endX > 40) index = (index + 1) % p.images.length;
      if(endX - startX > 40) index = (index - 1 + p.images.length) % p.images.length;
      img.src = p.images[index];
      updateDots();
    });

    img.onclick = () => openViewer(p.images);

    const dots = document.createElement("div");
    dots.className = "dots";

    function updateDots(){
      dots.innerHTML = "";
      p.images.forEach((_, i)=>{
        const s = document.createElement("span");
        if(i === index) s.className = "active";
        dots.appendChild(s);
      });
    }
    updateDots();

    slider.append(img, dots);

    const title = document.createElement("h4");
    title.innerText = p.name;

    const price = document.createElement("p");
    price.innerText = p.price + " TJS";

    const color = document.createElement("select");
    color.id = "c" + p.id;
    p.colors.forEach(c=>{
      const o = document.createElement("option");
      o.value = c; o.text = c;
      color.appendChild(o);
    });

    const size = document.createElement("select");
    size.id = "s" + p.id;
    p.sizes.forEach(s=>{
      const o = document.createElement("option");
      o.value = s; o.text = s;
      size.appendChild(o);
    });

    const btn = document.createElement("button");
    btn.className = "btn-cart";
    btn.innerText = "В корзину";
    btn.onclick = () => addToCart(p.id);

    card.append(slider, title, price, color, size, btn);
    el.appendChild(card);
  });
}

// КОРЗИНА
function addToCart(id){
  const p = products.find(x=>x.id===id);
  cart.push({
    name: p.name,
    price: p.price,
    color: document.getElementById("c"+id).value,
    size: document.getElementById("s"+id).value
  });
  document.getElementById("cart-count").innerText = cart.length;
  renderCart();
}

function renderCart(){
  const el = document.getElementById("cart-items");
  el.innerHTML = "";
  let total = 0;
  cart.forEach(i=>{
    total += i.price;
    el.innerHTML += `<p>${i.name} (${i.size}, ${i.color}) – ${i.price} TJS</p>`;
  });
  document.getElementById("total").innerText = "Итого: " + total + " TJS";
}

function toggleCart(){
  document.getElementById("cart").style.display="block";
  document.getElementById("overlay").style.display="block";
}

// ОФОРМЛЕНИЕ
function sendOrder(){
  const phone = document.getElementById("phone").value;
  const delivery = document.getElementById("delivery").value;
  if(!phone || !delivery){ alert("Введите данные"); return; }

  let msg = "🛍 ЗАКАЗ NOZY Store\n\n";
  cart.forEach(i=>{
    msg += `${i.name} | ${i.size} | ${i.color} | ${i.price} TJS\n`;
  });
  msg += `\n📞 ${phone}\n🚚 ${delivery}`;

  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

// FULLSCREEN + СВАЙП
function openViewer(images){
  currentImages = images;
  currentIndex = 0;
  showImage();
  document.getElementById("viewer").style.display="flex";
  document.getElementById("overlay").style.display="block";

  let startX = 0;
  const img = document.getElementById("viewer-img");

  img.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  img.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if(startX - endX > 40) currentIndex = (currentIndex + 1) % currentImages.length;
    if(endX - startX > 40) currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage();
  });
}

function showImage(){
  document.getElementById("viewer-img").src = currentImages[currentIndex];
  const d = document.getElementById("viewer-dots");
  d.innerHTML="";
  currentImages.forEach((_,i)=>{
    const s = document.createElement("span");
    if(i===currentIndex) s.className="active";
    d.appendChild(s);
  });
}

function closeAll(){
  document.getElementById("cart").style.display="none";
  document.getElementById("viewer").style.display="none";
  document.getElementById("overlay").style.display="none";
}







