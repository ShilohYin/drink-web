const GAS_URL="YOUR_GOOGLE_WEB_APP_URL";

export async function submitOrder(order){
  const res=await fetch(GAS_URL,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(order)
  });
  return await res.json();
}

export async function submitContact(form){
  return submitOrder({
    type:"contact",
    ...form
  });
}
