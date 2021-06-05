function lowerCaseExceptPronounI(words) {
  return words.map((word) => word.toLowerCase().replace(/(?<=\b)i(?=\b)/g, 'I'));
}

function textToWordsParser(text) {
  const interpunctionReactText = interpunctionHandler(text);
  return whitespaceHandler(interpunctionReactText).split(' ');
}

function interpunctionHandler(text) {
  return text
    .replace(
      /(?:\.{2,}|[.!,;:?…]+(?=\s|[“”‘’"'`{}()[\]]|$)|\B[“”‘’"'`{}()[\]]|[“”‘’"'`{}()[\]]\B)/g,
      ' $& '
    )
    .replace(/\s+/g, ' ')
    .trim();
}

function whitespaceHandler(text) {
  return text.replace(/\s+/g, ' ').trim();
}

module.exports = {
  textToWordsParser,
  interpunctionHandler,
  whitespaceHandler,
  lowerCaseExceptPronounI,
};
