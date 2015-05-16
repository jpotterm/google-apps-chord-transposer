function ContextChordLine(contextChords, lineEndOffset) {
  this.contextChords = contextChords;
  this.lineEndOffset = lineEndOffset;
}


function ReplacementWordLine(replacementWords, lineEndOffset) {
  this.replacementWords = replacementWords;
  this.lineEndOffset = lineEndOffset;
}


function ParsedElement(text, lines, selectionElement) {
  this.text = text;
  this.lines = lines;
  this.selectionElement = selectionElement;
}


function mapContextChord(f, parsedElements) {
  function helper(line) {
    var result = [];

    for (var i = 0; i < line.contextChords.length; ++i) {
      var contextChord = line.contextChords[i];
      result.push(f(contextChord));
    }

    return new ContextChordLine(result, line.lineEndOffset);
  }

  return mapLine(helper, parsedElements);
}

function mapReplacementWord(f, parsedElements) {
  function helper(line) {
    var result = []

    for (var i = 0; i < line.replacementWords.length; ++i) {
      var replacementWord = line.replacementWords[i];
      result.push(f(replacementWord));
    }

    return new ReplacementWordLine(result, line.lineEndOffset);
  }

  return mapLine(helper, parsedElements);
}

function mapLine(f, parsedElements) {
  function helper(parsedElement) {
    var result = []

    for (var i = 0; i < parsedElement.lines.length; ++i) {
      var line = parsedElement.lines[i];
      result.push(f(line));
    }

    return new ParsedElement(parsedElement.text, result, parsedElement.selectionElement);
  }

  return mapParsedElement(helper, parsedElements);
}

function mapParsedElement(f, parsedElements) {
  var result = [];

  for (var i = 0; i < parsedElements.length; ++i) {
    var parsedElement = parsedElements[i];

    result.push(f(parsedElement));
  }

  return result;
}
