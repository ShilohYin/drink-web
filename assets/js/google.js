const API_URL = "https://script.google.com/macros/s/AKfycbygXYNPN0PWneVjIiAAsAlr_J8s0FPZi2BSORGItVI3blS9zlEmta5R3VlwKohZtb6Hgg/exec"

// fetch(API_URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     name: "David",
//     phone: "123456789",
//     type: "Pickup",
//     address: "Belgrade",
//     items: "Milk Tea",
//     total: 450,
//     note: "No Ice"
//   })
// });



async function submitOrder(e){
    // const order = {
    //     name: document.getElementById("name").value,
    //     phone: document.getElementById("phone").value,
    //     type: "Delivery",
    //     address: document.getElementById("address").value,
    //     items: "芋泥啵啵",
    //     total: 980,
    //     note: document.getElementById("note").value
    // };

    // const response = await fetch(API_URL, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(order)
    // });
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("phone", document.getElementById("phone").value);
    form.append("type", document.getElementById("phone").value);
    form.append("address", document.getElementById("address").value);
    form.append("items", document.getElementById("phone").value);
    form.append("total", document.getElementById("phone").value);
    form.append("remark", document.getElementById("remark").value);

    console.log(form, "formform")
    fetch(API_URL, {
        method: "POST",
        body: form
    })
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
    e.preventDefault();
    debugger
    console.log("① submitOrder 开始执行");

    // alert("submitOrder");

    // const res = await fetch(API_URL, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         name: "Test"
    //     })
    // });
    // debugger

    // const result = await response.json();
    // console.log(result);
}