let products = [];
let cart = [];
let currentImages = [];
let currentIndex = 0;
let autoSwipe;

fetch("products.json")
  .then(r => r.json())
  .then(data => {
    products = data.products;
    renderCategories(data.categories);
    renderProducts(products);
  });

function renderCategories(cats) {
  const el = document.getElementById("categories");
  el.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat";
    d.innerText = c;
    d.onclick = () => renderProducts(products.filter(p => p.category === c));
    el.appendChild(d);
  });
}

function renderProducts(list) {
  const el = document.getElementById("products");
  el.innerHTML = "";
  list.forEach(p => {
    el.innerHTML += `
      <div class="card">
        <img id="img-${p.id}" src="${p.images[0]}" onclick='openViewer(${JSON.stringify(p.images)})'>
        <h4>${p.name}</h4>
        <p>${p.price} TJS</p>

        <select class="select" id="c${p.id}">
          ${p.colors.map(c=>`<option>${c}</option>`).join("")}
        </select>

        <select class="select" id="s${p.id}">
          ${p.sizes.map(s=>`<option>${s}</option>`).join("")}
        </select>

        <button onclick="addToCart(${p.id})">В корзину</button>
      </div>
    `;

    startAutoSwipe(`img-${p.id}`, p.images);
  });
}

function startAutoSwipe(imgId, images) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % images.length;
    const img = document.getElementById(imgId);
    if (img) img.src = images[i];
  }, 2500);
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  cart.push({
    name: p.name,
    price: p.price,
    color: document.getElementById("c"+id).value,
    size: document.getElementById("s"+id).value
  });
  renderCart();
}

function renderCart() {
  const el = document.getElementById("cart-items");
  el.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    total += i.price;
    el.innerHTML += `<p>${i.name} (${i.size}, ${i.color}) – ${i.price} TJS</p>`;
  });
  document.getElementById("total").innerText = "Итого: " + total + " TJS";
}

function toggleCart() {
  const c = document.getElementById("cart");
  c.style.display = c.style.display === "block" ? "none" : "block";
}

function sendOrder() {
  const phone = document.getElementById("phone").value;
  if (!phone) { alert("Введите номер телефона"); return; }

  let msg = "🛍 ЗАКАЗ NOZY Store\n\n";
  let total = 0;

  cart.forEach(i => {
    msg += `${i.name} | ${i.size} | ${i.color} | ${i.price} TJS\n`;
    total += i.price;
  });

  msg += `\n💰 Итого: ${total} TJS\n📞 ${phone}`;

  window.open("https://t.me/AMULEEE?text=" + encodeURIComponent(msg));
}

function openViewer(images) {
  currentImages = images;
  currentIndex = 0;
  showImage();
  document.getElementById("viewer").style.display = "flex";

  autoSwipe = setInterval(() => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage();
  }, 2500);
}

function showImage() {
  document.getElementById("viewer-img").src = currentImages[currentIndex];
  const dots = document.getElementById("viewer-dots");
  dots.innerHTML = "";
  currentImages.forEach((_, i) => {
    dots.innerHTML += `<span class="${i === currentIndex ? "active" : ""}">●</span>`;
  });
}

function closeViewer() {
  document.getElementById("viewer").style.display = "none";
  clearInterval(autoSwipe);
}

