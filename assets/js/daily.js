const dailyLastSubmitKey = 'dailyLastSubmitTime';
const dailyNumberPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
const dailyMinLoadingTime = 700;

function canDailySubmit() {
    const last = Number(localStorage.getItem(dailyLastSubmitKey) || 0);
    return Date.now() - last >= 10000;
}

function getDailyFormValues() {
    return {
        votes: document.getElementById("votes").value.trim(),
        cash: document.getElementById("cash").value.trim(),
        // rmb: document.getElementById("rmb").value.trim(),
        consume: document.getElementById("consume").value.trim(),
        wolt: document.getElementById("wolt").value.trim(),
        material: document.getElementById("material").value.trim(),
        remark: document.getElementById("remark").value.trim(),
        other: document.getElementById("other").value.trim()
    };
}

function validateDailyValues(values) {
    if (!values.votes) {
        alert('请输入票额');
        document.getElementById('votes').focus();
        return false;
    }

    if (!values.cash) {
        alert('请输入现金金额');
        document.getElementById('cash').focus();
        return false;
    }

    if (!dailyNumberPattern.test(values.votes)) {
        alert('票额请输入有效数字');
        document.getElementById('votes').focus();
        return false;
    }

    if (!dailyNumberPattern.test(values.cash)) {
        alert('现金请输入有效数字');
        document.getElementById('cash').focus();
        return false;
    }

    const optionalFields = [
        // { id: 'rmb', value: values.rmb, label: '扫码支付' },
        { id: 'consume', value: values.consume, label: '消费支出' },
        { id: 'wolt', value: values.wolt, label: 'Wolt外卖' },
        { id: 'other', value: values.other, label: '其它支付' }
    ];

    for (const field of optionalFields) {
        if (field.value && !dailyNumberPattern.test(field.value)) {
            alert(`${field.label}请输入有效数字`);
            document.getElementById(field.id).focus();
            return false;
        }
    }

    return true;
}

function toDailyNumber(value) {
    return Number(value || 0);
}

function calculateDailyResult(values) {
    return toDailyNumber(values.votes)
        - toDailyNumber(values.cash)
        - toDailyNumber(values.consume)
        // - toDailyNumber(values.rmb) * 15
        - toDailyNumber(values.other);
}

function showDailyResult(result) {
    const resultEl = document.getElementById('dailyResult');
    resultEl.textContent = `计算结果：${result.toFixed(2)} RSD`;
    resultEl.classList.add('visible');
}

function showDailyLoading() {
    const loading = document.getElementById('dailyLoading');
    if (!loading) return;
    loading.classList.add('visible');
    loading.setAttribute('aria-hidden', 'false');
    document.body.classList.add('daily-is-loading');
}

function hideDailyLoading() {
    const loading = document.getElementById('dailyLoading');
    if (!loading) return;
    loading.classList.remove('visible');
    loading.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('daily-is-loading');
}

function setDailyFormDisabled(disabled) {
    document.querySelectorAll('#dailyForm input, #dailyForm textarea, #dailyForm button')
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
    if (elapsed < dailyMinLoadingTime) {
        await wait(dailyMinLoadingTime - elapsed);
    }
}

document.getElementById('calculateDaily').addEventListener('click', () => {
    const values = getDailyFormValues();
    if (!validateDailyValues(values)) return;
    showDailyResult(calculateDailyResult(values));
});

document.getElementById('dailyForm').onsubmit = async e => {
    e.preventDefault();

    if (!canDailySubmit()) {
        alert('勿重复提交，请1分钟后再试哟～');
        return;
    }

    const values = getDailyFormValues();
    if (!validateDailyValues(values)) return;

    localStorage.setItem(dailyLastSubmitKey, String(Date.now()));
    const loadingStartTime = Date.now();
    setDailyFormDisabled(true);
    showDailyLoading();
    await waitForLoadingPaint();

    const form = new FormData();
    form.append("submitType", "daily");
    form.append("votes", values.votes);
    form.append("cash", values.cash);
    form.append("wolt", values.wolt || 0);
    form.append("consume", values.consume || 0);
    // form.append("rmb", (values.other || 0) / 15);
    form.append("other", values.other || 0);
    form.append("material", values.material || "");
    form.append("remark", values.remark || "");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: form
        });
        if (!res.ok) throw new Error('提交失败');
        const dailyForm = document.getElementById('dailyForm');
        dailyForm.reset();
        await waitForMinimumLoading(loadingStartTime);
        alert('提交成功');
        hideDailyLoading();
        setDailyFormDisabled(false);
    } catch (error) {
        console.error(error);
        const dailyForm = document.getElementById('dailyForm');
        dailyForm.reset();
        await waitForMinimumLoading(loadingStartTime);
        alert('提交完成！关机关电收工，辛苦啦💦');
        hideDailyLoading();
        setDailyFormDisabled(false);
        location.href = "/";
    }
};
