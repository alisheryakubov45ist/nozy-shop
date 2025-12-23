let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

// Загрузка данных
fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderCategories(data.categories);
    renderProducts(products);
  });

// КАТЕГОРИИ
function renderCategories(cats){
  const el = document.getElementById("categories");
  el.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat";
    d.innerText = c;
    d.onclick = () => filterCat(c, d);
    el.appendChild(d);
  });
}

function filterCat(cat, domEl){
  renderProducts(products.filter(p => p.category === cat));
  closeAll();
  document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
  domEl.classList.add('active');
}

// ПРОДУКТЫ
function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.images[0];
    img.style.cursor = "pointer";

    // Свайп фото
    let imgIndex = 0;
    const dotsContainer = document.createElement("div");
    dotsContainer.className="swipe-dots";
    function updateDots(){
      dotsContainer.innerHTML = "";
      p.images.forEach((_,i)=>{
        const sp = document.createElement("span");
        sp.className = i===imgIndex?'active':'';
        sp.innerText='●';
        dotsContainer.appendChild(sp);
      });
    }
    updateDots();

    img.addEventListener("click", (e)=>{
      openViewer(p.images);
      e.stopPropagation();
    });

    img.addEventListener("touchstart", handleTouchStart, false);
    img.addEventListener("touchmove", handleTouchMove, false);

    let xStart = null;
    function handleTouchStart(evt) { xStart = evt.touches[0].clientX; }
    function handleTouchMove(evt){
      if(!xStart) return;
      let xEnd = evt.touches[0].clientX;
      let diff = xStart - xEnd;
      if(diff > 50){ imgIndex=(imgIndex+1)%p.images.length; img.src=p.images[imgIndex]; updateDots(); xStart=null;}
      else if(diff<-50){ imgIndex=(imgIndex-1+p.images.length)%p.images.length; img.src=p.images[imgIndex]; updateDots(); xStart=null;}
    }

    const h4 = document.createElement("h4");
    h4.innerText = p.name;

    const price = document.createElement("p");
    price.innerText = `${p.price} TJS`;

    const colorSelect = document.createElement("select");
    colorSelect.id = "c" + p.id;
    p.colors.forEach(c => { const opt=document.createElement("option"); opt.value=c; opt.text=c; colorSelect.add(opt); });

    const sizeSelect = document.createElement("select");
    sizeSelect.id = "s" + p.id;
    p.sizes.forEach(s => { const opt=document.createElement("option"); opt.value=s; opt.text=s; sizeSelect.add(opt); });

    const btn = document.createElement("button");
    btn.innerText="В корзину";
    btn.onclick=()=>addToCart(p.id);

    card.appendChild(img);
    card.appendChild(dotsContainer);
    card.appendChild(h4);
    card.appendChild(price);
    card.appendChild(colorSelect);
    card.appendChild(sizeSelect);
    card.appendChild(btn);

    el.appendChild(card);
  });
}

// КОРЗИНА
function addToCart(id){
  const p = products.find(x=>x.id===id);
  cart.push({name:p.name, price:p.price, color:document.getElementById("c"+id).value, size:document.getElementById("s"+id).value});
  document.getElementById("cart-count").innerText = cart.length;
  renderCart();
}

function renderCart(){
  const el = document.getElementById("cart-items");
  el.innerHTML="";
  let total=0;
  cart.forEach((i,idx)=>{
    total+=i.price;
    el.innerHTML+=`<p>${i.name} (${i.size}, ${i.color}) – ${i.price} TJS <span style="cursor:pointer;color:#ff3b30;" onclick="removeFromCart(${idx})">❌</span></p>`;
  });
  document.getElementById("total").innerText="Итого: "+total+" TJS";
}

function removeFromCart(index){ cart.splice(index,1); document.getElementById("cart-count").innerText = cart.length; renderCart(); }

function toggleCart(){ closeAll(); document.getElementById("cart").style.display="block"; document.getElementById("overlay").style.display="block"; }

function sendOrder(){
  const phone=document.getElementById("phone").value;
  const delivery=document.getElementById("delivery").value;
  if(!phone){alert("Введите номер телефона"); return;}
  let msg="🛍 ЗАКАЗ NOZY Store\n\n";
  let total=0;
  cart.forEach(i=>{ msg+=`${i.name} | ${i.size} | ${i.color} | ${i.price} TJS\n`; total+=i.price; });
  msg+=`\n💰 Итого: ${total} TJS\n📞 ${phone}\n🚚 ${delivery}`;
  window.open("https://t.me/AMULEEE?text="+encodeURIComponent(msg));
}

// FULLSCREEN VIEWER
function openViewer(images){
  closeAll();
  currentImages = images;
  currentIndex = 0;
  showImage();
  const v = document.getElementById("viewer");
  v.style.display="flex";
  document.getElementById("overlay").style.display="block";

  // Свайпы
  v.addEventListener("touchstart", handleTouchStart,false);
  v.addEventListener("touchmove", handleTouchMove,false);

  let xStart = null;
  function handleTouchStart(evt){ xStart=evt.touches[0].clientX; }
  function handleTouchMove(evt){
    if(!xStart) return;
    let xEnd=evt.touches[0].clientX;
    let diff=xStart-xEnd;
    if(diff>50){ nextImage(); xStart=null; }
    else if(diff<-50){ prevImage(); xStart=null; }
  }

  // Клик по пустому полю
  document.getElementById("viewer").onclick = function(e){
    if(e.target.id === "viewer"){ closeViewer(); }
  };
}

function showImage(){
  document.getElementById("viewer-img").src=currentImages[currentIndex];
  const dots=document.getElementById("viewer-dots");
  dots.innerHTML="";
  currentImages.forEach((_,i)=>{
    const sp=document.createElement("span");
    sp.innerText='●';
    sp.className=i===currentIndex?'active':'';
    dots.appendChild(sp);
  });
}

function prevImage(){ if(currentImages.length===0) return; currentIndex=(currentIndex-1+currentImages.length)%currentImages.length; showImage(); }
function nextImage(){ if(currentImages.length===0) return; currentIndex=(currentIndex+1)%currentImages.length; showImage(); }
function closeViewer(){ document.getElementById("viewer").style.display="none"; }

function closeAll(){ document.getElementById("cart").style.display="none"; closeViewer(); document.getElementById("overlay").style.display="none"; }
