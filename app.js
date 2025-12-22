let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;
let startX = 0;

fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderCategories(data.categories);
    renderProducts(products);
  });

function renderCategories(cats){
  const top = document.getElementById("categories");
  const menu = document.getElementById("categories-menu");
  top.innerHTML = menu.innerHTML = "";

  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat";
    d.innerText = c;
    d.onclick = () => filterCat(c);
    top.appendChild(d);
    menu.appendChild(d.cloneNode(true));
  });
}

function filterCat(cat){
  renderProducts(products.filter(p => p.category === cat));
  closeAll();
}

function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p => {
    let idx = 0;
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.images[0];

    img.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    img.addEventListener("touchend", e => {
      const dx = e.changedTouches[0].clientX - startX;
      if(dx < -40) idx = (idx+1)%p.images.length;
      if(dx > 40) idx = (idx-1+p.images.length)%p.images.length;
      img.src = p.images[idx];
    });

    img.onclick = () => openViewer(p.images);

    const name = document.createElement("p");
    name.innerText = p.name;

    const price = document.createElement("p");
    price.className = "price";
    price.innerText = p.price + " TJS";

    const color = document.createElement("select");
    p.colors.forEach(c => color.add(new Option(c,c)));

    const size = document.createElement("select");
    p.sizes.forEach(s => size.add(new Option(s,s)));

    const btn = document.createElement("button");
    btn.className = "btn-cart";
    btn.innerText = "В корзину";
    btn.onclick = () => {
      cart.push({name:p.name,price:p.price,color:color.value,size:size.value});
      document.getElementById("cart-count").innerText = cart.length;
      renderCart();
    };

    card.append(img,name,price,color,size,btn);
    el.appendChild(card);
  });
}

function renderCart(){
  const el = document.getElementById("cart-items");
  el.innerHTML = "";
  let total = 0;
  cart.forEach((i,n)=>{
    total+=i.price;
    el.innerHTML+=`<p>${i.name} (${i.size}/${i.color}) ${i.price} TJS ❌</p>`;
  });
  document.getElementById("total").innerText = "Итого: "+total+" TJS";
}

function toggleCart(){ openBlock("cart"); }
function toggleMenu(){ openBlock("side-menu"); }

function openBlock(id){
  closeAll();
  document.getElementById(id).style.display="block";
  document.getElementById("side-menu").style.left="0";
  document.getElementById("overlay").style.display="block";
}

function closeAll(){
  document.getElementById("cart").style.display="none";
  document.getElementById("side-menu").style.left="-260px";
  document.getElementById("overlay").style.display="none";
  closeViewer();
}

function sendOrder(){
  const phone=document.getElementById("phone").value;
  if(!phone) return alert("Введите номер");
  let msg="🛍 ЗАКАЗ NOZY\n";
  cart.forEach(i=>msg+=`${i.name} ${i.size} ${i.color}\n`);
  msg+=`\n📞 ${phone}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

function openViewer(images){
  currentImages = images;
  currentIndex = 0;
  showImage();
  document.getElementById("viewer").style.display="flex";
  document.getElementById("overlay").style.display="block";
}

function showImage(){
  document.getElementById("viewer-img").src = currentImages[currentIndex];
  const d = document.getElementById("viewer-dots");
  d.innerHTML="";
  currentImages.forEach((_,i)=>d.innerHTML+=`<span class="${i===currentIndex?'active':''}">●</span>`);
}

function closeViewer(e){
  if(e && e.target.id!=="viewer") return;
  document.getElementById("viewer").style.display="none";
}








