/**
 * Slackへ通知を送る関数
 */
function slackNotice(message) {
  // jsonデータ作成
  var jsonData =
  {
    "text" : '<!channel> ' + message
  };
  var payload = JSON.stringify(jsonData);
  // オプション設定
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };
  // 実行
  UrlFetchApp.fetch('********************', options);
}


/**
 * 識別コードの重複を判断する関数
 * 一致：行番号 不一致：-1
 */
function isSameId(targetId) {
  const idSheet = SpreadsheetApp.openById('********************').getSheetByName('記録用_事前予約データ_マスタ');
  const idList = idSheet.getRange(2, 6, idSheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < idList.length; i++) {
    if (idList[i][0].slice(0, 2) == targetId.slice(0, 2)) {
      // 先頭2文字が一致していた場合
      if (idList[i][0].slice(3, 7) == targetId.slice(3, 7)) {
        // 後ろ4文字も一致していた場合
        return i + 2;
      }
    } else {
      continue;
    }
  }
  // 一致なし
  return -1;
}


/**
 * ウェブアプリケーションのURLをメール設定シートに記入する
 */
function inputWebAppUrl() {
  const url = ScriptApp.getService().getUrl();
  console.log(url);
  SpreadsheetApp.getActive().getSheetByName('sett_確認メール').getRange(6, 2).setValue(url)
}
