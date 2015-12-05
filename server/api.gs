function runTransposeKey(from, to) {
  var fromIndex = settings.notes.indexOf(from);
  var toIndex = settings.notes.indexOf(to);
  
  var amount = toIndex - fromIndex;
  if (fromIndex > toIndex) {
    amount = toIndex - (fromIndex + settings.notes.length);
  }
  
  runTranspose(amount);
}

function runTranspose(transposeAmount) {
  var document = DocumentApp.getActiveDocument();
  var selection = document.getSelection();
  var parsedElements;
  
  if (selection === null) {
    parsedElements = parseDocument(document);
  } else {
    parsedElements = parseSelection(document, selection);
  }
  
  var transposed = transposeParsedElements(transposeAmount, parsedElements);
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
