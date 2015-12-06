var pkg = pkg || {};
pkg.render = pkg.render || {};

(function() {
  pkg.render.renderReplacementElements = renderReplacementElements;
  pkg.render.spaceElements = spaceElements;

  // ------
  // Render
  // ------
  
  function renderReplacementElements(parsedElements, document, selection) {
    var newRange = document.newRange();
    
    for (var i = 0; i < parsedElements.length; ++i) {
      var parsedElement = parsedElements[i];
      var offsetDelta = renderReplacementLines(parsedElement);
      
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
  
  function renderReplacementLines(parsedElement) {
    var offsetDelta = 0;
    
    for (var i = 0; i < parsedElement.lines.length; ++i) {
      var line = parsedElement.lines[i];
      var lineEndOffset = line.lineEndOffset + offsetDelta;
      var replacementWords = increaseOffsetReplacementWords(offsetDelta, line.replacementWords);
      
      var currentOffsetDelta = adjustLineLength(replacementWords, parsedElement.text, lineEndOffset);
      eraseOldWords(replacementWords, parsedElement.text, lineEndOffset + currentOffsetDelta);
      renderReplacementWords(replacementWords, parsedElement.text);
      
      offsetDelta += currentOffsetDelta;
    }
    
    return offsetDelta;
  }
  
  function renderReplacementWords(replacementWords, text) {
    for (var i = 0; i < replacementWords.length; ++i) {
      renderReplacementWord(replacementWords[i], text);
    }
  }
  
  function renderReplacementWord(replacementWord, text) {
    var new_ = replacementWord.new_;
    var newEndOffset = new_.offset + new_.content.length - 1;
    
    // Add new word
    text.deleteText(new_.offset, newEndOffset);
    text.insertText(new_.offset, new_.content);
  }
  
  // -----
  // Erase
  // -----
  
  function adjustLineLength(replacementWords, text, lineEndOffset) {
    if (replacementWords.length === 0) return 0;
    
    var replacementWord = replacementWords[replacementWords.length - 1];
    
    var oldEndOffset = replacementWord.old.offset + replacementWord.old.content.length - 1;
    var newEndOffset = replacementWord.new_.offset + replacementWord.new_.content.length - 1;
    var lastOnLine = oldEndOffset === lineEndOffset || newEndOffset >= lineEndOffset;
    
    if (!lastOnLine || newEndOffset === lineEndOffset) return 0;
    
    if (newEndOffset < lineEndOffset) {
      text.deleteText(newEndOffset + 1, lineEndOffset);
    } else {
      text.insertText(lineEndOffset + 1, pkg.util.repeatCharacter(' ', newEndOffset - lineEndOffset));
    }
    
    return newEndOffset - lineEndOffset;
  }
  
  function eraseOldWords(replacementWords, text, lineEndOffset) {
    for (var i = 0; i < replacementWords.length; ++i) {
      eraseOldWord(replacementWords[i], text, lineEndOffset);
    }
  }
  
  function eraseOldWord(replacementWord, text, lineEndOffset) {
    var old = replacementWord.old;
    var oldEndOffset = old.offset + old.content.length - 1;
    
    // Don't erase if the old word is beyond where the line now ends
    if (old.offset > lineEndOffset) return;
    
    var delta = 0;
    if (oldEndOffset > lineEndOffset) {
      delta = oldEndOffset - lineEndOffset;
    }
    
    // Overwrite old word with spaces
    text.deleteText(old.offset, oldEndOffset - delta);
    text.insertText(old.offset, pkg.util.repeatCharacter(' ', old.content.length - delta));
  }
  
  // ------
  // Offset
  // ------
  
  function increaseOffsetReplacementWords(offsetDelta, replacementWords) {
    var result = [];
    
    for (var i = 0; i < replacementWords.length; ++i) {
      var r = replacementWords[i];
      var old = increaseOffsetWord(offsetDelta, r.old);
      var new_ = increaseOffsetWord(offsetDelta, r.new_);
      result.push(new ReplacementWord(old, new_));
    }
    
    return result;
  }
  
  function increaseOffsetWord(offsetDelta, word) {
    return new Word(word.offset + offsetDelta, word.content);
  }
  
  // -----
  // Space
  // -----
  
  function spaceElements(parsedElements) {
    return pkg.util.mapLine(spaceLine, parsedElements);
  }
  
  function spaceLine(line) {
    return new ReplacementWordLine(spaceReplacementWords(line.replacementWords), line.lineEndOffset);
  }
  
  function spaceReplacementWords(replacementWords) {
    var result = [];
    
    for (var i = 0; i < replacementWords.length; ++i) {
      if (i === 0) {
        result.push(replacementWords[i]);
        continue;
      }
      
      var old = replacementWords[i].old;
      var prev = result[result.length - 1].new_;
      var curr = replacementWords[i].new_;
      var prevEnd = prev.offset + prev.content.length - 1;
      
      if (curr.offset <= prevEnd + 1) {
        result.push(new ReplacementWord(old, new Word(prevEnd + 2, curr.content)));
      } else {
        result.push(replacementWords[i]);
      }
    }
    
    return result;
  }
}());
