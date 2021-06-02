const { textToWordsParser, lowerCaseExceptPronounI } = require('../helpers/ngramShared.js');

function bigramGenerator(text) {
  if (typeof text !== 'string') throw new Error();

  const words = textToWordsParser(text);
  const chunks = generateChunks(lowerCaseExceptPronounI(words));

  return generateBigrams(chunks);
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
};
