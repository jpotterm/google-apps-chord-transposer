function repeatCharacter(character, length) {
  var result = '';

  for (var i = 0; i < length; ++i) {
    result += character;
  }

  return result;
}

function circularIndex(index, limit) {
  return ((index % limit) + limit) % limit;
}

function include(filename) {
  // This function for use in templates
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}
