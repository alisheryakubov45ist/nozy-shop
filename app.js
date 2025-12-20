let cart=[];
let startX=0;

const products=[
 {
  id:1,
  name:"Oversize Hoodie",
  price:420,
  category:"clothes",
  images:[
   "https://images.unsplash.com/photo-1520974735194-6c1c90bb4f14",
   "https://images.unsplash.com/photo-1618354691438-25bc04584c23"
  ]
 },
 {
  id:2,
  name:"Nike Air Force",
  price:750,
  category:"shoes",
  images:[
   "https://images.unsplash.com/photo-1606813909029-52d9f8d45d62",
   "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
  ]
 }
];

let slideIndex={};

function render(list){
 const box=document.getElementById("products");
 box.innerHTML="";
 list.forEach(p=>{
  slideIndex[p.id]=0;
  box.innerHTML+=`
   <div class="card">
    <div class="carousel"
      ontouchstart="touchStart(event,${p.id})"
      ontouchend="touchEnd(event,${p.id})">
     <img src="${p.images[0]}" onclick="openViewer('${p.images[slideIndex[p.id]]}')">
    </div>
    <h3>${p.name}</h3>
    <p>${p.price} сомони</p>
    <button onclick="add(${p.id})">В корзину</button>
   </div>
  `;
 });
}

function touchStart(e,id){startX=e.changedTouches[0].screenX}
function touchEnd(e,id){
 let endX=e.changedTouches[0].screenX;
 if(startX-endX>50) slide(id,1);
 if(endX-startX>50) slide(id,-1);
}

function slide(id,dir){
 const p=products.find(x=>x.id===id);
 slideIndex[id]=(slideIndex[id]+dir+p.images.length)%p.images.length;
 document.querySelector(`[onclick="openViewer('${p.images[slideIndex[id]]}')"]`).src=p.images[slideIndex[id]];
}

function openViewer(src){
 document.getElementById("viewer-img").src=src;
 document.getElementById("viewer").style.display="flex";
}
function closeViewer(){
 document.getElementById("viewer").style.display="none";
}

function add(id){
 const p=products.find(x=>x.id===id);
 const item=cart.find(i=>i.id===id);
 if(item) item.qty++;
 else cart.push({...p,qty:1});
 updateCart();
}

function updateCart(){
 let qty=0,sum=0;
 cart.forEach(i=>{qty+=i.qty;sum+=i.qty*i.price});
 document.getElementById("cart-count").innerText=qty;
 document.getElementById("cart-sum").innerText=sum;
}

function checkout(){
 let text="Заказ:%0A";
 cart.forEach(i=>{
  text+=`${i.name} x${i.qty} — ${i.price*i.qty} сомони%0A`;
 });
 text+=`
Самовывоз: г. Душанбе, мечеть Мехкалонна
Оплата при получении
 `;
 window.open("https://t.me/AMULEEE?text="+encodeURIComponent(text));
 window.open("https://wa.me/992973589922?text="+encodeURIComponent(text));
}

function filter(cat){
 if(cat==="all") render(products);
 else render(products.filter(p=>p.category===cat));
}

window.onload=()=>{
 render(products);
 document.getElementById("loader").style.display="none";
}

