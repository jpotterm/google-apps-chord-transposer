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

pkg.note.letterDistance = function(low, high) {
  var lowIndex = settings.noteNames.indexOf(low.name);
  var highIndex = settings.noteNames.indexOf(high.name);
  
  if (lowIndex > highIndex) {
    lowIndex += 7;
  }
  
  return highIndex - lowIndex;
};

pkg.note.semitoneDistance = function(low, high) {
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

pkg.note.transpose = function(interval, note) {
  var newLetter = pkg.util.circularLookup(
    settings.noteNames.indexOf(note.name) + interval.letterDistance,
    settings.noteNames
  );
  var newAccidental = interval.semitoneDistance - pkg.note.semitoneDistance(note, new Note(newLetter));
  
  return new Note(newLetter, newAccidental);
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

pkg.note.interval = function(low, high) {
  var letterDistance = pkg.note.letterDistance(low, high);
  var semitoneDistance = pkg.note.semitoneDistance(low, high);
  return new Interval(letterDistance, semitoneDistance);
};

