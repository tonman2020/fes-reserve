/***********************************************************************************************
 * IDを投げるとキャンセルフラグを立てる関数
 * キャンセルリクエストがされたが、キャンセル処理ができなかった場合にはSlackへ通知する
 */
function cancelFlager(targetId) {
  var slackFlag = true;  // Slack通知用フラグ
  // データ取得 ==================================================================================
  const targetSheet = SpreadsheetApp.getActive().getSheetByName('記録用_事前予約データ_マスタ');
  const dataList = targetSheet.getRange(2, 6, targetSheet.getLastRow()-1, 1).getValues();
  console.log(dataList)

  // データ操作 ==================================================================================
  for (let i = 0; i < dataList.length; i++) {
    // console.log(dataList[i][0]);
    if (targetId == dataList[i][0]) {
      targetSheet.getRange(i + 2, 7).setValue([true]);
      slackFlag = false;
      console.log("checkOK");
      break;
    }
  }

  // キャンセル未処理の場合、Slackへ通知 =============================================================
  if (slackFlag) {
    slackNotice('キャンセル未処理 => 識別コード：' + targetId);
  }
}

/***************************************************************************************************
 * IDを投げると予約内容を返す関数
 *
 */
function getReserveInfo(targetId) {
  // マスタデータ取得
  const dataSheet = SpreadsheetApp.getActive().getSheetByName('記録用_事前予約データ_マスタ');
  const dataList = dataSheet.getRange(2, 2, dataSheet.getLastRow()-1, 6).getValues();

  // 対象インデックス取得
  const targetNum = isSameId(targetId);
  if (targetNum == -1 || dataList[targetNum-2][5]) {
    var ngJson = {
      'status'  : false,
      'day'     : null,
      'people'  : null,
      'message' : 'この予約はキャンセル済みです'
    };
    return ngJson;
  }

  console.log(dataList[targetNum-2])
  const dayInfo = dataList[targetNum-2][0];
  const peopleInfo = dataList[targetNum-2][1];
  const okJson = {
    'status'  : true,
    'day'     : dayInfo,
    'people'  : peopleInfo,
    'message' : null
  };
  return okJson;
}


/************************************************************************************************
 * 投げられたIDが有効か、キャンセル済みか、不正かチェックする関数
 */
function idChecker(targetId) {
  // マスタデータ取得
  const dataSheet = SpreadsheetApp.getActive().getSheetByName('記録用_事前予約データ_マスタ');
  const dataList = dataSheet.getRange(2, 6, dataSheet.getLastRow()-1, 2).getValues();

  // IDが有効か、不正か判断 =========================================================================
  var checkNum = isSameId(targetId);
  if (checkNum != -1) {
    // 有効な場合
    if (dataList[checkNum-2][1]) {
      // キャンセル済み
      return 'この予約はキャンセル済みです';
    }
    else {
      // 有効な場合
      return String(targetId);
    }
  } else {
    // 不正な場合
    slackNotice('不正なクエリが送信されました => クエリ：' + targetId);
    return 'この予約はキャンセル済みです';
  }
}

/***************************************************************************************************
 * ウェブアプリURLを返す関数
 */
function appUrlMaker(req, id) {
  return ScriptApp.getService().getUrl()+'?req=' + req + '&id=' + id;
}
