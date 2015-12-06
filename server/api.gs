function apiTranspose(modeString, from, to) {
  var fromKey = pkg.note.fromString(from);
  var toKey = pkg.note.fromString(to);
  var mode = settings.modes[modeString];

  var document = DocumentApp.getActiveDocument();
  var selection = document.getSelection();
  var parsedElements;
  
  if (selection === null) {
    parsedElements = pkg.parse.parseDocument(document);
  } else {
    parsedElements = pkg.parse.parseSelection(document, selection);
  }
  
  var transposed = pkg.util.transposeParsedElements(mode, fromKey, toKey, parsedElements);
  var spaced = pkg.render.spaceElements(transposed);
  pkg.render.renderReplacementElements(spaced, document, selection);
  
  if (pkg.util.hasChords(parsedElements)) {
    return [];
  } else {
    if (selection === null) {
      return ['No chords found in document.'];
    } else {
      return ['No chords found in selection.'];
    }
  }
}

function apiInclude(filename) {
  // This function for use in templates
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}
