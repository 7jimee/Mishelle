const products={
  1:{name:"Botánica suave",price:28000},2:{name:"Formas orgánicas",price:34000},
  3:{name:"Líneas en calma",price:25000},4:{name:"Jardín sutil",price:32000}
};
let cart={};
const money=n=>"$ "+Math.round(n).toLocaleString("es-AR");
const cartDrawer=document.getElementById("cartDrawer");
function updateCart(){
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById("cartCount").textContent=count;
  const items=document.getElementById("cartItems");
  if(!count){items.innerHTML='<p class="empty-cart">Todavía no agregaste productos.</p>';}
  else{
    items.innerHTML=Object.entries(cart).map(([id,qty])=>`<div class="cart-row"><div><strong>${products[id].name}</strong><small>${money(products[id].price)} · unidad</small></div><div class="qty-controls"><button data-qty="-1" data-id="${id}">−</button><b>${qty}</b><button data-qty="1" data-id="${id}">+</button></div></div>`).join("");
  }
  const total=Object.entries(cart).reduce((s,[id,q])=>s+products[id].price*q,0);
  document.getElementById("cartTotal").textContent=money(total);
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900);}
document.querySelectorAll(".add-cart").forEach(b=>b.addEventListener("click",()=>{cart[b.dataset.id]=(cart[b.dataset.id]||0)+1;updateCart();showToast("¡Agregaste "+products[b.dataset.id].name+"!");}));
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(!b)return;const id=b.dataset.id;cart[id]=(cart[id]||0)+Number(b.dataset.qty);if(cart[id]<=0)delete cart[id];updateCart();});
function openCart(){document.body.classList.add("cart-open");}
function closeCart(){document.body.classList.remove("cart-open");}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.getElementById("checkout").addEventListener("click",()=>{
  if(!Object.keys(cart).length){showToast("Tu carrito está vacío");return;}
  const lines=Object.entries(cart).map(([id,q])=>`${products[id].name} x${q} — ${money(products[id].price*q)}`).join("%0A");
  const total=Object.entries(cart).reduce((s,[id,q])=>s+products[id].price*q,0);
  window.open(`https://wa.me/543415978662?text=Hola%20Mishelle!%20Quiero%20consultar%20por%20este%20pedido:%0A${lines}%0A%0ATotal%20estimado:%20${money(total)}`,"_blank");
});
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".product-card").forEach(card=>card.hidden=b.dataset.filter!=="todos"&&card.dataset.category!==b.dataset.filter);});
document.querySelectorAll(".quick-view").forEach(b=>b.addEventListener("click",()=>{const p=products[b.dataset.product];showToast(`${p.name} · ${money(p.price)} · Consultá por personalización`);}));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));

const fields=["materials","supplies","packagingCost","hours","hourRate","profit"].map(id=>document.getElementById(id));
function calculate(){
  const [m,s,p,h,r,profit]=fields.map(x=>Math.max(0,Number(x.value)||0));
  const cost=m+s+p+h*r, suggested=cost*(1+profit/100);
  document.getElementById("profitLabel").textContent=profit+"%";
  document.getElementById("totalCost").textContent=money(cost);
  document.getElementById("suggestedPrice").textContent=money(suggested);
  document.getElementById("estimatedProfit").textContent=money(suggested-cost);
}
fields.forEach(f=>f.addEventListener("input",calculate));calculate();
document.getElementById("resetCalc").addEventListener("click",()=>{["8500","1800","2200","3","2500","35"].forEach((v,i)=>fields[i].value=v);calculate();});

document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("customerName").value.trim();
  const phone=document.getElementById("customerPhone").value.trim();
  const type=document.getElementById("orderType").value,size=document.getElementById("orderSize").value,surface=document.getElementById("orderSurface").value,details=document.getElementById("orderDetails").value.trim();
  const msg=`Hola Mishelle! Soy ${name}.%0AQuiero consultar por: ${type}.%0ATamaño: ${size}.%0ASuperficie: ${surface}.%0AMi WhatsApp: ${phone||"No indicado"}.%0AIdea y detalles: ${details||"A conversar"}.`;
  window.open("https://wa.me/543415978662?text="+msg,"_blank");
});

// Interactive 3D box: drag with mouse/touch and rotate with controls.
const stage=document.getElementById("boxStage"),box=document.getElementById("box3d");
let rotX=-18,rotY=-28,dragging=false,lastX=0,lastY=0;
function paintBox(){box.style.transform=`rotateX(${rotX}deg) rotateY(${rotY}deg)`;}
function startDrag(e){dragging=true;lastX=e.clientX;lastY=e.clientY;}
function moveDrag(e){if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;rotY+=dx*.65;rotX-=dy*.45;rotX=Math.max(-65,Math.min(65,rotX));lastX=e.clientX;lastY=e.clientY;paintBox();}
stage.addEventListener("pointerdown",e=>{startDrag(e);stage.setPointerCapture(e.pointerId);});
stage.addEventListener("pointermove",moveDrag);
stage.addEventListener("pointerup",()=>dragging=false);
stage.addEventListener("pointercancel",()=>dragging=false);
document.getElementById("rotateLeft").addEventListener("click",()=>{rotY-=25;paintBox();});
document.getElementById("rotateRight").addEventListener("click",()=>{rotY+=25;paintBox();});
document.getElementById("resetBox").addEventListener("click",()=>{rotX=-18;rotY=-28;paintBox();});
