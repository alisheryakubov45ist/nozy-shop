let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

// Загрузка данных
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
    d.onclick = () => filterCat(c, d);
    el.appendChild(d);
  });
}

function filterCat(cat, domEl){
  renderProducts(products.filter(p => p.category === cat));
  closeAll();
  // выделяем активную категорию
  document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
  domEl.classList.add('active');
}

// ПРОДУКТЫ
function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.images[0];
    img.style.cursor = "pointer";
    let imgIndex = 0;
    img.addEventListener("click", (e) => {
      openViewer(p.images);
      e.stopPropagation();
    });

    const h4 = document.createElement("h4");
    h4.innerText = p.name;

    const price = document.createElement("p");
    price.innerText = `${p.price} TJS`;

    const colorSelect = document.createElement("select");
    colorSelect.id = "c" + p.id;
    p.colors.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.text = c;
      colorSelect.add(opt);
    });

    const sizeSelect = document.createElement("select");
    sizeSelect.id = "s" + p.id;
    p.sizes.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.text = s;
      sizeSelect.add(opt);
    });

    const btn = document.createElement("button");
    btn.className = "btn-cart";
    btn.innerText = "В корзину";
    btn.addEventListener("click", (e) => { addToCart(p.id); e.stopPropagation(); });

    card.appendChild(img);
    card.appendChild(h4);
    card.appendChild(price);
    card.appendChild(colorSelect);
    card.appendChild(sizeSelect);
    card.appendChild(btn);

    el.appendChild(card);
  });
}

// КОРЗИНА
function addToCart(id){
  const p = products.find(x => x.id === id);
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
  cart.forEach((i, idx) => {
    total += i.price;
    el.innerHTML += `<p>${i.name} (${i.size}, ${i.color}) – ${i.price} TJS <span style="cursor:pointer;color:#ff3b30;" onclick="removeFromCart(${idx})">❌</span></p>`;
  });
  document.getElementById("total").innerText = "Итого: "+total+" TJS";
}

function removeFromCart(index){
  cart.splice(index,1);
  document.getElementById("cart-count").innerText = cart.length;
  renderCart();
}

function toggleCart(){
  closeAll(); 
  document.getElementById("cart").style.display="block"; 
  document.getElementById("overlay").style.display="block";
}

// ОФОРМЛЕНИЕ ЗАКАЗА
function sendOrder(){
  const phone = document.getElementById("phone").value;
  const delivery = document.getElementById("delivery").value;
  if(!phone){ alert("Введите номер телефона"); return; }
  let msg = "🛍 ЗАКАЗ NOZY Store\n\n";
  let total = 0;
  cart.forEach(i => {
    msg += `${i.name} | ${i.size} | ${i.color} | ${i.price} TJS\n`;
    total += i.price;
  });
  msg += `\n💰 Итого: ${total} TJS\n📞 ${phone}\n🚚 ${delivery}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

// FULLSCREEN VIEWER
function openViewer(images){
  closeAll();
  currentImages = images;
  currentIndex = 0;
  showImage();
  document.getElementById("viewer").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

function showImage(){
  document.getElementById("viewer-img").src = currentImages[currentIndex];
  const dots = document.getElementById("viewer-dots");
  dots.innerHTML = "";
  currentImages.forEach((_, i) => {
    dots.innerHTML += `<span class="${i===currentIndex?'active':''}">●</span>`;
  });
}

function prevImage(){
  if(currentImages.length===0) return;
  currentIndex = (currentIndex-1 + currentImages.length)%currentImages.length;
  showImage();
}

function nextImage(){
  if(currentImages.length===0) return;
  currentIndex = (currentIndex+1)%currentImages.length;
  showImage();
}

function closeViewer(){
  document.getElementById("viewer").style.display="none";
}

// ОТКРЫТИЯ/ЗАКРЫТИЯ
function closeAll(){
  document.getElementById("cart").style.display="none";
  closeViewer();
  document.getElementById("overlay").style.display="none";
    }
