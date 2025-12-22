let products=[],cart=[],startX=0,viewerIndex=0,viewerImages=[];

fetch("products.json")
.then(r=>r.json())
.then(d=>{
  products=d.products;
  renderCategories(d.categories);
  renderProducts(products);
});

function renderCategories(cats){
  const el=document.getElementById("categories");
  el.innerHTML="";
  cats.forEach(c=>{
    const d=document.createElement("div");
    d.className="cat";
    d.innerText=c;
    d.onclick=()=>renderProducts(products.filter(p=>p.category===c));
    el.appendChild(d);
  });
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

    img.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
    img.addEventListener("touchend",e=>{
      const dx=e.changedTouches[0].clientX-startX;
      if(dx<-40) idx=(idx+1)%p.images.length;
      if(dx>40) idx=(idx-1+p.images.length)%p.images.length;
      img.src=p.images[idx];
    });
    img.onclick=()=>openViewer(p.images);

    const name=document.createElement("p");
    name.innerText=p.name;

    const price=document.createElement("p");
    price.className="price";
    price.innerText=p.price+" TJS";

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

    card.append(img,name,price,color,size,btn);
    el.appendChild(card);
  });
}

function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let total=0;
  cart.forEach(i=>{
    total+=i.price;
    el.innerHTML+=`<p>${i.name} (${i.size}/${i.color}) — ${i.price} TJS</p>`;
  });
  document.getElementById("total").innerText="Итого: "+total+" TJS";
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
  if(!phone)return alert("Введите номер");

  let msg="🛍 ЗАКАЗ NOZY\n";
  cart.forEach(i=>msg+=`${i.name} ${i.size} ${i.color}\n`);
  msg+=`\n📞 ${phone}\n🚚 ${del}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

function openViewer(imgs){
  viewerImages=imgs;
  viewerIndex=0;
  document.getElementById("viewer-img").src=imgs[0];
  renderDots();
  document.getElementById("viewer").style.display="flex";
}

function renderDots(){
  const d=document.getElementById("viewer-dots");
  d.innerHTML="";
  viewerImages.forEach((_,i)=>{
    d.innerHTML+=`<span class="${i===viewerIndex?'active':''}">●</span>`;
  });
}

document.getElementById("viewer-img").addEventListener("touchstart",e=>{
  startX=e.touches[0].clientX;
});
document.getElementById("viewer-img").addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(dx<-40) viewerIndex=(viewerIndex+1)%viewerImages.length;
  if(dx>40) viewerIndex=(viewerIndex-1+viewerImages.length)%viewerImages.length;
  document.getElementById("viewer-img").src=viewerImages[viewerIndex];
  renderDots();
});

function closeViewer(){
  document.getElementById("viewer").style.display="none";
}









