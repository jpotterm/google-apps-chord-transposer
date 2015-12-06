function Word(content, type) {
  this.content = content;
  this.type = type;
}

function Chord(note, rest, base) {
  if (base === undefined) {
    base = null;
  }
  
  this.note = note;
  this.rest = rest;
  this.base = base;
}

function Note(name, accidental) {
  if (accidental === undefined) {
    accidental = 0;
  }
  
  this.name = name;
  this.accidental = accidental;
}

function Line(items, offset, length) {
  this.items = items;
  this.offset = offset;
  this.length = length;
}

function ParsedElement(text, lines, selectionElement) {
  this.text = text;
  this.lines = lines;
  this.selectionElement = selectionElement;
}
