const dailyLastSubmitKey = 'dailyLastSubmitTime';

function canDailySubmit() {
    const last = Number(localStorage.getItem(dailyLastSubmitKey) || 0);
    return Date.now() - last >= 30000;
}

document.getElementById('dailyForm').onsubmit = async e => {
    e.preventDefault();

    if (!canDailySubmit()) {
        alert('请 30 秒后再提交');
        return;
    }

    const votes = document.getElementById("votes").value.trim();
    const cash = document.getElementById("cash").value.trim();
    const rmb = document.getElementById("rmb").value.trim();
    const consume = document.getElementById("consume").value.trim();
    const wolt = document.getElementById("wolt").value.trim();
    const material = document.getElementById("material").value.trim();
    const remark = document.getElementById("remark").value.trim();

    if (!votes) {
        alert('请输入票额');
        document.getElementById('votes').focus();
        return;
    }

    if (!cash) {
        alert('请输入现金金额');
        document.getElementById('cash').focus();
        return;
    }

    const numberPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!numberPattern.test(votes)) {
        alert('票额请输入有效数字');
        document.getElementById('votes').focus();
        return;
    }

    if (!numberPattern.test(cash)) {
        alert('现金请输入有效数字');
        document.getElementById('cash').focus();
        return;
    }

    const optionalFields = [
        { id: 'rmb', value: rmb, label: '扫码支付' },
        { id: 'consume', value: consume, label: '消费支出' },
        { id: 'wolt', value: wolt, label: 'Wolt外卖' }
    ];

    for (const field of optionalFields) {
        if (field.value && !numberPattern.test(field.value)) {
            alert(`${field.label}请输入有效数字`);
            document.getElementById(field.id).focus();
            return;
        }
    }

    const form = new FormData();
    form.append("submitType", "daily");
    form.append("votes", votes);
    form.append("cash", cash);
    form.append("rmb", rmb || 0);
    form.append("addconsumeress", consume || 0);
    form.append("wolt", wolt || 0);
    form.append("material", material || "");
    form.append("remark", remark || "");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: form
        });
        if (!res.ok) throw new Error('提交失败');
        localStorage.setItem(dailyLastSubmitKey, String(Date.now()));
        alert('提交成功');
        location.href = "/";
    } catch (error) {
        console.error(error);
        alert('提交失败，请稍后重试');
    }
};

