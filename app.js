let products = [];
let cart = [];
let startX = 0;
let indexes = {};

// FULLSCREEN VARIABLES
let viewerImages = [];
let viewerIndex = 0;
let viewerStartX = 0;
let autoCarouselInterval = null;

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");
const viewerDots = document.getElementById("viewer-dots");
const cartEl = document.getElementById("cart");

// ЗАГРУЗКА ТОВАРОВ
fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data;
    render();
  });

// РЕНДЕР ТОВАРОВ
function render() {
  const box = document.getElementById("products");
  box.innerHTML = "";

  products.forEach(p => {
    indexes[p.id] = 0;

    box.innerHTML += `
      <div class="card">
        <div ontouchstart="touchStart(event)"
             ontouchend="touchEnd(event, ${p.id})">
          <img id="img-${p.id}"
               src="${p.images[0]}"
               onclick='openViewer("${p.images[0]}", ${JSON.stringify(p.images)})'>
        </div>
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
        <button onclick="addToCart(${p.id})">Добавить</button>
      </div>
    `;
  });
}

// СВАЙП В КАРТОЧКЕ
function touchStart(e) { startX = e.touches[0].clientX; }

function touchEnd(e, id) {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 50) return;

  const p = products.find(x => x.id === id);
  if (!p) return;

  if (diff > 0) indexes[id]++; else indexes[id]--;
  if (indexes[id] < 0) indexes[id] = p.images.length-1;
  if (indexes[id] >= p.images.length) indexes[id] = 0;

  document.getElementById(`img-${id}`).src = p.images[indexes[id]];
}

// КОРЗИНА
function addToCart(id) {
  cart.push(products.find(p => p.id === id));
  renderCart();
}

function toggleCart() {
  cartEl.style.display = cartEl.style.display==="block"?"none":"block";
}

function renderCart() {
  const items = document.getElementById("cart-items");
  items.innerHTML = "";

  let total = 0;
  cart.forEach((p, i) => {
    total += p.price;
    items.innerHTML += `
      <p>
        ${p.title} — $${p.price} 
        <button onclick="removeFromCart(${i})">✖</button>
      </p>`;
  });

  document.getElementById("total").innerText = "Итого: $" + total;
}

function removeFromCart(index) {
  cart.splice(index,1);
  renderCart();
}

// ОФОРМЛЕНИЕ ЗАКАЗА
function checkout() {
  const phone = document.getElementById("phone").value;
  if (!phone) return alert("Введите номер телефона");

  let text = "🛍 Заказ NOZY Store\n\n";
  cart.forEach(p => text += `${p.title} — $${p.price}\n`);
  text += `\n992973589922: ${phone}`;

  window.location.href =
    `https://t.me/AMULEEE?text=${encodeURIComponent(text)}`;
}

// FULLSCREEN
function openViewer(src, images = []) {
  viewerImages = images;
  viewerIndex = images.indexOf(src);
  if (viewerIndex === -1) viewerIndex = 0;
  updateViewer();
  viewer.style.display = "flex";
  startAutoCarousel();
}

function updateViewer() {
  viewerImg.style.opacity = 0;
  setTimeout(() => {
    viewerImg.src = viewerImages[viewerIndex];
    viewerImg.style.opacity = 1;
  }, 150);
  renderDots();
}

function renderDots() {
  viewerDots.innerHTML = "";
  viewerImages.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.textContent = "●";
    if (i !== viewerIndex) dot.style.opacity = 0.5;
    else dot.classList.add("active");
    viewerDots.appendChild(dot);
  });
}

function closeViewer() {
  viewer.style.display = "none";
  stopAutoCarousel();
}

// SWIPE В FULLSCREEN
viewer.addEventListener("touchstart", e => { viewerStartX = e.touches[0].clientX; stopAutoCarousel(); });

viewer.addEventListener("touchend", e => {
  const diff = viewerStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 50) return;

  if (diff > 0) viewerIndex++; else viewerIndex--;
  if (viewerIndex < 0) viewerIndex = viewerImages.length - 1;
  if (viewerIndex >= viewerImages.length) viewerIndex = 0;

  updateViewer();
  startAutoCarousel();
});

// AUTO-CAROUSEL
function startAutoCarousel() {
  if (autoCarouselInterval) clearInterval(autoCarouselInterval);
  autoCarouselInterval = setInterval(() => {
    viewerIndex = (viewerIndex + 1) % viewerImages.length;
    updateViewer();
  }, 4000);
}

function stopAutoCarousel() { if (autoCarouselInterval) clearInterval(autoCarouselInterval); }


