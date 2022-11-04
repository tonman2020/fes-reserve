/**
 * ウェブアプリ公開用関数
 * 処理内容ごとに引数を切り替えて運用
 * req ==================
 * enter    :入場画面確認
 * cancel   :キャンセルしますか？確認画面
//  * canceled :キャンセルされました画面
 *
 */
function doGet(e) {
  var systemChanger;
  var dataId;
  var htmlTemplate;
  var siteTitle = "";
  try {
    systemChanger = e.parameter.req;
    dataId = e.parameter.id;
  } catch(e) {
    htmlName = "404";
    htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
    siteTitle = "このURLに該当するページは存在しません。"
    slackNotice('WebAppクエリ不適合 => 識別コード：' + dataId);
    return htmlTemplate.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle(siteTitle)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=0.5')
      .setFaviconUrl("********************");
  }
  switch (systemChanger) {
    // 入場画面 ====================================================================
    case 'enter':
      htmlName = "enter";
      htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
      htmlTemplate.userID = idChecker(dataId);
      siteTitle = "予約確認";
      break;
    // キャンセルしますか？確認画面 ====================================================
    case 'cancel':
      const usrData = getReserveInfo(dataId);
      htmlName = "cancel";
      htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
      htmlTemplate.redirectsrc = ""
      if(usrData.status){
        htmlTemplate.cancelUsrData = "受付番号："+ dataId +"<br>受付日程："+ usrData.day +"<br>来場人数："+ usrData.people +"<br>";
        htmlTemplate.usrID = dataId;
        siteTitle = "キャンセル確認";
      }
      else{
        //dataIdが存在しない・キャンセル済み
        htmlName = "enter"
        htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
        htmlTemplate.userID = idChecker(dataId);
        siteTitle = "予約確認";
      }
      break;
    // 対応外のクエリが投げられた場合 ===================================================
    default:
      htmlName = "404";
      htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
      siteTitle = "このURLに該当するページは存在しません。"
      slackNotice('WebAppクエリ不適合 => 識別コード：' + dataId);
      break;
  }

  return htmlTemplate.evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle(siteTitle)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=0.5')
    .setFaviconUrl("********************");
}
