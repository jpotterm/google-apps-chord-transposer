var pkg = pkg || {};
pkg.chord = pkg.chord || {};

pkg.chord.Chord = function(note, rest, base) {
  if (base === undefined) {
    base = null;
  }
  
  this.note = note;
  this.rest = rest;
  this.base = base;
};

pkg.chord.transpose = function(mode, fromKey, toKey, chord) {
  var newNote = pkg.note.transpose(mode, fromKey, toKey, chord.note);
  
  var newBase = chord.base;
  if (chord.base !== null) {
    newBase = pkg.note.transpose(mode, fromKey, toKey, chord.base);
  }
  
  return new pkg.chord.Chord(newNote, chord.rest, newBase);
};

pkg.chord.toString = function(chord) {
  var result = pkg.note.toString(chord.note) + chord.rest;
  
  if (chord.base !== null) {
    result += '/' + pkg.note.toString(chord.base);
  }
  
  return result;
};

pkg.chord.ContextChord = function(chord, oldWord) {
  this.chord = chord;
  this.oldWord = oldWord;
};

pkg.chord.isChord = function(str) {
  return pkg.chord.fromString(str) !== null;
};

pkg.chord.fromString = function(str) {
  // Get the root note
  var restStart = 1;
  var symbols = str.substring(1);
  
  for (var i = 0; i < symbols.length; ++i) {
    var symbol = symbols[i];
    
    if (symbol === '#' || symbol === 'b') {
      restStart += 1;
    } else {
      break;
    }
  }
  
  var note = pkg.note.fromString(str.substring(0, restStart));
  
  if (note === null) return null;

  // Get rest
  var rest = str.substring(restStart);
  var parts = rest.split('/');
  rest = parts[0];
  
  if (parts.length > 2) return null;
  if (rest !== '' && !pkg.chord.validRest(rest)) return null;
  
  // Get base
  var base = null;
  if (parts.length === 2) {
    base = pkg.note.fromString(parts[1]);
    if (base === null) return null;
  }
  
  return new pkg.chord.Chord(note, rest, base);
};

pkg.chord.validRest = function(rest) {
  var parts = [
    'aug',
    'add',
    'dim',
    'dom',
    'M',
    'm',
    'maj',
    'min',
    'n',
    'neut',
    'S',
    's',
    'sub',
    'sup',
    'sus',
    '-',
    '\\+',
    '\\d'
  ];
  
  var pattern = new RegExp('^(' + parts.join('|') + ')*$');
  return pattern.test(rest);
};
