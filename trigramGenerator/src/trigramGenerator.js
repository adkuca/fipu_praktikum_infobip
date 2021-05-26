function trigramGenerator(text) {
  if (typeof text !== 'string') throw new Error();

  const words = textParser(text);
  const chunks = generateChunks(lowerCaseExceptPronounI(words));

  return generateTrigrams(chunks);
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
  return words.slice(0, words.length - 2).reduce((arr, word, i) => {
    arr.push(words.slice(i, i + 3));
    return arr;
  }, []);
}

function generateTrigrams(chunks) {
  return chunks.reduce((map, words) => {
    const key = `${words[0]} ${words[1]}`;
    const value = map.get(key);
    return map.set(key, value ? [...value, words[2]] : [words[2]]);
  }, new Map());
}

module.exports = {
  trigramGenerator,
  generateChunks,
  interpunctionHandler,
  whitespaceHandler,
};
