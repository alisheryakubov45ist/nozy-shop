let products = [];
let cart = [];
let currentCategory = "Одежда";

// ЗАГРУЗКА ТОВАРОВ
fetch("products.json")
  .then(r => r.json())
  .then(d => {
    products = d.products;
    renderCategories();
    filterCat(currentCategory);
  });

// КАТЕГОРИИ
function renderCategories() {
  const cats = ["Одежда", "Обувь", "Платки", "Аксессуары"];
  const el = document.getElementById("categories");
  el.innerHTML = "";

  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "cat" + (c === currentCategory ? " active" : "");
    d.innerText = c;
    d.onclick = () => {
      currentCategory = c;
      renderCategories();
      filterCat(c);
    };
    el.appendChild(d);
  });
}

function filterCat(cat) {
  renderProducts(products.filter(p => p.category === cat));
}

// ТОВАРЫ
function renderProducts(list) {
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p => {
    let imgIndex = 0;
    let startX = 0;

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = p.images[0];

    // свайп на главном экране
    img.ontouchstart = e => startX = e.touches[0].clientX;
    img.ontouchend = e => {
      let dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        imgIndex = dx < 0
          ? (imgIndex + 1) % p.images.length
          : (imgIndex - 1 + p.images.length) % p.images.length;
        img.src = p.images[imgIndex];
      }
    };

    img.onclick = () => openViewer(p.images);

    const title = document.createElement("h4");
    title.innerText = p.name;

    const price = document.createElement("p");
    price.innerText = p.price + " TJS";

    const color = document.createElement("select");
    p.colors.forEach(c => color.add(new Option(c, c)));

    const size = document.createElement("select");
    p.sizes.forEach(s => size.add(new Option(s, s)));

    const btn = document.createElement("button");
    btn.innerText = "В корзину";
    btn.onclick = () => {
      cart.push({
        name: p.name,
        price: p.price,
        color: color.value,
        size: size.value
      });
      document.getElementById("cart-count").innerText = cart.length;
      renderCart();
    };

    card.append(img, title, price, color, size, btn);
    el.appendChild(card);
  });
}

// КОРЗИНА
function renderCart() {
  const el = document.getElementById("cart-items");
  el.innerHTML = "";
  let total = 0;

  cart.forEach((i, idx) => {
    total += i.price;
    el.innerHTML += `
      <p>
        ${i.name} (${i.size}, ${i.color}) — <b>${i.price} TJS</b>
        <span style="cursor:pointer;color:red" onclick="removeFromCart(${idx})"> ❌</span>
      </p>
    `;
  });

  document.getElementById("total").innerText = "Итого: " + total + " TJS";
}

function removeFromCart(i) {
  cart.splice(i, 1);
  document.getElementById("cart-count").innerText = cart.length;
  renderCart();
}

function toggleCart() {
  document.getElementById("cart").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// ОТПРАВКА В TELEGRAM
function sendOrder() {
  const phone = document.getElementById("phone").value;
  const delivery = document.getElementById("delivery").value;

  if (!phone) {
    alert("Введите номер телефона");
    return;
  }

  let total = 0;
  let msg = "🛍 ЗАКАЗ NOZY Store\n\n";

  cart.forEach(i => {
    msg += `• ${i.name}\n  ${i.size} / ${i.color}\n  💰 ${i.price} TJS\n\n`;
    total += i.price;
  });

  msg += `💵 Итого: ${total} TJS\n`;
  msg += `📞 Телефон: ${phone}\n`;
  msg += `🚚 Получение: ${delivery}`;

  window.open(
    "https://t.me/AMULEEE?text=" + encodeURIComponent(msg),
    "_blank"
  );
}

// FULLSCREEN
let viewerImages = [];
let viewerIndex = 0;
let viewerStartX = 0;

function openViewer(images) {
  viewerImages = images;
  viewerIndex = 0;
  document.getElementById("viewer").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
  showViewer();
}

function showViewer() {
  document.getElementById("viewer-img").src = viewerImages[viewerIndex];
}

const vImg = document.getElementById("viewer-img");

vImg.ontouchstart = e => viewerStartX = e.touches[0].clientX;
vImg.ontouchend = e => {
  let dx = e.changedTouches[0].clientX - viewerStartX;
  if (Math.abs(dx) > 50) {
    viewerIndex = dx < 0
      ? (viewerIndex + 1) % viewerImages.length
      : (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
    showViewer();
  }
};

function closeViewer() {
  document.getElementById("viewer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}


