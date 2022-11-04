function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getCanceledHtml(usrId){
    cancelFlager(usrId);
    const htmlName = "canceled";
    return HtmlService.createTemplateFromFile(htmlName).evaluate().getContent();
}
function getReturnEnterHtml(usrId){
  const htmlName = "enter";
  var htmlTemplate = HtmlService.createTemplateFromFile(htmlName);
  htmlTemplate.userID = idChecker(usrId);
  return htmlTemplate.evaluate();
}
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}
