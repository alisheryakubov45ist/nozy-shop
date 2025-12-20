let cart=[];
let startX=0;

// JSON с товарами
const products=[
 {
  id:1,
  name:"Oversize Hoodie",
  price:420,
  category:"clothes",
  colors:["Чёрный","Белый","Серый","Синий"],
  sizes:["XS","S","M","L","XL","XXL","XXXL"],
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
  colors:["Белый","Чёрный","Синий","Красный"],
  sizes:["36","37","38","39","40","41","42","43","44","45","46"],
  images:[
   "https://images.unsplash.com/photo-1606813909029-52d9f8d45d62",
   "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
  ]
 },
 {
  id:3,
  name:"Silk Scarf",
  price:180,
  category:"scarves",
  colors:["Красный","Чёрный","Белый","Зелёный"],
  sizes:["20x20","30x30","40x40","50x50","60x60","70x70","80x80","90x90"],
  images:[
   "https://images.unsplash.com/photo-1581092580494-3b1e6937e9eb",
   "https://images.unsplash.com/photo-1572331161851-2c0d0be1aa35"
  ]
 },
 {
  id:4,
  name:"Leather Belt",
  price:220,
  category:"accessories",
  colors:["Коричневый","Чёрный"],
  sizes:["80","85","90","95","100","105","110"],
  images:[
   "https://images.unsplash.com/photo-1593032465175-8c0f0bbd4cd5",
   "https://images.unsplash.com/photo-1593032479402-9d1e3c4b8f5e"
  ]
 }
];

let slideIndex={};

// Рендер товаров из JSON
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
    <p>Цвет: ${p.colors.join(", ")}</p>
    <p>Размер: ${p.sizes.join(", ")}</p>
    <button onclick="add(${p.id})">В корзину</button>
   </div>
  `;
 });
}

// Свайп по фото
function touchStart(e,id){startX=e.changedTouches[0].screenX}
function touchEnd(e,id){
 let endX=e.changedTouches[0].screenX;
 if(startX-endX>50) slide(id,1);
 if(endX-startX>50) slide(id,-1);
}

// Листаем фото
function slide(id,dir){
 const p=products.find(x=>x.id===id);
 slideIndex[id]=(slideIndex[id]+dir+p.images.length)%p.images.length;
 document.querySelector(`[onclick="openViewer('${p.images[slideIndex[id]]}')"]`).src=p.images[slideIndex[id]];
}

// Полноэкранный просмотр
function openViewer(src){
 document.getElementById("viewer-img").src=src;
 document.getElementById("viewer").style.display="flex";
}
function closeViewer(){
 document.getElementById("viewer").style.display="none";
}

// Корзина
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

// Оформление заказа
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

// Фильтр по категории
function filter(cat){
 if(cat==="all") render(products);
 else render(products.filter(p=>p.category===cat));
}

// Загрузка
window.onload=()=>{
 render(products);
 document.getElementById("loader").style.display="none";
}
