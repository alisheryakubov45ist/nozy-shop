let products=[];
let cart=[];
let currentCategory="Одежда";

fetch("products.json")
.then(r=>r.json())
.then(d=>{
  products=d.products;
  renderCategories();
  filterCat(currentCategory);
});

function renderCategories(){
  const cats=["Одежда","Обувь","Платки","Аксессуары"];
  const el=document.getElementById("categories");
  el.innerHTML="";
  cats.forEach(c=>{
    const d=document.createElement("div");
    d.className="cat"+(c===currentCategory?" active":"");
    d.innerText=c;
    d.onclick=()=>{
      currentCategory=c;
      renderCategories();
      filterCat(c);
    };
    el.appendChild(d);
  });
}

function filterCat(cat){
  renderProducts(products.filter(p=>p.category===cat));
}

function renderProducts(list){
  const el=document.getElementById("products");
  el.innerHTML="";
  list.forEach(p=>{
    let idx=0;
    const card=document.createElement("div");
    card.className="card";

    const img=document.createElement("img");
    img.src=p.images[0];

    let sx=0;
    img.ontouchstart=e=>sx=e.touches[0].clientX;
    img.ontouchend=e=>{
      const dx=e.changedTouches[0].clientX-sx;
      if(Math.abs(dx)>50){
        idx=(dx<0?idx+1:idx-1+p.images.length)%p.images.length;
        img.src=p.images[idx];
      }
    };

    img.onclick=()=>openViewer(p.images);

    card.innerHTML=`
      <h4>${p.name}</h4>
      <p>${p.price} TJS</p>
    `;

    const color=document.createElement("select");
    p.colors.forEach(c=>color.add(new Option(c,c)));

    const size=document.createElement("select");
    p.sizes.forEach(s=>size.add(new Option(s,s)));

    const btn=document.createElement("button");
    btn.innerText="В корзину";
    btn.onclick=()=>{
      cart.push({name:p.name,price:p.price,color:color.value,size:size.value});
      document.getElementById("cart-count").innerText=cart.length;
      renderCart();
    };

    card.prepend(img);
    card.append(color,size,btn);
    el.appendChild(card);
  });
}

function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let t=0;
  cart.forEach(i=>{
    t+=i.price;
    el.innerHTML+=`<p>${i.name} ${i.size}/${i.color} — ${i.price}</p>`;
  });
  document.getElementById("total").innerText="Итого: "+t+" TJS";
}

function toggleCart(){
  document.getElementById("cart").style.display="block";
  document.getElementById("overlay").style.display="block";
}

function closeAll(){
  document.getElementById("cart").style.display="none";
  document.getElementById("overlay").style.display="none";
  closeViewer();
}

function sendOrder(){
  const phone=document.getElementById("phone").value;
  const del=document.getElementById("delivery").value;
  let msg="🛍 Заказ NOZY\n";
  let t=0;
  cart.forEach(i=>{msg+=`${i.name} ${i.size}/${i.color}\n`;t+=i.price;});
  msg+=`💰 ${t} TJS\n📞 ${phone}\n🚚 ${del}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

let viewerImgs=[],vIdx=0;
function openViewer(arr){
  viewerImgs=arr;vIdx=0;
  showV();
  document.getElementById("viewer").style.display="flex";
  document.getElementById("overlay").style.display="block";
}
function showV(){
  document.getElementById("viewer-img").src=viewerImgs[vIdx];
}
function closeViewer(){
  document.getElementById("viewer").style.display="none";
}
