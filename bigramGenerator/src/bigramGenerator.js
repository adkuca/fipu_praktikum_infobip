function bigramGenerator(text) {
  if (typeof text !== 'string') throw new Error();

  const words = textParser(text);
  const chunks = generateChunks(lowerCaseExceptPronounI(words));

  return generateBigrams(chunks);
}

function lowerCaseExceptPronounI(words) {
  return words.map((word) => word.toLowerCase().replace(/(?<=\b)i(?=\b)/g, 'I'));
}

function textParser(text) {
  const interpunctionReactText = interpunctionHandler(text);
  return whitespaceHandler(interpunctionReactText).split(' ');
}

function interpunctionHandler(text) {
  return text
    .replace(/(?:(?:\.{3}|\?!|[,;:.!?])\B|[“”‘’"'`{}()[\]])/g, ' $& ')
    .replace(/\s+/g, ' ')
    .trim();
}

function whitespaceHandler(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function generateChunks(words) {
  return words.slice(0, words.length - 1).reduce((arr, word, i) => {
    arr.push(words.slice(i, i + 2));
    return arr;
  }, []);
}

function generateBigrams(chunks) {
  return chunks.reduce((map, words) => {
    const key = `${words[0]}`;
    const value = map.get(key);
    return map.set(key, value ? [...value, words[1]] : [words[1]]);
  }, new Map());
}

module.exports = {
  bigramGenerator,
  generateChunks,
  interpunctionHandler,
  whitespaceHandler,
};
