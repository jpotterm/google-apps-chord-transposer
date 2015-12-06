var pkg = pkg || {};
pkg.render = pkg.render || {};

(function() {
  pkg.render.renderParsedElements = renderParsedElements;
  pkg.render.spaceParsedElements = spaceParsedElements;

  // ------
  // Render
  // ------
  
  function renderParsedElements(parsedElements, document, selection) {
    var newRange = document.newRange();
    
    for (var i = 0; i < parsedElements.length; ++i) {
      var parsedElement = parsedElements[i];
      var offsetDelta = renderParsedElement(parsedElement);
      
      // Rebuild selection
      if (parsedElement.selectionElement !== null) {
        var se = parsedElement.selectionElement;
        
        if (se.isPartial()) {
          newRange.addElement(se.getElement(), se.getStartOffset(), se.getEndOffsetInclusive() + offsetDelta);
        } else {
          newRange.addElement(se.getElement());
        }
      }
    }
    
    if (selection !== null) {
      document.setSelection(newRange.build());
    }
  }
  
  function renderParsedElement(parsedElement) {
    var offsetDelta = 0;
    
    for (var i = 0; i < parsedElement.lines.length; ++i) {
      var line = parsedElement.lines[i];
      var lineString = lineToString(line);
      var offset = line.offset + offsetDelta;
      
      // Replace line
      parsedElement.text.deleteText(offset, offset + line.length - 1);
      parsedElement.text.insertText(offset, lineString);
      
      offsetDelta += lineString.length - line.length;
    }
    
    return offsetDelta;
  }
  
  function lineToString(line) {
    var result = '';
    
    for (var i = 0; i < line.items.length; ++i) {
      var item = line.items[i];
      
      if (item instanceof Chord) {
        result += pkg.chord.toString(item);
      } else {
        result += item.content;
      }
    }
    
    return result;
  }
  
  // -----
  // Space
  // -----
  
  function spaceParsedElements(oldParsedElements, newParsedElements) {
    var resultParsedElements = [];
    
    for (var i = 0; i < newParsedElements.length; ++i) {
      var newParsedElement = newParsedElements[i];
      var lines = [];
      
      for (var j = 0; j < newParsedElement.lines.length; ++j) {
        lines.push(spaceLine(oldParsedElements[i].lines[j], newParsedElements[i].lines[j]));
      }
      
      resultParsedElements.push(new ParsedElement(newParsedElement.text, lines, newParsedElement.selectionElement));
    }
    
    return resultParsedElements;
  }
  
  function spaceLine(oldLine, newLine) {
    var totalDelta = 0;
    var resultItems = [];
    
    for (var i = 0; i < newLine.items.length; ++i) {
      var oldItem = oldLine.items[i];
      var newItem = newLine.items[i];
      
      if (newItem instanceof Chord) {
        var oldString = pkg.chord.toString(oldItem);
        var newString = pkg.chord.toString(newItem);
        totalDelta += newString.length - oldString.length;
      } else if (newItem.type === pkg.parse.lexType.WHITESPACE) {
        var newLength = Math.max(newItem.content.length - totalDelta, 1);
        totalDelta -= (newItem.content.length - newLength);
        newItem = new Word(pkg.util.repeatCharacter(' ', newLength), newItem.type);
      }
      
      resultItems.push(newItem);
    }
    
    return new Line(resultItems, newLine.offset, newLine.length);
  }
}());
