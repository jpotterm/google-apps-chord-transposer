// TODO: ensure spacing between chords and non-chords

var testSectionId;

function testAll() {
  testChordFromString();
  testRepeatCharacter();
  Logger.log('Finished tests.');
}

function testChordFromString() {
  testSectionId = 1;
  var chord;
  
  // Valid chords
  
  chord = pkg.chord.fromString('A');
  assertEqual(1, chord.note.name, 'A');
  assertEqual(2, chord.note.accidental, 0);
  assertEqual(3, chord.rest, '');
  assertEqual(4, chord.base, null);
  
  chord = pkg.chord.fromString('A#');
  assertEqual(5, chord.note.name, 'A');
  assertEqual(6, chord.note.accidental, 1);
  assertEqual(7, chord.rest, '');
  assertEqual(8, chord.base, null);

  chord = pkg.chord.fromString('Ab');
  assertEqual(9, chord.note.name, 'A');
  assertEqual(10, chord.note.accidental, -1);
  assertEqual(11, chord.rest, '');
  assertEqual(12, chord.base, null);
  
  chord = pkg.chord.fromString('Asus');
  assertEqual(13, chord.note.name, 'A');
  assertEqual(14, chord.note.accidental, 0);
  assertEqual(15, chord.rest, 'sus');
  assertEqual(16, chord.base, null);
  
  chord = pkg.chord.fromString('A/B');
  assertEqual(17, chord.note.name, 'A');
  assertEqual(18, chord.note.accidental, 0);
  assertEqual(19, chord.rest, '');
  assertEqual(20, chord.base.name, 'B');
  assertEqual(21, chord.base.accidental, 0);
  
  chord = pkg.chord.fromString('A/B#');
  assertEqual(22, chord.note.name, 'A');
  assertEqual(23, chord.note.accidental, 0);
  assertEqual(24, chord.rest, '');
  assertEqual(25, chord.base.name, 'B');
  assertEqual(26, chord.base.accidental, 1);
  
  chord = pkg.chord.fromString('A##sus/Cb');
  assertEqual(27, chord.note.name, 'A');
  assertEqual(28, chord.note.accidental, 2);
  assertEqual(29, chord.rest, 'sus');
  assertEqual(30, chord.base.name, 'C');
  assertEqual(31, chord.base.accidental, -1);
  
  // Invalid chords
  
  chord = pkg.chord.fromString('A#sus/Bx');
  assertEqual(32, chord, null);
  
  chord = pkg.chord.fromString('A#sus#/B#');
  assertEqual(33, chord, null);
  
  chord = pkg.chord.fromString('A#sus/B#/A');
  assertEqual(34, chord, null);
  
  chord = pkg.chord.fromString('A#v/B#');
  assertEqual(35, chord, null);
}

function testRepeatCharacter() {
  testSectionId = 2;
  
  assertEqual(1, pkg.util.repeatCharacter('X', 0).length, 0);
  assertEqual(2, pkg.util.repeatCharacter('X', 1).length, 1);
  assertEqual(3, pkg.util.repeatCharacter('X', 7).length, 7);
  assertEqual(4, pkg.util.repeatCharacter('X', -1).length, 0);
  assertEqual(5, pkg.util.repeatCharacter('X', -7).length, 0);
}

function assertEqual(testId, left, right) {
  if (left !== right) {
    Logger.log('Test "' + testSectionId + '.' + testId + '" failed: expected "' + left + '" === "' + right + '"');
  }
}
