function orderFuc(e) {
  try {
    // 获取参数
    const data = {
      name: e.parameter.name || "",
      phone: e.parameter.phone || "",
      type: e.parameter.type || "",
      address: e.parameter.address || "",
      items: e.parameter.items || "",
      total: e.parameter.total || "",
      remark: e.parameter.remark || ""
    };

    Logger.log(JSON.stringify(data));

    // 获取工作表
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    // 生成订单号
    const orderNo =
      "KBT" +
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyyMMddHHmmss"
      );

    // 写入 Google Sheet
    sheet.appendRow([
      new Date(),
      orderNo,
      data.name,
      data.phone,
      data.type,
      data.address,
      data.items,
      data.total,
      data.remark
    ]);

    // Telegram 通知
    sendOrderTelegram(orderNo, e.parameter);

    // 返回成功
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          orderNo: orderNo,
          message: "Order received successfully"
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {

    Logger.log(err);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function dailyFuc(e) {
  try {
    // 获取参数
    const data = {
      votes: e.parameter.votes || 0, // 票额
      cash: e.parameter.cash || 0, // 现金
      rmb: e.parameter.rmb || 0, // RMB
      wolt: e.parameter.wolt || 0, // wolt外卖
      consume: e.parameter.consume || 0, // 消费
      material: e.parameter.material || 0, // 购买物料
      remark: e.parameter.remark || "" // 备注
    };

    Logger.log(JSON.stringify(data));

    // 获取工作表
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_DAILY);

    // 生成订单号
    const date = 
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyy/MM/dd HH:mm:ss"
      );

    // 写入 Google Sheet
    sheet.appendRow([
      date,
      data.votes,
      data.cash,
      data.rmb,
      data.consume,
      data.wolt,
      data.material,
      data.remark
    ]);

    // Telegram 通知
    sendDailyTelegram(date, data);

    // 返回成功
    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          // date,
          message: "今日营业额已提交!"
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log(err);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString()
        })
      )
      .setMimeType(ContentService.MimeType.JSON);
  }
}


function doPost(e) {
  let { submitType } = e.parameter || {}
  // submitType = 'daily'
  if ("order" === submitType) {
    orderFuc(e)
  } else if ("daily" === submitType) {
    dailyFuc(e)
  }
}


function sendDailyTelegram(orderNo,data = {}){
  const date = 
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyy/MM/dd"
      );

  const text =
    `
      📌 ${date} 今日营业额汇总

      🧾 票额：${data.votes || 0 } RSD

      💰 现金/收入：${data.cash || 0 } RSD

      💵 扫码支付：${data.rmb || 0 } RMB

      🔄 Wolt外卖: ${data.wolt || 0 } RSD

      💸 支出/消费：${data.consume || 0}
      
      🔄 购买物料: ${data.material || ""} 

      📝 备注：${data.remark || ""}
    `;

  UrlFetchApp.fetch(
    "https://api.telegram.org/bot"+DAILY_BOT_TOKEN+"/sendMessage",
    {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({

        chat_id: DAILY_CHAT_ID,
        text:text
      })
    }
  );
}

function sendOrderTelegram(orderNo,data = {}){
  const text =
    `🧋 来新订单咯~

    📦 订单号：${orderNo || ""}
    👤 姓名：${data.name || ""}
    📞 电话：${data.phone || ""}
    🚚 配送：${data.type || ""}
    📍 地址：${data.address || ""}
    🥤 商品：${data.items || ""}
    💰 金额：${data.total || 0} RSD
    📝 备注：${data.remark || ""}
  `;

  UrlFetchApp.fetch(
    "https://api.telegram.org/bot"+BOT_TOKEN+"/sendMessage",
    {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({

        chat_id:CHAT_ID,

        text:text

      })
    }
  );
}