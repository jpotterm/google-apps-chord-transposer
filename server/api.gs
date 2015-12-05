function runTranspose(modeString, from, to) {
  var fromKey = pkg.note.fromString(from);
  var toKey = pkg.note.fromString(to);
  var mode = settings.modes[modeString];
  
  return runTransposeKey(mode, fromKey, toKey);
}

function runTransposeKey(mode, fromKey, toKey) {
  var document = DocumentApp.getActiveDocument();
  var selection = document.getSelection();
  var parsedElements;
  
  if (selection === null) {
    parsedElements = parseDocument(document);
  } else {
    parsedElements = parseSelection(document, selection);
  }
  
  var transposed = transposeParsedElements(mode, fromKey, toKey, parsedElements);
  var spaced = spaceElements(transposed);
  renderReplacementElements(spaced, document, selection);
  
  if (hasChords(parsedElements)) {
    return [];
  } else {
    if (selection === null) {
      return ['No chords found in document.'];
    } else {
      return ['No chords found in selection.'];
    }
  }
}
