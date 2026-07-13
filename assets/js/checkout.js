const checkoutLastSubmitKey = 'checkoutLastSubmitTime';
const checkoutMinLoadingTime = 700;
const checkoutT = key => i18n.t(key);

function canCheckoutSubmit() {
    const last = Number(localStorage.getItem(checkoutLastSubmitKey) || 0);
    return Date.now() - last >= 30000;
}

function showCheckoutLoading() {
    const loading = document.getElementById('checkoutLoading');
    if (!loading) return;
    loading.classList.add('visible');
    loading.setAttribute('aria-hidden', 'false');
}

function hideCheckoutLoading() {
    const loading = document.getElementById('checkoutLoading');
    if (!loading) return;
    loading.classList.remove('visible');
    loading.setAttribute('aria-hidden', 'true');
}

function setCheckoutFormDisabled(disabled) {
    document.querySelectorAll('#checkoutForm input, #checkoutForm textarea, #checkoutForm button')
        .forEach(control => {
            control.disabled = disabled;
        });
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForLoadingPaint() {
    await new Promise(resolve => requestAnimationFrame(resolve));
    await wait(80);
}

async function waitForMinimumLoading(startTime) {
    const elapsed = Date.now() - startTime;
    if (elapsed < checkoutMinLoadingTime) {
        await wait(checkoutMinLoadingTime - elapsed);
    }
}

function getCheckoutCart() {
    try {
        const cart = JSON.parse(sessionStorage.getItem('kaolaCart') || '[]');
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error('读取购物车失败', error);
        return [];
    }
}

function formatCheckoutItems(cart) {
    return cart.map(item => {
        const options = [item.size, ...(item.toppings || []), item.ice, item.sugar]
            .filter(Boolean)
            .join(', ');
        return `${item.itemKey || ''} ${item.name || ''}${options ? ` (${options})` : ''} x${item.qty || 1}`.trim();
    }).join('\n');
}

function syncAddressField() {
    const addressField = document.getElementById('addressField');
    const addressInput = document.getElementById('address');
    const isDelivery = document.querySelector('input[name="deliveryType"]:checked')?.value === '配送';

    if (!addressField || !addressInput) return;

    addressField.hidden = !isDelivery;
    addressInput.disabled = !isDelivery;
}

document.querySelectorAll('input[name="deliveryType"]').forEach(input => {
    input.addEventListener('change', syncAddressField);
});

syncAddressField();

document.getElementById('checkoutForm').onsubmit = async e => {
    e.preventDefault();

    if (!canCheckoutSubmit()) {
        alert(checkoutT('wait_to_submit'));
        return;
    }

    const name = document.getElementById("name").value.trim();
    const contactMethod = document.getElementById('contactMethod').value;
    const account = document.getElementById("account").value.trim();
    const address = document.getElementById("address").value.trim();
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value || '配送';
    const remark = document.getElementById("remark").value.trim();
    const cart = getCheckoutCart();

    if (!name) {
        alert(checkoutT('enter_name'));
        document.getElementById('name').focus();
        return;
    }

    if (!account) {
        alert(checkoutT('enter_contact_account'));
        document.getElementById('account').focus();
        return;
    }

    const phonePattern = /^[0-9\s+\-()]{6,20}$/;
    if (contactMethod === 'Phone' && !phonePattern.test(account)) {
        alert(checkoutT('invalid_phone'));
        document.getElementById('account').focus();
        return;
    }

    if (deliveryType === '配送' && !address) {
        alert(checkoutT('enter_address'));
        document.getElementById('address').focus();
        return;
    }

    if (cart.length === 0) {
        alert(checkoutT('empty_cart'));
        return;
    }

    const form = new FormData();
    form.append("submitType", "order");
    form.append("name", name);
    form.append("contactMethod", contactMethod);
    form.append("account", account);
    form.append("address", address);
    form.append("type", deliveryType);
    form.append("items", formatCheckoutItems(cart));
    form.append("total", String(cart.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.qty) || 1);
    }, 0)));
    form.append("remark", remark);

    localStorage.setItem(checkoutLastSubmitKey, String(Date.now()));
    const loadingStartTime = Date.now();
    setCheckoutFormDisabled(true);
    showCheckoutLoading();
    await waitForLoadingPaint();

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            body: form
        });
        await waitForMinimumLoading(loadingStartTime);
        alert(checkoutT('submit_success'));
        sessionStorage.removeItem('kaolaCart')
        location.reload();
    } catch (error) {
        console.error(error);
        await waitForMinimumLoading(loadingStartTime);
        alert(checkoutT('submit_failed'));
    } finally {
        hideCheckoutLoading();
        setCheckoutFormDisabled(false);
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
