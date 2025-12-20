let cart = [];

const products = [
  {
    id:1,
    name:"Oversize Hoodie",
    price:420,
    category:"clothes",
    images:[
      "https://images.unsplash.com/photo-1520974735194-6c1c90bb4f14",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23"
    ],
    sizes:["M","L","XL"],
    colors:["Чёрный","Серый"]
  },
  {
    id:2,
    name:"Nike Air Force",
    price:750,
    category:"shoes",
    images:[
      "https://images.unsplash.com/photo-1606813909029-52d9f8d45d62",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
    ],
    sizes:["40","41","42"],
    colors:["Белый","Чёрный"]
  }
];

let current = {};

function render(list) {
  const box = document.getElementById("products");
  box.innerHTML = "";

  list.forEach(p=>{
    current[p.id]=0;
    box.innerHTML += `
      <div class="card">
        <div class="carousel">
          <img id="img-${p.id}" src="${p.images[0]}">
          <button class="prev" onclick="slide(${p.id},-1)">‹</button>
          <button class="next" onclick="slide(${p.id},1)">›</button>
        </div>

        <h3>${p.name}</h3>
        <p>${p.price} сомони</p>

        <select id="size-${p.id}">
          <option>Размер</option>
          ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
        </select>

        <select id="color-${p.id}">
          <option>Цвет</option>
          ${p.colors.map(c=>`<option>${c}</option>`).join("")}
        </select>

        <button onclick="add(${p.id})">В корзину</button>
      </div>
    `;
  });
}

function slide(id,dir){
  const p = products.find(x=>x.id===id);
  current[id]=(current[id]+dir+p.images.length)%p.images.length;
  document.getElementById(`img-${id}`).src=p.images[current[id]];
}

function add(id){
  const p = products.find(x=>x.id===id);
  cart.push(p);
  updateCart();
}

function updateCart(){
  document.getElementById("cart-count").innerText = cart.length+" товаров";
  document.getElementById("cart-sum").innerText =
    cart.reduce((s,p)=>s+p.price,0)+" сомони";
}

function checkout(){
  let text="Заказ:%0A";
  cart.forEach(p=> text+=`• ${p.name} - ${p.price} сомони%0A`);
  window.open("https://t.me/YOUR_USERNAME?text="+text,"_blank");
}

function filter(cat){
  if(cat==="all") render(products);
  else render(products.filter(p=>p.category===cat));
}

render(products);
