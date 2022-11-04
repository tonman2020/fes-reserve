function mailSystemPush() {
  // シート読み込み ============================================================
  const spread = SpreadsheetApp.openById('********************')
  const masterSheet = spread.getSheetByName('記録用_事前予約データ_マスタ')
  const mailSheet = SpreadsheetApp.openById('********************').getSheetByName('メールデータマスタ')

  // データ取得 ================================================================
  // push可能なのは中間、完了フラグともにtrueの場合
  const lastRow = masterSheet.getLastRow()
  const dataList = masterSheet.getRange(1, 5, lastRow, 10).getValues()
  // 中間処理フラグオン
  masterSheet.getRange(2, 12, lastRow-1, 1).setValue([true])
  console.log(dataList)
  // 時間経過計算用
  var elapsedTime = new Date(dataList[0][9].getFullYear(), dataList[0][9].getMonth(), dataList[0][9].getDate(), dataList[0][9].getHours(), dataList[0][9].getMinutes(), dataList[0][9].getSeconds())
  elapsedTime.setMinutes(elapsedTime.getMinutes() + 7)
  for (let i = 1; i < dataList.length; i++) {
    var nowTime = new Date()
    // push対象かチェック
    if (dataList[i][6] && ((dataList[i][7] == '' && dataList[i][8] == '') || (elapsedTime < nowTime && dataList[i][8] == ''))) {
      var mailPushFlagArea = masterSheet.getRange(i+1, 12, 1, 2)
      mailPushFlagArea.setValue([[true, '']])
      console.log('push対象：' + i)
      let id = dataList[i][1]
      let atesaki = dataList[i][0]
      let subject = dataList[i][3]
      let body = dataList[i][4]
      if (id == '' || atesaki == '' || subject == '' || body == '') {
        console.log('空の要素があるためpushしません')
        // push処理タイムスタンプ保存
        masterSheet.getRange(1, 14).setValue([new Date()])
        mailPushFlagArea.setValue([['', '']])
        continue
      }
      var outputData = [id, atesaki, subject, body, false, false]
      try {
        mailSheet.appendRow(outputData)
      } catch(e) {
        console.log('pushに失敗しました')
        // push処理タイムスタンプ保存
        masterSheet.getRange(1, 14).setValue([new Date()])
        mailPushFlagArea.setValue([['', '']])
        continue
      }
      console.log('pushに成功しました')
      mailPushFlagArea.setValue([[true, true]])
    }
  }
  console.log('push処理完了')
}
