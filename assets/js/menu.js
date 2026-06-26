const products=[
{id:1,name:{zh:'黑糖珍珠奶茶',en:'Brown Sugar Milk Tea',sr:'Milk čaj sa braon šećerom'},price:550},
{id:2,name:{zh:'茉莉奶绿',en:'Jasmine Milk Tea',sr:'Jasmin mlečni čaj'},price:450}
];
const cart=[];
function render(){
 const lang=localStorage.lang||'zh';
 const wrap=document.getElementById('products');
 wrap.innerHTML='';
 products.forEach(p=>{
  wrap.innerHTML+=`<div class="card"><h3>${p.name[lang]}</h3><p>${p.price} RSD</p><button onclick="add(${p.id})">+</button></div>`;
 });
 update();
}
function add(id){
 const p=products.find(x=>x.id===id);
 const e=cart.find(x=>x.id===id);
 if(e)e.qty++; else cart.push({id,qty:1,price:p.price,name:p.name});
 update();
}
function update(){
 const lang=localStorage.lang||'zh';
 let total=0;
 const c=document.getElementById('cartItems');
 c.innerHTML='';
 cart.forEach(i=>{total+=i.qty*i.price;c.innerHTML+=`<div>${i.name[lang]} x${i.qty}</div>`});
 document.getElementById('total').textContent='Total: '+total+' RSD';
 localStorage.cart=JSON.stringify(cart);
}

// Language switcher
document.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = localStorage.lang || 'zh';
    langSwitch.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
      render();
    });
  }
  render();
});

// Listen for language changes from other components
window.addEventListener('languageChanged', (e) => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = e.detail.lang;
  }
  render();
});
