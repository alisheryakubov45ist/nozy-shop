let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

// LOAD
fetch("products.json")
  .then(r => r.json())
  .then(d => {
    products = d.products;
    renderCategories(d.categories);
    renderProducts(products);
  });

function toggleMenu(){
  document.getElementById("menu").classList.toggle("active");
  document.getElementById("overlay").style.display = "block";
}

// CATEGORIES
function renderCategories(cats){
  const el = document.getElementById("categories");
  el.innerHTML = "";
  cats.forEach(c=>{
    const d = document.createElement("div");
    d.className = "cat";
    d.innerText = c;
    d.onclick = ()=>{
      renderProducts(products.filter(p=>p.category===c));
      closeAll();
    };
    el.appendChild(d);
  });
}

// PRODUCTS + SWIPE
function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p=>{
    let idx = 0, startX = 0;

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.images[0];

    img.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
    img.addEventListener("touchend",e=>{
      const endX=e.changedTouches[0].clientX;
      if(startX-endX>40) idx=(idx+1)%p.images.length;
      if(endX-startX>40) idx=(idx-1+p.images.length)%p.images.length;
      img.src=p.images[idx];
    });

    img.onclick=()=>openViewer(p.images);

    const title=document.createElement("p");
    title.innerText=p.name;

    const price=document.createElement("p");
    price.innerText=p.price+" TJS";

    const btn=document.createElement("button");
    btn.className="btn-cart";
    btn.innerText="В корзину";
    btn.onclick=()=>addToCart(p);

    card.append(img,title,price,btn);
    el.appendChild(card);
  });
}

// CART
function addToCart(p){
  cart.push(p);
  document.getElementById("cart-count").innerText=cart.length;
  renderCart();
}

function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let total=0;
  cart.forEach(i=>{
    total+=i.price;
    el.innerHTML+=`<p>${i.name} — ${i.price} TJS</p>`;
  });
  document.getElementById("total").innerText="Итого: "+total+" TJS";
}

function toggleCart(){
  document.getElementById("cart").style.display="block";
  document.getElementById("overlay").style.display="block";
}

// ORDER
function sendOrder(){
  let msg="Заказ NOZY Store:\n";
  cart.forEach(i=>msg+=i.name+" - "+i.price+" TJS\n");
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

// FULLSCREEN
function openViewer(images){
  currentImages=images;
  currentIndex=0;
  document.getElementById("viewer-img").src=images[0];
  document.getElementById("viewer").style.display="flex";
  document.getElementById("overlay").style.display="block";
}

function closeViewer(){
  document.getElementById("viewer").style.display="none";
  document.getElementById("overlay").style.display="none";
}

// CLOSE ALL
function closeAll(){
  document.getElementById("menu").classList.remove("active");
  document.getElementById("cart").style.display="none";
  document.getElementById("overlay").style.display="none";
}







