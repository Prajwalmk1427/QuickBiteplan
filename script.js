const foods=[
{id:1,name:"Truffle Margherita Pizza",cat:"Pizza",price:329,emoji:"🍕",desc:"Tomato, mozzarella and fresh basil"},
{id:2,name:"Smoky Chicken Burger",cat:"Burger",price:249,emoji:"🍔",desc:"Grilled chicken, smoked sauce and greens"},
{id:3,name:"Classic Veg Burger",cat:"Burger",price:169,emoji:"🍔",desc:"Crispy veg patty with fresh vegetables"},
{id:4,name:"Chicken Biryani",cat:"Indian",price:229,emoji:"🍛",desc:"Aromatic rice with spices and tender chicken"},
{id:5,name:"Paneer Tikka Bowl",cat:"Indian",price:219,emoji:"🥘",desc:"Charred paneer, rice, mint and chutney"},
{id:6,name:"Garden Green Bowl",cat:"Healthy",price:199,emoji:"🥗",desc:"Avocado, greens, corn and dressing"},
{id:7,name:"Fresh Lime Fizz",cat:"Drinks",price:99,emoji:"🥤",desc:"Refreshing lemon sparkling drink"},
{id:8,name:"Cold Coffee",cat:"Drinks",price:129,emoji:"☕",desc:"Chilled creamy coffee"},
{id:9,name:"Fruit Salad",cat:"Healthy",price:149,emoji:"🍓",desc:"Fresh seasonal fruits"}
];
let cart=[];

function $(id){return document.getElementById(id)}
function openModal(id){$(id).classList.remove("hidden")}
function closeModal(id){$(id).classList.add("hidden")}

function render(list){
 $("resultInfo").textContent=`Showing ${list.length} item${list.length===1?"":"s"}`;
 $("foodGrid").innerHTML=list.length?list.map(f=>`
 <div class="card"><div class="pic">${f.emoji}</div><div class="info">
 <h3>${f.name}</h3><p>${f.desc}</p><div class="row"><b>₹${f.price}</b>
 <button class="add" data-add="${f.id}">+</button></div></div></div>`).join("") :
 `<div class="empty">😕<br><br>No food found.<br>Try burger, pizza, biryani or chicken.</div>`;
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(Number(b.dataset.add)));
}

function search(){
 const q=$("searchInput").value.trim().toLowerCase();
 const result=q?foods.filter(f=>(f.name+" "+f.cat+" "+f.desc).toLowerCase().includes(q)):foods;
 document.querySelectorAll(".cats button").forEach(b=>b.classList.remove("active"));
 render(result);
}
$("searchInput").addEventListener("input",search);
$("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")search()});
$("searchBtn").onclick=search;

document.querySelectorAll(".cats button").forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll(".cats button").forEach(b=>b.classList.remove("active"));
 btn.classList.add("active");$("searchInput").value="";
 const cat=btn.dataset.cat;render(cat==="All"?foods:foods.filter(f=>f.cat===cat));
});

function add(id){
 const item=foods.find(f=>f.id===id);const existing=cart.find(f=>f.id===id);
 if(existing)existing.qty++;else cart.push({...item,qty:1});
 updateCart();openModal("cartModal");toast(item.name+" added to cart");
}
function change(id,d){
 const item=cart.find(f=>f.id===id);if(!item)return;
 item.qty+=d;if(item.qty<=0)cart=cart.filter(f=>f.id!==id);updateCart();
}
function updateCart(){
 const count=cart.reduce((a,f)=>a+f.qty,0),total=cart.reduce((a,f)=>a+f.price*f.qty,0);
 $("cartCount").textContent=count;$("total").textContent=total;$("checkoutTotal").textContent=total;
 $("cartItems").innerHTML=cart.length?cart.map(f=>`
 <div class="cartrow"><span>${f.emoji} <b>${f.name}</b><br><small>₹${f.price} × ${f.qty}</small></span>
 <span class="qty"><button data-minus="${f.id}">−</button>${f.qty}<button data-plus="${f.id}">+</button></span></div>`).join("") :
 `<div class="empty">Your cart is empty 🛒</div>`;
 document.querySelectorAll("[data-minus]").forEach(b=>b.onclick=()=>change(Number(b.dataset.minus),-1));
 document.querySelectorAll("[data-plus]").forEach(b=>b.onclick=()=>change(Number(b.dataset.plus),1));
}

$("cartBtn").onclick=()=>{updateCart();openModal("cartModal")};
$("closeCart").onclick=()=>closeModal("cartModal");
$("closeCheckout").onclick=()=>closeModal("checkoutModal");

$("checkoutBtn").onclick=()=>{
 if(cart.length===0){toast("Please add a food item first");return}
 $("checkoutTotal").textContent=cart.reduce((a,f)=>a+f.price*f.qty,0);
 closeModal("cartModal");openModal("checkoutModal");
};

$("orderForm").onsubmit=function(e){
 e.preventDefault();
 const name=$("name").value.trim();
 if(!name||!$("phone").checkValidity()||!$("address").value.trim()){
   toast("Please fill all details correctly");return;
 }
 const order="QB"+Math.floor(100000+Math.random()*900000);
 $("successText").textContent=`Thank you, ${name}! Your order ${order} has been placed successfully.`;
 cart=[];updateCart();closeModal("checkoutModal");openModal("successModal");this.reset();
};
$("doneBtn").onclick=()=>closeModal("successModal");
$("exploreBtn").onclick=()=>$("menu").scrollIntoView({behavior:"smooth"});

function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");clearTimeout(window.tt);window.tt=setTimeout(()=>$("toast").classList.add("hidden"),2200)}

render(foods);updateCart();
