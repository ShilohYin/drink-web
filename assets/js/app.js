const GAS_URL='https://script.google.com/macros/s/AKfycbzjv9udncYbCQlFec7b9XVyK45hQYqc5u8G2sytjD9BXeQGUuU31q0mKg4FM_45M9KH/exec';
async function submitOrder(order){
 return fetch(GAS_URL,{method:'POST',body:JSON.stringify(order)});
}

// Language switcher
document.getElementById('langSwitch').value = localStorage.getItem('lang') || 'zh';
document.getElementById('langSwitch').addEventListener('change', (e) => {
  i18n.setLanguage(e.target.value);
});

// Listen for language changes
window.addEventListener('languageChanged', (e) => {
  document.getElementById('langSwitch').value = e.detail.lang;
});
