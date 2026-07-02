const checkoutLastSubmitKey = 'checkoutLastSubmitTime';

function canCheckoutSubmit() {
    const last = Number(localStorage.getItem(checkoutLastSubmitKey) || 0);
    return Date.now() - last >= 30000;
}

document.getElementById('checkoutForm').onsubmit = async e => {
    e.preventDefault();

    if (!canCheckoutSubmit()) {
        alert('请 30 秒后再提交');
        return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const remark = document.getElementById("remark").value.trim();

    if (!name) {
        alert('请输入姓名');
        document.getElementById('name').focus();
        return;
    }

    if (!phone) {
        alert('请输入电话');
        document.getElementById('phone').focus();
        return;
    }

    const phonePattern = /^[0-9\s+\-()]{6,20}$/;
    if (!phonePattern.test(phone)) {
        alert('请输入有效的电话号码');
        document.getElementById('phone').focus();
        return;
    }

    if (!address) {
        alert('请输入地址');
        document.getElementById('address').focus();
        return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("phone", phone);
    form.append("address", address);
    form.append("remark", remark);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: form
        });
        const text = await res.text();
        console.log(text);
        localStorage.setItem(checkoutLastSubmitKey, String(Date.now()));
        alert('提交成功');
    } catch (error) {
        console.error(error);
        alert('提交失败，请稍后重试');
    }
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