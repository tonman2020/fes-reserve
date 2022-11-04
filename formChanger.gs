/**
 * 事前予約フォーム起動フラグが立っているかチェックして起動する関数
 */
function isFlagFormChange() {
  try {
    var value = SpreadsheetApp.openById('********************').getSheetByName('sett_枠調整').getRange(3, 7).getValue()
    if (value) {
      console.log('フォームチェンジャー起動');
      try {
        formChange();
      } catch(e) {
        console.log('フォームチェンジャーが動作しませんでした')
      }
    } else {
      console.log('フラグが立っていないので終了');
    }
  } catch(e) {
    console.log('シートが読み込めませんでした')
  }

}


/**
 * 事前予約フォームの選択肢を書き換える関数
 */
function formChange() {
  // スプレッドシートからデータ取得 ========================================
  const spread = SpreadsheetApp.getActive();
  // 枠調整用データ
  const wakuSheet = spread.getSheetByName('sett_枠調整');
  const wakuData = wakuSheet.getRange(2, 1, 3, 5).getValues();

  // 各日程ごとに状況をリストへpushする ====================================
  var statusList = [];
  if (wakuData[0][4] == '〇') {
    statusList.push(wakuData[0][0]);
  }
  if (wakuData[1][4] == '〇') {
    statusList.push(wakuData[1][0]);
  }
  if (statusList.length == 0) {
    statusList.push(wakuData[2][0]);
  }
  console.log('現在空いている日程：' + statusList);

  // フォームの選択肢を書き換える =========================================
  // パラメータ設定
  const questionNo = 0; // 質問が何番目にあるか。0スタート
  const formId = '********************';

  // フォーム取得
  const form = FormApp.openById(formId);
  const items = form.getItems();
  var item = items[questionNo];

  // フォーム書き換え
  item.asCheckboxItem().setChoiceValues(statusList).showOtherOption(false); // その他の選択肢表示はfalse

  // フラグを下ろす
  wakuSheet.getRange(3, 7).uncheck();
}
