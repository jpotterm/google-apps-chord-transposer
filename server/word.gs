function Word(offset, content) {
  this.offset = offset;
  this.content = content;
}

function ReplacementWord(old, new_) {
  this.old = old;
  this.new_ = new_;
}

function ReplacementWordLine(replacementWords, lineEndOffset) {
  this.replacementWords = replacementWords;
  this.lineEndOffset = lineEndOffset;
}
