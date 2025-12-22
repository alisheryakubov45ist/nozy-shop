let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

fetch("products.json")
  .then(r=>r.json())
  .then(data=>{
    products=data.products;
    renderCategories(data.categories);
    renderProducts(products);
  });

function toggleMenu(){closeAll(); document.getElementById("side-menu").style.left="0px"; document.getElementById("overlay").style.display="block";}
function filterCat(cat){renderProducts(products.filter(p=>p.category===cat)); closeAll();}

function renderCategories(cats){
  const el=document.getElementById("categories");
  el.innerHTML="";
  cats.forEach(c=>{
    const d=document.createElement("div");
    d.className="cat";
    d.innerText=c;
    d.onclick=()=>filterCat(c);
    el.appendChild(d);
  });
}

function renderProducts(list){
  const el=document.getElementById("products");
  el.innerHTML="";
  list.forEach(p=>{
    el.innerHTML+=`
    <div class="card">
      <img id="img-${p.id}" src="${p.images[0]}" onclick='openViewer(${JSON.stringify(p.images)})'>
      <h4>${p.name}</h4>
      <p>${p.price} TJS</p>
      <select class="select" id="c${p.id}">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select>
      <select class="select" id="s${p.id}">${p.sizes.map(s=>`<option>${s}</option>`).join("")}</select>
      <button onclick="addToCart(${p.id})">В корзину</button>
    </div>`;
  });
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  cart.push({name:p.name,price:p.price,color:document.getElementById("c"+id).value,size:document.getElementById("s"+id).value});
  document.getElementById("cart-count").innerText=cart.length;
  renderCart();
}

function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let total=0;
  cart.forEach((i,idx)=>{
    total+=i.price;
    el.innerHTML+=`<p>${i.name} (${i.size}, ${i.color}) – ${i.price} TJS <span style="cursor:pointer;color:#ff3b30;" onclick="removeFromCart(${idx})">❌</span></p>`;
  });
  document.getElementById("total").innerText="Итого: "+total+" TJS";
}

function removeFromCart(index){
  cart.splice(index,1);
  document.getElementById("cart-count").innerText=cart.length;
  renderCart();
}

function toggleCart(){closeAll(); document.getElementById("cart").style.display="block"; document.getElementById("overlay").style.display="block";}

function sendOrder(){
  const phone=document.getElementById("phone").value;
  if(!phone){alert("Введите номер телефона"); return;}
  let msg="🛍 ЗАКАЗ NOZY Store\n\n";
  let total=0;
  cart.forEach(i=>{msg+=`${i.name} | ${i.size} | ${i.color} | ${i.price} TJS\n`; total+=i.price;});
  msg+=`\n💰 Итого: ${total} TJS\n📞 ${phone}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

// FULLSCREEN VIEWER
function openViewer(images){
  closeAll();
  document.getElementById("overlay").style.display="block";
  currentImages=images;
  currentIndex=0;
  showImage();
  document.getElementById("viewer").style.display="flex";
}

function showImage(){
  document.getElementById("viewer-img").src=currentImages[currentIndex];
  const dots=document.getElementById("viewer-dots");
  dots.innerHTML="";
  currentImages.forEach((_,i)=>{dots.innerHTML+=`<span class="${i===currentIndex?"active":""}">●</span>`;});
}

function prevImage(){
  if(currentImages.length===0) return;
  currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;
  showImage();
}
function nextImage(){
  if(currentImages.length===0) return;
  currentIndex=(currentIndex+1)%currentImages.length;
  showImage();
}

function closeViewer(){document.getElementById("viewer").style.display="none";}
function closeAll(){
  document.getElementById("cart").style.display="none";
  document.getElementById("side-menu").style.left="-260px";
  closeViewer();
  document.getElementById("overlay").style.display="none";
}
