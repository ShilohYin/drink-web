document.getElementById('checkoutForm').onsubmit = async e => {
    e.preventDefault();
    
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("phone", document.getElementById("phone").value);
    // form.append("type", document.getElementById("phone").value);
    // form.append("address", document.getElementById("address").value);
    // form.append("items", document.getElementById("phone").value);
    // form.append("total", document.getElementById("phone").value);
    form.append("remark", document.getElementById("remark").value);

    fetch(API_URL, {
        method: "POST",
        body: form
    })
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
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