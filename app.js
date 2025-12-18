const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { name: "Кроссовки Nike", price: 750 },
  { name: "Футболка Adidas", price: 250 }
];

const box = document.getElementById("products");

products.forEach(p => {
  const div = document.createElement("div");
  div.innerHTML = `
    <p>${p.name} — ${p.price} сомони</p>
    <button>Заказать</button>
  `;
  box.appendChild(div);
});
