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
  
  chord = chordFromString('A');
  assertEqual(1, chord.note, 'A');
  assertEqual(2, chord.rest, '');
  assertEqual(3, chord.base, '');
  
  chord = chordFromString('A#');
  assertEqual(4, chord.note, 'A#');
  assertEqual(5, chord.rest, '');
  assertEqual(6, chord.base, '');
  
  chord = chordFromString('Ab');
  assertEqual(7, chord.note, 'G#');
  assertEqual(8, chord.rest, '');
  assertEqual(9, chord.base, '');
  
  chord = chordFromString('Asus');
  assertEqual(10, chord.note, 'A');
  assertEqual(11, chord.rest, 'sus');
  assertEqual(12, chord.base, '');
  
  chord = chordFromString('A/B');
  assertEqual(13, chord.note, 'A');
  assertEqual(14, chord.rest, '');
  assertEqual(15, chord.base, 'B');
  
  chord = chordFromString('A/B#');
  assertEqual(16, chord.note, 'A');
  assertEqual(17, chord.rest, '');
  assertEqual(18, chord.base, 'C');
  
  chord = chordFromString('A/Bb');
  assertEqual(19, chord.note, 'A');
  assertEqual(20, chord.rest, '');
  assertEqual(21, chord.base, 'A#');
  
  chord = chordFromString('A#sus/Cb');
  assertEqual(22, chord.note, 'A#');
  assertEqual(23, chord.rest, 'sus');
  assertEqual(24, chord.base, 'B');
  
  
  // Invalid chords
  
  chord = chordFromString('A#sus/Bs');
  assertEqual(25, chord, null);
  
  chord = chordFromString('A#sus/B#s');
  assertEqual(26, chord, null);
  
  chord = chordFromString('A#sus/B#/A');
  assertEqual(27, chord, null);
  
  chord = chordFromString('A#v/B#');
  assertEqual(28, chord, null);
}

function testRepeatCharacter() {
  testSectionId = 2;
  
  assertEqual(1, repeatCharacter('X', 0).length, 0);
  assertEqual(2, repeatCharacter('X', 1).length, 1);
  assertEqual(3, repeatCharacter('X', 7).length, 7);
  assertEqual(4, repeatCharacter('X', -1).length, 0);
  assertEqual(5, repeatCharacter('X', -7).length, 0);
}

function assertEqual(testId, left, right) {
  if (left !== right) {
    Logger.log('Test "' + testSectionId + '.' + testId + '" failed: expected "' + left + '" === "' + right + '"');
  }
}
