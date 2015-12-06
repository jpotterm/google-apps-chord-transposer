var pkg = pkg || {};
pkg.note = pkg.note || {};

pkg.note.toString = function(note) {
  var result = note.name;
  var symbol = note.accidental > 0 ? '#' : 'b';
  
  for (var i = 0; i < Math.abs(note.accidental); ++i) {
    result += symbol;
  }
  
  return result;
};


pkg.note.distance = function(low, high) {
  return noteNameDistance(low.name, high.name) + (high.accidental - low.accidental);
  
  function noteNameDistance(low, high) {
    var lowInterval = settings.noteIntervals[low];
    var highInterval = settings.noteIntervals[high];
    
    if (lowInterval > highInterval) {
      // Raise an octave
      highInterval += 12;
    }
    
    return highInterval - lowInterval;
  }
};

pkg.note.scaleIndex = function(note, scale) {
  for (var i = 0; i < scale.length; ++i) {
    if (note.name === scale[i].name) {
      return i;
    }
  }
  
  return -1;
};

pkg.note.transpose = function(mode, fromKey, toKey, note) {
  var fromScale = pkg.scale.generate(mode, fromKey);
  var toScale = pkg.scale.generate(mode, toKey);
  
  var fromIndex = pkg.note.scaleIndex(note, fromScale);
  var fromChord = fromScale[fromIndex];
  
  var transposedNote = toScale[fromIndex];
  transposedNote.accidental += note.accidental - fromChord.accidental;
  
  return transposedNote;
};

pkg.note.fromString = function(str) {
  var noteName = str.substring(0, 1);
  var noteIndex = settings.noteNames.indexOf(noteName);
  if (noteIndex < 0) return null;
  
  var note = new Note(noteName);
  
  for (var i = 1; i < str.length; ++i) {
    if (str[i] === '#') {
      note.accidental += 1;
    } else if (str[i] === 'b') {
      note.accidental -= 1;
    } else {
      return null;
    }
  }
  
  return note;
};
