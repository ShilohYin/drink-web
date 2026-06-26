const SHEET_NAME="Orders";
const TOKEN="YOUR_TELEGRAM_BOT_TOKEN";
const CHAT_ID="YOUR_CHAT_ID";

function doPost(e){
  try{
    const data=JSON.parse(e.postData.contents);
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    const sh=ss.getSheetByName(SHEET_NAME)||ss.insertSheet(SHEET_NAME);
    sh.appendRow([
      new Date(),
      data.name||"",
      data.phone||"",
      JSON.stringify(data.cart||[]),
      data.remark||""
    ]);
    sendTelegram(data);
    return json({success:true});
  }catch(err){
    return json({success:false,error:String(err)});
  }
}

function sendTelegram(data){
  const text =
    "🧋 KAOLA NEW ORDER\n"+
    "Name: "+(data.name||"")+"\n"+
    "Phone: "+(data.phone||"")+"\n"+
    "Remark: "+(data.remark||"")+"\n"+
    "Items:\n"+JSON.stringify(data.cart||[],null,2);

  UrlFetchApp.fetch(
    "https://api.telegram.org/bot"+TOKEN+"/sendMessage",
    {
      method:"post",
      payload:{
        chat_id:CHAT_ID,
        text:text
      }
    }
  );
}

function doGet(){
  return json({status:"ok"});
}

function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
