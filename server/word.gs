function Word(offset, content, type) {
  this.offset = offset;
  this.content = content;
  this.type = type;
}

function ReplacementWord(old, new_) {
  this.old = old;
  this.new_ = new_;
}

function ReplacementWordLine(replacementWords, lineEndOffset) {
  this.replacementWords = replacementWords;
  this.lineEndOffset = lineEndOffset;
}
