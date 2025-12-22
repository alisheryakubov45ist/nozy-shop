let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  });

function renderProducts(list) {
  const el = document.getElementById('products');
  el.innerHTML = '';

  list.forEach(p => {
    el.innerHTML += `
    <div class="card">
      <div class="slider" onclick="openViewer(${p.id})">
        <img src="${p.images[0]}" id="img-${p.id}">
      </div>
      <div class="dots">${p.images.map((_,i)=>`<span ${i==0?'class="active"':''}></span>`).join('')}</div>
      <h4>${p.name}</h4>
      <p>${p.price} сомони</p>
      <button onclick="addToCart(${p.id})">В корзину</button>
    </div>
    `;
  });
}

function filterCategory(cat){
  if(cat==='all') renderProducts(products);
  else renderProducts(products.filter(p=>p.category===cat));
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  cart.push({...p, qty:1});
  document.getElementById('cart-count').innerText = cart.length;
  renderCart();
}

function toggleCart(){
  document.getElementById('cart').classList.toggle('open');
}

function renderCart(){
  const el = document.getElementById('cart-items');
  let total = 0;
  el.innerHTML = '';
  cart.forEach(i=>{
    total += i.price * i.qty;
    el.innerHTML += `<p>${i.name} × ${i.qty}</p>`;
  });
  document.getElementById('total').innerText = total;
}

function sendOrder(){
  const phone = document.getElementById('phone').value;
  const delivery = document.getElementById('delivery').value;
  if(!phone || !delivery) return alert('Введите данные');

  let text = `Заказ NOZY Store%0AТел: ${phone}%0AСпособ: ${delivery}%0A`;
  cart.forEach(i=> text += `${i.name} - ${i.price} сомони%0A`);

  window.open(`https://t.me/AMULEEE?text=${text}`, '_blank');
}

function openViewer(id){
  const p = products.find(x=>x.id===id);
  currentImages = p.images;
  currentIndex = 0;
  document.getElementById('viewer-img').src = currentImages[0];
  document.getElementById('viewer').style.display='flex';
}

function closeViewer(e){
  if(e.target.id==='viewer'){
    document.getElementById('viewer').style.display='none';
  }
}

function nextImage(e){
  e.stopPropagation();
  currentIndex = (currentIndex+1)%currentImages.length;
  document.getElementById('viewer-img').src = currentImages[currentIndex];
}

function prevImage(e){
  e.stopPropagation();
  currentIndex = (currentIndex-1+currentImages.length)%currentImages.length;
  document.getElementById('viewer-img').src = currentImages[currentIndex];
}
