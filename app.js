let products=[],cart=[],currentCategory="Одежда";

/* LOAD */
fetch("products.json")
.then(r=>r.json())
.then(d=>{
  products=d.products;
  renderCategories();
  filterCat(currentCategory);
});

/* CATEGORIES */
function renderCategories(){
  const cats=["Одежда","Обувь","Платки","Аксессуары"];
  const el=document.getElementById("categories");
  el.innerHTML="";
  cats.forEach(c=>{
    const d=document.createElement("div");
    d.className="cat"+(c===currentCategory?" active":"");
    d.innerText=c;
    d.onclick=()=>{currentCategory=c;renderCategories();filterCat(c);}
    el.appendChild(d);
  });
}

/* PRODUCTS */
function filterCat(cat){
  renderProducts(products.filter(p=>p.category===cat));
}

function renderProducts(list){
  const el=document.getElementById("products");
  el.innerHTML="";
  list.forEach(p=>{
    let idx=0,startX=0;

    const card=document.createElement("div");
    card.className="card";

    const wrap=document.createElement("div");
    wrap.className="img-wrap";

    const img=document.createElement("img");
    img.src=p.images[0];

    const dots=document.createElement("div");
    dots.className="dots";

    function update(){
      img.src=p.images[idx];
      dots.innerHTML=p.images.map((_,i)=>`<span class="${i===idx?'active':''}">●</span>`).join("");
    }
    update();

    wrap.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
    wrap.addEventListener("touchend",e=>{
      const dx=e.changedTouches[0].clientX-startX;
      if(Math.abs(dx)>40){
        idx=(dx<0?idx+1:idx-1+p.images.length)%p.images.length;
        update();
      }
    });

    wrap.onclick=()=>openViewer(p.images,idx);

    wrap.append(img,dots);

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

    card.append(wrap,`<h4>${p.name}</h4>`,`<p>${p.price} TJS</p>`,color,size,btn);
    el.appendChild(card);
  });
}

/* CART */
function renderCart(){
  const el=document.getElementById("cart-items");
  el.innerHTML="";
  let t=0;
  cart.forEach(i=>{t+=i.price;el.innerHTML+=`<p>${i.name} ${i.size}/${i.color}</p>`});
  document.getElementById("total").innerText="Итого: "+t+" TJS";
}

function toggleCart(){
  cart.length&& (document.getElementById("cart").style.display="block",
  document.getElementById("overlay").style.display="block");
}

function closeAll(){
  document.getElementById("cart").style.display="none";
  document.getElementById("overlay").style.display="none";
  closeViewer();
}

/* ORDER */
function sendOrder(){
  const phone=document.getElementById("phone").value;
  const del=document.getElementById("delivery").value;
  let msg="🛍 NOZY Store\n";
  cart.forEach(i=>msg+=`${i.name} ${i.size}/${i.color}\n`);
  msg+=`📞 ${phone}\n🚚 ${del}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

/* FULLSCREEN */
let vImgs=[],vIdx=0,startX=0;

function openViewer(arr,i){
  vImgs=arr;vIdx=i;
  const v=document.getElementById("viewer");
  const img=document.getElementById("viewer-img");
  const blur=document.getElementById("blur-bg");
  const dots=document.getElementById("viewer-dots");

  function upd(){
    img.src=vImgs[vIdx];
    blur.style.backgroundImage=`url(${vImgs[vIdx]})`;
    dots.innerHTML=vImgs.map((_,i)=>`<span class="${i===vIdx?'active':''}">●</span>`).join("");
  }
  upd();

  v.style.display="flex";

  v.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
  v.addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].clientX-startX;
    if(Math.abs(dx)>40){
      vIdx=(dx<0?vIdx+1:vIdx-1+vImgs.length)%vImgs.length;
      upd();
    }
  });

  v.onclick=closeViewer;
}

function closeViewer(){
  document.getElementById("viewer").style.display="none";
}
