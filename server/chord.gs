function Chord(note, rest, base) {
  this.note = note;
  this.rest = rest;
  this.base = base;
}

Chord.prototype.transpose = function(amount) {
  var newNote = transposeNote(this.note, amount);
  var newBase = this.base;

  if (this.base !== '') {
    newBase = transposeNote(this.base, amount);
  }

  return new Chord(newNote, this.rest, newBase);
};

Chord.prototype.toString = function() {
  var result = this.note + this.rest;

  if (this.base !== '') {
    result += '/' + this.base;
  }

  return result;
};


function ContextChord(chord, oldWord) {
  this.chord = chord;
  this.oldWord = oldWord;
}


function isChord(str) {
  return chordFromString(str) !== null;
}

function chordFromString(str) {
  // Get the root note
  var restStart = 1;
  var symbol = str.substring(1, 2);
  if (symbol === '#' || symbol === 'b') {
    restStart = 2;
  }

  var note = getNote(str.substring(0, restStart));

  if (note === null) return null;

  // Get rest
  var rest = str.substring(restStart);
  var parts = rest.split('/');
  rest = parts[0];

  if (parts.length > 2) return null;
  if (rest !== '' && !validRest(rest)) return null;

  // Get base
  var base = '';
  if (parts.length === 2) {
    base = getNote(parts[1]);
    if (base === null) return null;
  }

  return new Chord(note, rest, base);
}

function transposeNote(note, amount) {
  var index = settings.notes.indexOf(note);
  var newIndex = circularIndex((index + amount), settings.notes.length);
  return settings.notes[newIndex];
}

function getNote(str) {
  if (str.length > 2) return null;

  var noteIndex = settings.notes.indexOf(str.substring(0, 1));
  if (noteIndex < 0) return null;

  if (str.length > 1) {
    var symbol = str.substring(1, 2);

    if (symbol === '#') {
      noteIndex += 1;
    } else if (symbol === 'b') {
      noteIndex -= 1;
    } else {
      return null;
    }
  }

  var normalizedIndex = circularIndex(noteIndex, settings.notes.length);
  return settings.notes[normalizedIndex];
}

function validRest(rest) {
  var parts = [
    'aug',
    'add',
    'b',
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
    '#',
    '\\d'
  ];

  var pattern = new RegExp('^(' + parts.join('|') + ')*$');
  return pattern.test(rest);
}
