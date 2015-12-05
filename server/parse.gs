function parseDocument(document, processChord) {
  var body = document.getBody();
  var text = body.editAsText();
  return [parseText(text, null)];
}

function parseSelection(document, selection, processChord) {
  var elements = selection.getRangeElements();
  var parsedElements = [];

  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];

    // Only modify elements that can be edited as text; skip images and other non-text elements.
    if (element.getElement().editAsText) {
      var text = element.getElement().editAsText();
      var parsedElement;

      if (element.isPartial()) {
        parsedElement = parseText(text, element, element.getStartOffset(), element.getEndOffsetInclusive());
      } else {
        parsedElement = parseText(text, element);
      }

      parsedElements.push(parsedElement);
    }
  }

  return parsedElements;
}

function parseText(text, selectionElement, startOffset, endOffsetInclusive) {
  if (startOffset === undefined) {
    startOffset = 0;
  }

  var s = text.getText();

  if (endOffsetInclusive !== undefined) {
    s = s.substring(startOffset, endOffsetInclusive + 1);
  }

  var lines = s.split(/[\r\n]/);
  var lineObjs = [];
  var offset = startOffset;

  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];

    if (line === '') {
      offset += 1;
      continue;
    }

    var lineObj = parseLine(line, text, offset);
    lineObjs.push(lineObj);
    offset += line.length + 1;
  }

  return new ParsedElement(text, lineObjs, selectionElement);
}

function parseLine(line, text, offset) {
  var lineEndOffset = offset + line.length - 1;
  var contextChords = contextChordsFromLine(line, offset);
  return new ContextChordLine(contextChords, lineEndOffset);
}

function contextChordsFromLine(line, offset) {
  var words = lexLine(line, offset);
  return filterContextChords(words);
}

function filterContextChords(words) {
  var contextChords = [];

  for (var i = 0; i < words.length; ++i) {
    var word = words[i];
    var chord = chordFromString(word.content);

    if (chord === null) continue;
    if (isFalsePositive(i, words)) continue;

    contextChords.push(new ContextChord(chord, word));
  }

  return contextChords;
}

function isFalsePositive(i, words) {
  var nonChordNeighbors = 0;
  var chordNeighbors = 0;

  if (i !== 0) {
    if (isChord(words[i-1].content)) {
      chordNeighbors += 1;
    } else {
      nonChordNeighbors += 1;
    }
  }

  if (i !== words.length - 1) {
    if (isChord(words[i+1].content)) {
      chordNeighbors += 1;
    } else {
      nonChordNeighbors += 1;
    }
  }

  // If more neighbors aren't chords than are, then this probably isn't
  // a chord even if it has the right format
  return nonChordNeighbors > chordNeighbors;
}

function lexLine(line, lineOffset) {
  var words = [];
  var processingWord = false;
  var currentWord = '';
  var currentWordOffset = 0;

  for (var i = 0; i < line.length; ++i) {
    var c = line[i];

    if (/^\s$/.test(c)) {
      if (processingWord) {
        processingWord = false;
        words.push(new Word(currentWordOffset, currentWord));
      }
    } else {
      if (processingWord) {
        currentWord += c;
      } else {
        processingWord = true;
        currentWordOffset = i + lineOffset;
        currentWord = c;
      }
    }
  }

  if (processingWord) {
    words.push(new Word(currentWordOffset, currentWord));
  }

  return words;
}
