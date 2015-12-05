(function() {
  var from = 'Ab';
  var to = 'B#';
  var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var modes = {
    major: [2, 2, 1, 2, 2, 2, 1],
    minor: [2, 1, 2, 2, 1, 2, 2],
  };
  var intervals = {
    'A' : 0,
    'B' : 2,
    'C' : 3,
    'D' : 5,
    'E' : 7,
    'F' : 8,
    'G' : 10,
  };


  function Chord(note, accidental) {
    if (accidental === undefined) {
      accidental = 0;
    }

    this.note = note;
    this.accidental = accidental;
  }

  function chordToString(chord) {
    var result = chord.note;
    var symbol = chord.accidental > 0 ? '#' : 'b';

    for (var i = 0; i < Math.abs(chord.accidental); ++i) {
      result += symbol;
    }

    return result;
  }

  function noteDistance(low, high) {
    var lowInterval = intervals[low];
    var highInterval = intervals[high];

    if (lowInterval > highInterval) {
      // Raise an octave
      highInterval += 12;
    }

    return highInterval - lowInterval;
  }

  function chordDistance(low, high) {
    return noteDistance(low.note, high.note) + (high.accidental - low.accidental);
  }

  function indexOfChord(chord, scale) {
    for (var i = 0; i < scale.length; ++i) {
      if (chord.note === scale[i].note) {
        return i;
      }
    }

    return -1;
  }

  function test2() {
    Logger.log(chordToString(
      transpose(modes['major'], new Chord('A'), new Chord('B'), new Chord('B', 1))
    ));
  }

  function generateScale(mode, rootChord) {
    var rootIndex = notes.indexOf(rootChord.note);
    var scale = [];

    for (var i = 0; i < notes.length; ++i) {
      var note = notes[(i + rootIndex) % notes.length];
      scale.push(new Chord(note));
    }

    for (var i = 0; i < scale.length; ++i) {
      var current = scale[i];

      if (i === 0) {
        current.accidental = rootChord.accidental;
      } else {
        var previous = scale[i-1];
        current.accidental = mode[i-1] - chordDistance(previous, current);
      }
    }

    return scale;
  }

  function transpose(mode, fromKey, toKey, chord) {
    var fromScale = generateScale(mode, fromKey);
    var toScale = generateScale(mode, toKey);

    var fromIndex = indexOfChord(chord, fromScale);
    var fromChord = fromScale[fromIndex];

    var transposedChord = toScale[fromIndex];
    transposedChord.accidental += chord.accidental - fromChord.accidental;

    return transposedChord;
  }
}());
