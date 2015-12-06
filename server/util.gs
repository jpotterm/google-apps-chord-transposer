var pkg = pkg || {};
pkg.util = pkg.util || {};

pkg.util.repeatCharacter = function(character, length) {
  var result = '';
  
  for (var i = 0; i < length; ++i) {
    result += character;
  }
  
  return result;
};

pkg.util.hasChords = function(parsedElements) {
  for (var i = 0; i < parsedElements.length; ++i) {
    var parsedElement = parsedElements[i];
    
    for (var j = 0; j < parsedElement.lines.length; ++j) {
      var line = parsedElement.lines[j];
      if (line.contextChords.length !== 0) {
        return true;
      }
    }
  }
  
  return false;
};

pkg.util.transposeParsedElements = function(mode, fromKey, toKey, parsedElements) {
  function transposeWord(contextChord) {
    var transposedChord = pkg.chord.transpose(mode, fromKey, toKey, contextChord.chord);
    var transposedWord = new Word(contextChord.oldWord.offset, pkg.chord.toString(transposedChord));
    return new ReplacementWord(contextChord.oldWord, transposedWord);
  }
  
  function transposeLine(line) {
    var lines = [];
    
    for (var i = 0; i < line.contextChords.length; ++i) {
      var contextChord = line.contextChords[i];
      lines.push(transposeWord(contextChord));
    }
    
    return new ReplacementWordLine(lines, line.lineEndOffset);
  }
  
  return pkg.util.mapLine(transposeLine, parsedElements);
};

pkg.util.mapLine = function(f, parsedElements) {
  function helper(parsedElement) {
    var result = []
    
    for (var i = 0; i < parsedElement.lines.length; ++i) {
      var line = parsedElement.lines[i];
      result.push(f(line));
    }
    
    return new pkg.parse.ParsedElement(parsedElement.text, result, parsedElement.selectionElement);
  }
  
  return parsedElements.map(helper);
};

//function mapParsedElement(f, parsedElements) {
//  var result = [];
//  
//  for (var i = 0; i < parsedElements.length; ++i) {
//    var parsedElement = parsedElements[i];
//    
//    result.push(f(parsedElement));
//  }
//  
//  return result;
//}
