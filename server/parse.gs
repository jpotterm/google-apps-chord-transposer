var pkg = pkg || {};
pkg.parse = pkg.parse || {};

(function() {
  pkg.parse.parseDocument = parseDocument;
  pkg.parse.parseSelection = parseSelection;
  pkg.parse.ParsedElement = ParsedElement;
  pkg.parse.lexType = {
    WHITESPACE: 0,
    PUNCTUATION: 1,
    OTHER: 2,
  };
  
  var lexTypes = [
    {type: pkg.parse.lexType.WHITESPACE,  regex: /^\s$/},
    {type: pkg.parse.lexType.PUNCTUATION, regex: /^[\|\(\)\[\],]$/},
    {type: pkg.parse.lexType.OTHER,       regex: null},
  ];

  function ContextChordLine(contextChords, lineEndOffset) {
    this.contextChords = contextChords;
    this.lineEndOffset = lineEndOffset;
  }
  
  function ParsedElement(text, lines, selectionElement) {
    this.text = text;
    this.lines = lines;
    this.selectionElement = selectionElement;
  }
  
  function parseDocument(document) {
    var body = document.getBody();
    var text = body.editAsText();
    return [parseText(text, null)];
  }
  
  function parseSelection(document, selection) {
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
    var words = lexLine(line, offset, lexTypes);
    return filterContextChords(words);
  }
  
  function filterContextChords(words) {
    var contextChords = [];
    
    for (var i = 0; i < words.length; ++i) {
      var word = words[i];
      var chord = pkg.chord.fromString(word.content);
      
      if (chord === null) continue;
//      if (isFalsePositive(i, words)) continue;
      
      contextChords.push(new pkg.chord.ContextChord(chord, word));
    }
    
    return contextChords;
  }
  
  function isFalsePositive(i, words) {
    var nonChordNeighbors = 0;
    var chordNeighbors = 0;
    
    if (i !== 0) {
      if (pkg.chord.isChord(words[i-1].content)) {
        chordNeighbors += 1;
      } else {
        nonChordNeighbors += 1;
      }
    }
    
    if (i !== words.length - 1) {
      if (pkg.chord.isChord(words[i+1].content)) {
        chordNeighbors += 1;
      } else {
        nonChordNeighbors += 1;
      }
    }
    
    // If more neighbors aren't chords than are, then this probably isn't
    // a chord even if it has the right format
    return nonChordNeighbors > chordNeighbors;
  }
  
  function lexLine(line, lineOffset, lexTypes) {
    var words = [];
    var processingWordType = null;
    var currentWord = '';
    var currentWordOffset = lineOffset;
    
    for (var i = 0; i < line.length; ++i) {
      var c = line[i];
      
      for (var j = 0; j < lexTypes.length; ++j) {
        var lexType = lexTypes[j];
        if (lexType.regex === null || lexType.regex.test(c)) {
          if (processingWordType !== null && processingWordType != lexType.type) {
            // Different word type
            words.push(new Word(currentWordOffset, currentWord, processingWordType));
            currentWordOffset = i + lineOffset;
            currentWord = c;
          } else {
            // Same word type
            currentWord += c;
          }
          
          processingWordType = lexType.type;
          break;
        }
      }
    }
      
    if (currentWord.length !== 0) {
      words.push(new Word(currentWordOffset, currentWord, processingWordType));
    }
    
    return words;
  }
}());