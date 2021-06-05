function generateRandomText(numberOfWords, bigramMap, trigramMap) {
  if (!isInputValid(...arguments)) throw new Error();

  if (!hasSomeFirstChunkThatCountsAsAWord(bigramMap)) return '';

  const textObject = createTextObject();

  fillTextObject(textObject, numberOfWords, bigramMap, trigramMap);

  return textObject.chunks.length ? textObject.chunks.join(' ') : '';
}

module.exports = {
  generateRandomText,
  getFirstChunksOfSentences,
  getRandomBigramPrecedingDot,
  getRandomTrigramPrecedingDot,
  getTrigramWithDotAsValue,
};

function fillTextObject(textObject, numberOfWords, bigramMap, trigramMap) {
  for (let i = 0; textObject.wordsCount < numberOfWords; i++) {
    const textConditions = {
      isLastWord: numberOfWords - 1 === textObject.wordsCount,
      shouldEndSentenceFirstOpportunity: textObject.wordsCount - textObject.lastDotIndex >= 13,
    };
    const chunk =
      getNextChunk(i, textConditions, textObject, bigramMap, trigramMap) ||
      getNextChunk((i = 0), textConditions, textObject, bigramMap, trigramMap);

    textObject.addChunk(chunk);
  }
  textObject.addChunk('.');
}

function createTextObject() {
  return {
    chunks: [],
    wordsCount: 0,
    lastDotIndex: 0,
    addChunk(chunk) {
      this.chunks.push(chunk);
      this.countsAsAWord(chunk) && this.wordsCount++;
      chunk === '.' && (this.lastDotIndex = this.wordsCount);
    },
    countsAsAWord(text) {
      return !!text && !this.isInterpunction(text);
    },

    isInterpunction(string) {
      return /^[.!,;:?…“”‘’"'`{}()[\]]+$/.test(string);
    },

    getLastChunk() {
      return this.chunks[this.chunks.length - 1] || '';
    },

    getLastTwoChunks() {
      return this.chunks.slice(-2).join(' ') || '';
    },
  };
}

function getNextChunk(chunkIndex, textConditions, textObject, bigramMap, trigramMap) {
  if (chunkIndex === 0) return getRandomFirstChunk(bigramMap);
  else if (chunkIndex === 1)
    return getBigramChunk(textObject.getLastChunk(), bigramMap, textConditions);

  return getTrigramChunk(textObject.getLastTwoChunks(), trigramMap, textConditions);
}

function getBigramChunk(lastChunk, bigramMap, textConditions) {
  if (textConditions.isLastWord)
    return getRandomBigramPrioritizingBigramPrecedingDot(lastChunk, bigramMap).value;
  else if (textConditions.shouldEndSentenceFirstOpportunity)
    return (
      getBigramWithDotAsValue(lastChunk, bigramMap).value ||
      getRandomBigramPrioritizingBigramPrecedingDot(lastChunk, bigramMap).value
    );

  return getRandomBigram(lastChunk, bigramMap).value;
}

function getTrigramChunk(lastTwoChunks, trigramMap, textConditions) {
  if (textConditions.isLastWord)
    return getRandomTrigramPrioritizingTrigramPrecedingDot(lastTwoChunks, trigramMap).value;
  else if (textConditions.shouldEndSentenceFirstOpportunity)
    return (
      getTrigramWithDotAsValue(lastTwoChunks, trigramMap).value ||
      getRandomTrigramPrioritizingTrigramPrecedingDot(lastTwoChunks, trigramMap).value
    );

  return getRandomTrigram(lastTwoChunks, trigramMap).value;
}

function getBigramWithDotAsValue(key, bigramMap) {
  const bigramValues = bigramMap.get(key) || [];
  const bigramHasDotAsValue = bigramValues.includes('.');
  return { key, value: bigramHasDotAsValue ? '.' : '' };
}

function getTrigramWithDotAsValue(key, trigramMap) {
  const trigramValues = trigramMap.get(key) || [];
  const trigramHasDotAsValue = trigramValues.includes('.');
  return { key, value: trigramHasDotAsValue ? '.' : '' };
}

function getRandomTrigramPrioritizingTrigramPrecedingDot(key, trigramMap) {
  const trigramPrecedingDot = getRandomTrigramPrecedingDot(key, trigramMap);
  return trigramPrecedingDot.value ? trigramPrecedingDot : getRandomTrigram(key, trigramMap);
}

function getRandomTrigramPrecedingDot(key, trigramMap) {
  const trigramValues = trigramMap.get(key) || [];
  const trigramValuesPrecedingDot = trigramValues.filter((value) =>
    trigramMap.get(`${key.split(' ')[1]} ${value}`)?.includes('.')
  );
  const randomTrigramValuePrecedingDot = getRandomItemFromArray(trigramValuesPrecedingDot) || '';
  return { key, value: randomTrigramValuePrecedingDot };
}

function getRandomBigramPrioritizingBigramPrecedingDot(key, bigramMap) {
  const bigramPrecedingDot = getRandomBigramPrecedingDot(key, bigramMap);
  return bigramPrecedingDot.value ? bigramPrecedingDot : getRandomBigram(key, bigramMap);
}

function getRandomBigramPrecedingDot(key, bigramMap) {
  const bigramValues = bigramMap.get(key) || [];
  const bigramValuesPrecedingDot = bigramValues.filter((value) =>
    bigramMap.get(value)?.includes('.')
  );
  const randomBigramValuePrecedingDot = getRandomItemFromArray(bigramValuesPrecedingDot) || '';
  return { key, value: randomBigramValuePrecedingDot };
}

function countsAsAWord(text) {
  return !!text && !isInterpunction(text);
}

function isInterpunction(string) {
  return /^[.!,;:?…“”‘’"'`{}()[\]]+$/.test(string);
}

function getRandomTrigram(key, trigramMap) {
  const trigramValues = trigramMap.get(key) || [];
  const randomTrigramValue = getRandomItemFromArray(trigramValues) || '';
  return { key, value: randomTrigramValue };
}

function getRandomBigram(key, bigramMap) {
  const bigramValues = bigramMap.get(key) || [];
  const randomBigramValue = getRandomItemFromArray(bigramValues) || '';
  return { key, value: randomBigramValue };
}

function getRandomFirstChunk(bigramMap) {
  const possibleFirstChunks = getFirstChunksOfSentences(bigramMap);
  return possibleFirstChunks.length ? getRandomItemFromArray(possibleFirstChunks) : '';
}

function getFirstChunksOfSentences(bigramMap) {
  const firstChunk = Array.from(bigramMap.keys())[0];
  const chunksFollowingDot = bigramMap.get('.') || [];
  return [...new Set([firstChunk, ...chunksFollowingDot])].filter(Boolean);
}

function hasSomeFirstChunkThatCountsAsAWord(bigramMap) {
  return getFirstChunksOfSentences(bigramMap).some((firstWord) => countsAsAWord(firstWord));
}

function getRandomItemFromArray(array) {
  return array?.[Math.floor(Math.random() * array?.length)];
}

function isInputValid(numberOfWords, bigramMap, trigramMap) {
  const isPositiveInteger = Number.isInteger(numberOfWords) && Math.sign(numberOfWords);
  return isPositiveInteger && bigramMap instanceof Map && trigramMap instanceof Map;
}
