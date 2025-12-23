let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;
let currentCategory = "Все";

fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderCategories(["Все","Одежда","Обувь","Платки","Аксессуары"]);
    renderProducts(products);
  });

/* ---------- КАТЕГОРИИ ---------- */
function renderCategories(cats){
  const el = document.getElementById("categories");
  el.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat" + (c===currentCategory ? " active":"");
    d.innerText = c;
    d.onclick = () => {
      currentCategory = c;
      renderCategories(cats);
      if(c==="Все") renderProducts(products);
      else renderProducts(products.filter(p=>p.category===c));
    };
    el.appendChild(d);
  });
}

/* ---------- ТОВАРЫ ---------- */
function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    // КАРУСЕЛЬ
    let idx = 0;
    const img = document.createElement("img");
    img.src = p.images[0];
    img.onclick = () => openViewer(p.images);

    img.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    img.addEventListener("touchend", e => {
      let dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx)>40){
        idx = dx<0 ? (idx+1)%p.images.length : (idx-1+p.images.length)%p.images.length;
        img.src = p.images[idx];
        updateDots();
      }
    });

    const dots = document.createElement("div");
    dots.className = "dots";

    function updateDots(){
      dots.innerHTML="";
      p.images.forEach((_,i)=>{
        const s=document.createElement("span");
        s.className=i===idx?"active":"";
        s.innerText="●";
        dots.appendChild(s);
      });
    }
    updateDots();

    /* 🔥 ВОЗВРАЩАЕМ НАЗВАНИЕ И ЦЕНУ */
    const title = document.createElement("h4");
    title.innerText = p.name;

    const price = document.createElement("p");
    price.innerText = p.price + " TJS";

    const color = document.createElement("select");
    p.colors.forEach(c=>{
      const o=document.createElement("option");
      o.value=c; o.text=c;
      color.appendChild(o);
    });

    const size = document.createElement("select");
    p.sizes.forEach(s=>{
      const o=document.createElement("option");
      o.value=s; o.text=s;
      size.appendChild(o);
    });

    const btn = document.createElement("button");
    btn.innerText="В корзину";
    btn.onclick=()=>addToCart(p,title.innerText,price.innerText,color.value,size.value);

    card.append(img,dots,title,price,color,size,btn);
    el.appendChild(card);
  });
}

/* ---------- КОРЗИНА ---------- */
function addToCart(p,name,price,color,size){
  cart.push({name,price, color,size});
  document.getElementById("cart-count").innerText=cart.length;
  renderCart();
}

function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let total=0;
  cart.forEach((i,n)=>{
    total+=parseInt(i.price);
    el.innerHTML+=`<p>${i.name} (${i.size}, ${i.color}) — ${i.price}</p>`;
  });
  document.getElementById("total").innerText="Итого: "+total+" TJS";
}

function toggleCart(){
  document.getElementById("cart").style.display="block";
  document.getElementById("overlay").style.display="block";
}

function sendOrder(){
  const phone=document.getElementById("phone").value;
  if(!phone) return alert("Введите номер");
  let msg="🛍 Заказ NOZY Store\n\n";
  cart.forEach(i=>msg+=`${i.name} ${i.size} ${i.color} ${i.price}\n`);
  msg+=`\n📞 ${phone}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

/* ---------- FULLSCREEN ---------- */
function openViewer(imgs){
  currentImages=imgs; currentIndex=0;
  showViewer();
  document.getElementById("viewer").style.display="flex";
}

function showViewer(){
  document.getElementById("viewer-img").src=currentImages[currentIndex];
  const d=document.getElementById("viewer-dots");
  d.innerHTML="";
  currentImages.forEach((_,i)=>{
    d.innerHTML+=`<span class="${i===currentIndex?"active":""}">●</span>`;
  });
}

function closeViewer(){
  document.getElementById("viewer").style.display="none";
}

function closeAll(){
  closeViewer();
  document.getElementById("cart").style.display="none";
  document.getElementById("overlay").style.display="none";
}


