let cart=[],products=[],slideIndex={},startX=0;

// Загрузка JSON
window.onload=()=>{
  fetch('products.json')
    .then(res=>res.json())
    .then(data=>{products=data;render(products);document.getElementById("loader").style.display="none"})
    .catch(err=>console.error(err));
};

// Рендер товаров
function render(list){
  const box=document.getElementById("products");
  box.innerHTML="";
  list.forEach(p=>{
    slideIndex[p.id]=0;
    box.innerHTML+=`
      <div class="card">
        <div class="carousel" ontouchstart="touchStart(event,${p.id})" ontouchend="touchEnd(event,${p.id})">
          <img src="${p.images[0]}" onclick="openViewer('${p.images[0]}')">
        </div>
        <h3>${p.name}</h3>
        <p>${p.price} сомони</p>
        <label>Цвет:
          <select id="color-${p.id}">${p.colors.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
        </label>
        <label>Размер:
          <select id="size-${p.id}">${p.sizes.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
        </label>
        <button onclick="add(${p.id})">В корзину</button>
      </div>
    `;
  });
}

// Свайп фото
function touchStart(e,id){startX=e.changedTouches[0].screenX}
function touchEnd(e,id){
  let endX=e.changedTouches[0].screenX;
  if(startX-endX>50) slide(id,1);
  if(endX-startX>50) slide(id,-1);
}
function slide(id,dir){
  const p=products.find(x=>x.id===id);
  slideIndex[id]=(slideIndex[id]+dir+p.images.length)%p.images.length;
  document.querySelector(`[onclick="openViewer('${p.images[slideIndex[id]]}')"]`).src=p.images[slideIndex[id]];
}

// Полноэкранный просмотр
function openViewer(src){document.getElementById("viewer-img").src=src;document.getElementById("viewer").style.display="flex";}
function closeViewer(){document.getElementById("viewer").style.display="none";}

// Корзина
function add(id){
  const p=products.find(x=>x.id===id);
  const color=document.getElementById(`color-${id}`).value;
  const size=document.getElementById(`size-${id}`).value;
  const item=cart.find(i=>i.id===id && i.color===color && i.size===size);
  if(item)item.qty++; else cart.push({...p,qty:1,color,size});
  updateCart();
}

// Удалить товар
function removeItem(index){cart.splice(index,1);updateCart();}

// Обновляем счётчик и список
function updateCart(){
  let qty=0,sum=0;
  cart.forEach(i=>{qty+=i.qty;sum+=i.qty*i.price});
  document.getElementById("cart-count-bubble").innerText=qty;
  document.getElementById("cart-total").innerText = `Итого: ${sum} сомони`;
  updateCartList();
}

// Показать список корзины
function toggleCartList(){
  const list=document.getElementById("cart-list");
  if(list.style.display==="flex") list.style.display="none";
  else {updateCartList();list.style.display="flex";}
}

// Обновляем список внутри корзины
function updateCartList(){
  const container=document.getElementById("cart-items");
  container.innerHTML="";
  cart.forEach((i,index)=>{
    const div=document.createElement("div");
    div.innerHTML=`<span><b>${i.name}</b> (${i.color}, ${i.size}) x${i.qty} — ${i.price*i.qty} сомони</span>
    <span class="remove-btn" onclick="removeItem(${index})">✖</span>`;
    container.appendChild(div);
  });
}

// Оформление
function checkout(){
  if(cart.length===0){alert("Корзина пуста!");return;}
  let text="Заказ:%0A";
  cart.forEach(i=>{text+=`${i.name} (${i.color}, ${i.size}) x${i.qty} — ${i.price*i.qty} сомони%0A`});
  text+=`Самовывоз: г. Душанбе, мечеть Мехкалонна
Оплата при получении
Телефон поддержки: +992901234567`;
  window.open("https://t.me/YOUR_USERNAME?text="+encodeURIComponent(text));
  window.open("https://wa.me/992901234567?text="+encodeURIComponent(text));
}

// Фильтр
function filter(cat){cat==="all"?render(products):render(products.filter(p=>p.category===cat))}




