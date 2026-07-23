const consumeLastSubmitKey = 'consumeLastSubmitTime';
const consumeRecordsKey = 'consumeRecords';
const consumeNumberPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
const consumeMinLoadingTime = 700;

function getConsumeRecords() {
    try {
        const records = JSON.parse(localStorage.getItem(consumeRecordsKey) || '[]');
        return Array.isArray(records) ? records : [];
    } catch {
        return [];
    }
}

function isSameDay(left, right) {
    return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate();
}

function renderConsumeSummary() {
    const now = new Date();
    const records = getConsumeRecords();
    const todayRecords = records.filter(record => isSameDay(new Date(record.createdAt), now));
    const monthRecords = records.filter(record => {
        const date = new Date(record.createdAt);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    });
    const todayTotal = todayRecords.reduce((total, record) => total + Number(record.amount || 0), 0);

    document.getElementById('todayConsumeCount').innerHTML =
        `${todayRecords.length} <small>笔</small>`;
    document.getElementById('todayConsumeTotal').innerHTML =
        `${todayTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })} <small>DIN</small>`;
    document.getElementById('monthConsumeCount').innerHTML =
        `${monthRecords.length} <small>次</small>`;
}

function setConsumeLoading(visible) {
    const loading = document.getElementById('dailyLoading');
    loading.classList.toggle('visible', visible);
    loading.setAttribute('aria-hidden', String(!visible));
    document.body.classList.toggle('daily-is-loading', visible);

    document.querySelectorAll('#consumeForm input, #consumeForm textarea, #consumeForm button')
        .forEach(control => {
            control.disabled = visible;
        });
}

function waitForConsume(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('consumeForm').addEventListener('submit', async event => {
    event.preventDefault();

    const amountInput = document.getElementById('consume');
    const remarkInput = document.getElementById('remark');
    const amount = amountInput.value.trim();
    const remark = remarkInput.value.trim();

    if (!consumeNumberPattern.test(amount) || Number(amount) <= 0) {
        alert('请输入有效的消费金额');
        amountInput.focus();
        return;
    }

    if (!remark) {
        alert('请输入消费备注');
        remarkInput.focus();
        return;
    }

    console.log(amount, "amountamount")
    const lastSubmitTime = Number(localStorage.getItem(consumeLastSubmitKey) || 0);
    if (Date.now() - lastSubmitTime < 10000) {
        alert('请勿重复提交，请稍后再试');
        return;
    }

    localStorage.setItem(consumeLastSubmitKey, String(Date.now()));
    const loadingStartTime = Date.now();
    setConsumeLoading(true);
    await new Promise(resolve => requestAnimationFrame(resolve));

    const form = new FormData();
    form.append('amount', amount);
    form.append('remark', remark);
    form.append('submitType', 'consume');

    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: form
        });

        const elapsed = Date.now() - loadingStartTime;
        if (elapsed < consumeMinLoadingTime) {
            await waitForConsume(consumeMinLoadingTime - elapsed);
        }

        const records = getConsumeRecords();
        records.push({
            amount: Number(amount),
            remark,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(consumeRecordsKey, JSON.stringify(records));
        renderConsumeSummary();
        document.getElementById('consumeForm').reset();
        alert('消费记录提交成功');
    } catch (error) {
        console.error(error);
        localStorage.removeItem(consumeLastSubmitKey);
        alert('提交失败，请检查网络后重试');
    } finally {
        setConsumeLoading(false);
    }
});

renderConsumeSummary();
