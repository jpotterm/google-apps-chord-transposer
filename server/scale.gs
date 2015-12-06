var pkg = pkg || {};
pkg.scale = pkg.scale || {};

pkg.scale.generate = function(mode, rootNote) {
  var rootIndex = settings.noteNames.indexOf(rootNote.name);
  var scale = [];
  
  for (var i = 0; i < settings.noteNames.length; ++i) {
    var noteName = settings.noteNames[(i + rootIndex) % settings.noteNames.length];
    scale.push(new Note(noteName));
  }
  
  for (var i = 0; i < scale.length; ++i) {
    var current = scale[i];
    
    if (i === 0) {
      current.accidental = rootNote.accidental;
    } else {
      var previous = scale[i-1];
      current.accidental = mode[i-1] - pkg.note.distance(previous, current);
    }
  }
  
  return scale;
};
