const dailyLastSubmitKey = 'dailyLastSubmitTime';
const dailyNumberPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
const dailyMinLoadingTime = 700;

function dailyT(key, replacements = {}) {
    return Object.entries(replacements).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, value),
        i18n.t(key)
    );
}

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
        alert(dailyT('daily_turnover_required'));
        document.getElementById('votes').focus();
        return false;
    }

    if (!values.cash) {
        alert(dailyT('daily_cash_required'));
        document.getElementById('cash').focus();
        return false;
    }

    if (!dailyNumberPattern.test(values.votes)) {
        alert(dailyT('daily_turnover_invalid'));
        document.getElementById('votes').focus();
        return false;
    }

    if (!dailyNumberPattern.test(values.cash)) {
        alert(dailyT('daily_cash_invalid'));
        document.getElementById('cash').focus();
        return false;
    }

    const optionalFields = [
        // { id: 'rmb', value: values.rmb, label: '扫码支付' },
        { id: 'consume', value: values.consume, label: dailyT('daily_expense') },
        { id: 'wolt', value: values.wolt, label: dailyT('daily_wolt') },
        { id: 'other', value: values.other, label: dailyT('daily_other_payment') }
    ];

    for (const field of optionalFields) {
        if (field.value && !dailyNumberPattern.test(field.value)) {
            alert(dailyT('daily_field_invalid', { field: field.label }));
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
    resultEl.textContent = dailyT('daily_calculation_result', {
        result: result.toFixed(2)
    });
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
        alert(dailyT('duplicate_submit'));
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
        if (!res.ok) throw new Error(dailyT('submit_failed'));
        const dailyForm = document.getElementById('dailyForm');
        dailyForm.reset();
        await waitForMinimumLoading(loadingStartTime);
        alert(dailyT('daily_submit_success'));
        hideDailyLoading();
        setDailyFormDisabled(false);
    } catch (error) {
        console.error(error);
        const dailyForm = document.getElementById('dailyForm');
        dailyForm.reset();
        await waitForMinimumLoading(loadingStartTime);
        alert(dailyT('daily_submit_completed'));
        hideDailyLoading();
        setDailyFormDisabled(false);
        location.href = "/";
    }
};
