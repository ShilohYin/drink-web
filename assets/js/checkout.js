document.getElementById('checkoutForm').onsubmit = async e => {
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.target).entries());
    data.cart=JSON.parse(localStorage.cart||'[]');
    alert('这里调用 Google Apps Script API\n'+JSON.stringify(data,null,2));

};

// Language switcher
document.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = localStorage.getItem('lang') || 'zh';
    langSwitch.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
    });
  }
});

// Listen for language changes from other components
window.addEventListener('languageChanged', (e) => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = e.detail.lang;
  }
});