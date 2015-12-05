function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
    .addItem('Open', 'showSidebar')
    .addItem('Instructions', 'showInstructions')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('client/index').evaluate();
  ui.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.setTitle('Chord Transposer');
  DocumentApp.getUi().showSidebar(ui);
}

function showInstructions() {
  var ui = HtmlService.createHtmlOutputFromFile('client/instruction');
  ui.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.setWidth(500);
  ui.setHeight(370);
  DocumentApp.getUi().showModalDialog(ui, 'Instructions');
}
