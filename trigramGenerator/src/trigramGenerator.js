function trigramGenerator(text) {
  if (typeof text !== 'string') throw new Error();

  const words = parseText(text);
  const chunks = generateChunks(words);

  return generateTrigrams(chunks);
}

function parseText(text) {
  return text.trim().split(/\s+/g);
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
  parseText,
};
