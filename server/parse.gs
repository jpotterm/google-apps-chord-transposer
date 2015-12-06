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
      if (lineHasChords(lineObj)) {
        lineObjs.push(lineObj);
      }
      
      offset += line.length + 1;
    }
    
    return new ParsedElement(text, lineObjs, selectionElement);
  }
  
  function parseLine(line, text, offset) {
    var words = lexLine(line, lexTypes);
    var items = parseChords(words);
    return new Line(items, offset, line.length);
  }
  
  function parseChords(words) {
    var line = [];
    
    for (var i = 0; i < words.length; ++i) {
      var word = words[i];
      var chord = pkg.chord.fromString(word.content);
      
      if (chord !== null && !isFalsePositive(i, words)) {
        line.push(chord);
      } else {
        line.push(word);
      }
    }
    
    return line;
  }
  
  function lineHasChords(lineObj) {
    for (var i = 0; i < lineObj.items.length; ++i) {
      var item = lineObj.items[i];
      if (item instanceof Chord) {
        return true;
      }
    }
    
    return false;
  }

  function isFalsePositive(i, words) {
    var score = 0;
    
    var precedingNeighbors = words.slice(0, i).reverse();
    var followingNeighbors = words.slice(i + 1);
    
    // If more neighbors aren't chords than are, then this probably isn't
    // a chord even if it has the right format
    return scoreNeighbors(precedingNeighbors) + scoreNeighbors(followingNeighbors) < 0;

    function scoreNeighbors(neighbors) {
      for (var j = 0; j < neighbors.length; ++j) {
        var word = neighbors[j];
        
        if (word.type === pkg.parse.lexType.OTHER) {
          if (pkg.chord.isChord(word.content)) {
            return 1;
          } else {
            return -1;
          }
        }
      }
      
      return 0;
    }
  }

  function lexLine(line, lexTypes) {
    var words = [];
    var processingWordType = null;
    var currentWord = '';
    
    for (var i = 0; i < line.length; ++i) {
      var c = line[i];
      
      for (var j = 0; j < lexTypes.length; ++j) {
        var lexType = lexTypes[j];

        if (lexType.regex === null || lexType.regex.test(c)) {
          if (processingWordType !== null && processingWordType != lexType.type) {
            // Different word type
            words.push(new Word(currentWord, processingWordType));
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
      words.push(new Word(currentWord, processingWordType));
    }
    
    return words;
  }
}());