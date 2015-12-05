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
  var ui = HtmlService.createTemplateFromFile('Sidebar').evaluate();
  ui.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.setTitle('Chord Transposer');
  DocumentApp.getUi().showSidebar(ui);
}

function showInstructions() {
  var ui = HtmlService.createHtmlOutputFromFile('Instruction');
  ui.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.setWidth(500);
  ui.setHeight(370);
  DocumentApp.getUi().showModalDialog(ui, 'Instructions');
}
