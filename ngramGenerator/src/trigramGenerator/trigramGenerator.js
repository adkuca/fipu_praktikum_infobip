const { textToWordsParser, lowerCaseExceptPronounI } = require('../helpers/ngramShared.js');

function trigramGenerator(text) {
  if (typeof text !== 'string') throw new Error();

  const words = textToWordsParser(text);
  const chunks = generateChunks(lowerCaseExceptPronounI(words));

  return generateTrigrams(chunks);
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
};
