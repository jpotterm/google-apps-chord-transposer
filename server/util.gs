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
      
      for (var k = 0; k < line.items.length; ++k) {
        var item = line.items[k];
        if (item instanceof Chord) {
          return true;
        }
      }
    }
  }
  
  return false;
};

pkg.util.transposeParsedElements = function(interval, parsedElements) {
  function transposeLine(line) {
    var newItems = [];
    
    for (var i = 0; i < line.items.length; ++i) {
      var item = line.items[i];
      
      if (item instanceof Chord) {
        newItems.push(pkg.chord.transpose(interval, item));
      } else {
        newItems.push(item);
      }
    }
    
    return new Line(newItems, line.offset, line.length);
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
    
    return new ParsedElement(parsedElement.text, result, parsedElement.selectionElement);
  }
  
  return parsedElements.map(helper);
};

pkg.util.circularSlice = function(startIndex, xs) {
  var result = [];
  
  for (var i = 0; i < xs.length; ++i) {
    result.push(xs[(i + startIndex) % xs.length]);
  }
  
  return result;
};

pkg.util.circularIndex = function(index, limit) {
  return ((index % limit) + limit) % limit;
};

pkg.util.circularLookup = function(index, xs) {
  var newIndex = pkg.util.circularIndex(index, xs.length);
  return xs[newIndex];
};
