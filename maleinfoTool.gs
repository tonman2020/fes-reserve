/**********************************************************************************************************************
 * 短縮URLを発行する関数
 */
// Bitlyで短縮URLを生成する。
function getShortUrl(longUrl) {

  const ACCESS_TOKEN = '********************';
  const ACCESS_URL   = 'https://api-ssl.bitly.com/v4/shorten';
  var payload = {
      'long_url': longUrl,
  };
  var headers = {
      'Authorization' : 'Bearer ' + ACCESS_TOKEN,
      'Content-Type': 'application/json',
  }
  var options = {
      "method"      : 'POST',
      'headers'     : headers,
      'payload'     : JSON.stringify(payload),
  }
　 var response = UrlFetchApp.fetch(ACCESS_URL, options);
　 var content = response.getContentText("UTF-8");
　 return JSON.parse(content).link;
}

/**********************************************************************************************************************
 * 識別コードを作成する関数
 * 日-乱数4桁
 * 日程を選ばれた場合には有効な識別コード、日程以外についてはfalseを返す
 */
function makeId(timeStamp, day) {
  /*
  var dayId = 0;  // 参加日程の識別 9日参加：1, 10日参加：2, 両日参加：3
  if (day.match(/10月9日/) && day.match(/10月10日/))
    dayId = 3;
  else if (day.match(/10月9日/))
    dayId = 1;
  else if (day.match(/10月10日/))
    dayId = 2;
  else  // 日付以外の選択肢が選ばれた場合
    return false;
  */
  // 識別コード作成
  do {
    var dateId = String('00' + (timeStamp.getDate())).slice(-2) + '-';
    for (let i = 0; i < 4; i++) {
      let rand = Math.random();
      dateId = dateId + String(Math.floor(rand * 10));
    }
  } while (isSameId(dateId) != -1);

  return dateId;
}
