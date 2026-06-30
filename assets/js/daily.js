document.getElementById('dailyForm').onsubmit = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append("submitType", "daily");
    form.append("votes", document.getElementById("votes").value);
    form.append("cash", document.getElementById("cash").value);
    form.append("rmb", document.getElementById("rmb").value);
    form.append("addconsumeress", document.getElementById("consume").value);
    form.append("wolt", document.getElementById("wolt").value);
    form.append("material", document.getElementById("material").value);
    form.append("remark", document.getElementById("remark").value);

    fetch(API_URL, {
        method: "POST",
        body: form
    })
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
};

