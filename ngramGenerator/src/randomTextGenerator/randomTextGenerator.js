function randomTextGenerator(numberOfWords, bigramMap, trigramMap) {
  const isPositiveInteger = Number.isInteger(numberOfWords) && Math.sign(numberOfWords) === 1;
  if (!isPositiveInteger || !(bigramMap instanceof Map && trigramMap instanceof Map))
    throw new Error();

  let result = '';
  for (let i = 1, lastDotIndex = 0; i <= numberOfWords; i++) {
    const isLastWord = i === numberOfWords;
    if (i === 1) result += chooseRandomFirstWordOfSentences(bigramMap);
    // if (i === 2) {
    //   result +=
    //     ' ' +
    //     (isLastWord
    //       ? lastWordPrioritizingBigramPrecedingDot(result, bigramMap)
    //       : chooseBigram(result, bigramMap).value);
    // }
    if (i >= 2) {
      let word;
      if (isLastWord) word = chooseLastWord(result, bigramMap, trigramMap);
      else if (shouldPrioritizeWordPrecedingDot(i, lastDotIndex))
        word = chooseNextWordPrioritizingPrecedingDot(result, bigramMap, trigramMap);
      else word = chooseNextWord(result, bigramMap, trigramMap);
      if (word === '.') lastDotIndex = i;
      result += ' ' + word;
    }
  }

  return result ? result + '.' : '';
}

module.exports = { randomTextGenerator };

function shouldPrioritizeWordPrecedingDot(index, lastDotIndex) {
  return index - lastDotIndex > 25;
}

function lastWordPrioritizingBigramPrecedingDot(key, bigramMap) {
  const bigramPrecedingDot = chooseBigramPrecedingDot(key, bigramMap);
  return bigramPrecedingDot.value
    ? bigramPrecedingDot.value
    : chooseRandomLastWordOfSentences(bigramMap);
}

function chooseLastWord(result, bigramMap, trigramMap) {
  const lastBigram = result.split(' ').slice(-2).join(' ');
  const trigramPrecedingDot = chooseTrigramPrecedingDot(lastBigram, trigramMap);
  if (trigramPrecedingDot.value) return trigramPrecedingDot.value;

  const lastWord = result.split(' ').slice(-1).join(' ');
  const bigramPrecedingDot = chooseBigramPrecedingDot(lastWord, bigramMap);
  if (bigramPrecedingDot.value) return bigramPrecedingDot.value;

  return chooseRandomLastWordOfSentences(bigramMap);
}

function chooseNextWord(result, bigramMap, trigramMap) {
  const lastBigram = result.split(' ').slice(-2).join(' ');
  const trigramValue = chooseTrigram(lastBigram, trigramMap).value;
  if (trigramValue) return trigramValue;

  const lastWord = result.split(' ').slice(-1).join(' ');
  const bigramValue = chooseBigram(lastWord, bigramMap).value;
  if (bigramValue) return bigramValue;

  return chooseRandomLastWordOfSentences(bigramMap);
}

function chooseNextWordPrioritizingPrecedingDot(result, bigramMap, trigramMap) {
  const lastBigram = result.split(' ').slice(-2).join(' ');
  const trigramValue = chooseTrigramPrioritizingTrigramPrecedingDot(lastBigram, trigramMap).value;
  if (trigramValue) return trigramValue;

  const lastWord = result.split(' ').slice(-1).join(' ');
  const bigramValue = chooseBigramPrioritizingBigramPrecedingDot(lastWord, bigramMap).value;
  if (bigramValue) return bigramValue;

  return chooseRandomLastWordOfSentences(bigramMap);
}

function chooseTrigramFromLastBigram() {}
function chooseBigramFromLastWord() {}

function chooseTrigram(key, trigramMap) {
  const possibleWordsFollowingBigram = trigramMap.get(key);
  const wordFollowingBigram = getRandomItemFromArray(possibleWordsFollowingBigram);
  return { key, value: wordFollowingBigram };
}

function chooseTrigramPrecedingDot(key, trigramMap) {
  const possibleWordsFollowingBigram = trigramMap.get(key);
  const secondWordOfBigram = key.split(' ')[1];
  const possibleWordsFollowingBigramPrecedingDot = possibleWordsFollowingBigram?.filter((keys) =>
    trigramMap.get(`${secondWordOfBigram} ${keys}`)?.includes('.')
  );
  const wordFollowingBigram =
    getRandomItemFromArray(possibleWordsFollowingBigramPrecedingDot) || '';
  return { key, value: wordFollowingBigram };
}

function chooseTrigramPrioritizingTrigramPrecedingDot(key, trigramMap) {
  const trigramPrecedingDot = chooseTrigramPrecedingDot(key, trigramMap);
  return trigramPrecedingDot.value ? trigramPrecedingDot : chooseTrigram(key, trigramMap);
}

function chooseBigramPrioritizingBigramPrecedingDot(key, bigramMap) {
  const bigramPrecedingDot = chooseBigramPrecedingDot(key, bigramMap);
  return bigramPrecedingDot.value ? bigramPrecedingDot : chooseBigram(key, bigramMap);
}

function chooseBigram(key, bigramMap) {
  const possibleSecondWords = bigramMap.get(key);
  const secondWord = getRandomItemFromArray(possibleSecondWords);
  return { key, value: secondWord };
}

function chooseBigramPrecedingDot(key, bigramMap) {
  const possibleSecondWords = bigramMap.get(key);
  const possibleSecondWordsPrecedingDot = possibleSecondWords?.filter((keys) =>
    bigramMap.get(keys)?.includes('.')
  );
  const secondWord = getRandomItemFromArray(possibleSecondWordsPrecedingDot) || '';
  return { key, value: secondWord };
}

function chooseRandomFirstWordOfSentences(bigramMap) {
  const possibleFirstWords = firstWordsOfSentences(bigramMap);
  return possibleFirstWords.length ? getRandomItemFromArray(possibleFirstWords) : '';
}

function firstWordsOfSentences(bigramMap) {
  const firstWord = Array.from(bigramMap.keys())[0];
  const wordsFollowingDot = bigramMap.has('.') ? bigramMap.get('.') : [];
  return [...new Set([firstWord, ...wordsFollowingDot])].filter(Boolean);
}

function getRandomItemFromArray(array) {
  return array?.[Math.floor(Math.random() * array?.length)];
}

function chooseRandomLastWordOfSentences(bigramMap) {
  const possibleLastWords = lastWordsOfSentences(bigramMap);
  return possibleLastWords.length ? getRandomItemFromArray(possibleLastWords) : '';
}

function lastWordsOfSentences(bigramMap) {
  return Array.from(bigramMap).reduce((acc, [key, value]) => {
    if (value.includes('.')) acc.push(key);
    return acc;
  }, []);
}
