const chai = require('chai');
const { expect } = chai;

const {
  generateRandomText,
  getFirstChunksOfSentences,
  getRandomBigramPrecedingDot,
  getRandomTrigramPrecedingDot,
  getTrigramWithDotAsValue,
} = require('../generateRandomText.js');
const { bigramGenerator } = require('../../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../../trigramGenerator/trigramGenerator.js');

describe('#generateRandomText()', function () {
  it('should be a function', function () {
    expect(generateRandomText).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => generateRandomText()).to.throw();
    });

    it('should throw error if first argument is not a positive integer or second and third are not a map', function () {
      const map = new Map();
      expect(() => generateRandomText(5, [], map)).to.throw();
      expect(() => generateRandomText({}, 5, map)).to.throw();
      expect(() => generateRandomText('', map, map)).to.throw();
      expect(() => generateRandomText(5.5, map, map)).to.throw();
      expect(() => generateRandomText(5, map)).to.throw();
    });
  });

  const text =
    'Project management has long been a people-led aspect of the workplace, but that has slowly been changing. Trends in automation, big data, and AI have not only ushered in a new wave of project management applications, but they have led to a stronger culture of people willing to use them. Today, one of the startups building a platform for the next generation of project management is announcing some funding — a sign of the traction it’s getting in the "market".';
  const bigramMap = bigramGenerator(text);
  const trigramMap = trigramGenerator(text);

  it('should return a string', function () {
    expect(generateRandomText(1, bigramMap, trigramMap)).to.be.a('string');
    expect(generateRandomText(2, bigramMap, trigramMap)).to.be.a('string');
    expect(generateRandomText(3, bigramMap, trigramMap)).to.be.a('string');
    expect(generateRandomText(4, bigramMap, trigramMap)).to.be.a('string');
    expect(generateRandomText(1000, bigramMap, trigramMap)).to.be.a('string');
  });

  it('should return a string with correct number of words not counting interpunction as words', function () {
    const randomText = generateRandomText(100, bigramMap, trigramMap);
    const randomTextWithoutInterpunction = removeInterpunction(randomText);
    expect(randomTextWithoutInterpunction.split(' ').length).to.be.equal(100);
  });

  it('return correct first chunk', function () {
    const text = 'First word.';
    const bigramMap = bigramGenerator(text);
    const randomText = generateRandomText(1, bigramMap, new Map());
    const firstWord = randomText.split(' ')[0];
    expect(firstWord).to.be.equal('first');
  });

  it('first chunk should be a random chunk following a dot or the very first chunk from bigramMap', function () {
    const text = 'First word. Second word.';
    const bigramMap = bigramGenerator(text);
    const possibleFirstWords = ['first', 'second'];
    const firstWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(1, bigramMap, new Map());
      return randomText.split(' ')[0];
    });
    expect(firstWords).to.have.members(possibleFirstWords);
  });

  it('should return empty string if no possible first chunk or one that counts as a word', function () {
    const text = '.';
    const bigramMap = bigramGenerator(text);
    expect(generateRandomText(1, bigramMap, new Map())).to.be.equal('');
  });

  it('second chunk should be a random bigram using first chunk as the key', function () {
    const text = 'First one. First two.';
    const bigramMap = bigramGenerator(text);
    const possibleSecondWords = ['one', 'two'];
    const secondWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(2, bigramMap, new Map());
      return randomText.split(' ')[1];
    });
    expect(secondWords).to.have.members(possibleSecondWords);
  });

  it("second chunk should be a random bigram preceding dot if it exists if it's also the last chunk of generated text", function () {
    const text = 'First one first two.';
    const bigramMap = bigramGenerator(text);
    const expectedLastWord = ['two'];
    const secondWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(2, bigramMap, new Map());
      return randomText.split(' ')[1];
    });
    expect(secondWords).to.be.eql(expectedLastWord);
  });

  it('third chunk should be a random trigram using first two chunks as key', function () {
    const text = 'First word one. First word two.';
    const bigramMap = bigramGenerator(text);
    const trigramMap = trigramGenerator(text);
    const possibleThirdWords = ['one', 'two'];
    const thirdWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(3, bigramMap, trigramMap);
      return randomText.split(' ')[2];
    });
    expect(thirdWords).to.have.members(possibleThirdWords);
  });

  it("third chunk should be a random trigram preceding dot if it exists if it's also the last chunk of generated text", function () {
    const text = 'First word one First word two.';
    const bigramMap = bigramGenerator(text);
    const trigramMap = trigramGenerator(text);
    const expectedLastWord = ['two'];
    const thirdWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(3, bigramMap, trigramMap);
      return randomText.split(' ')[2];
    });
    expect(thirdWords).to.be.eql(expectedLastWord);
  });

  it('fourth chunk should be a random trigram using last two chunks as key', function () {
    const text = 'First word one there. First word one here.';
    const bigramMap = bigramGenerator(text);
    const trigramMap = trigramGenerator(text);
    const possibleFourthWords = ['there', 'here'];
    const fourthWords = runXTimesAndReturnDistinctResults(20, () => {
      const randomText = generateRandomText(4, bigramMap, trigramMap);
      return randomText.split(' ')[3];
    });
    expect(fourthWords).to.have.members(possibleFourthWords);
  });

  context(
    'case with non existing trigram (last bigram of text as key for trigram might not exist)',
    function () {
      it('when trigram does not exist use a random chunk following a dot or the very first chunk from bigramMap; treat it as a new start of generating text', function () {
        const text = 'First word two. First word.';
        const bigramMap = bigramGenerator(text);
        const trigramMap = trigramGenerator(text);
        const possibleFirstWords = ['.', 'first'];
        const wordsAfterNonExistingTrigram = runXTimesAndReturnDistinctResults(20, () => {
          const randomText = generateRandomText(4, bigramMap, trigramMap);
          return randomText.split(' ')[3];
        });
        expect(wordsAfterNonExistingTrigram).to.have.members(possibleFirstWords);
      });
    }
  );

  context('when sentence is longer than 13 words prioritize ending the sentence', function () {
    it('use bigram with dot as value when it exists', function () {
      const text = 'One two one. four 5 6 7 8 9 10 11 12 14 15 16?';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const randomTextsValidForTest = runXTimesAndReturnDistinctResults(40, () => {
        const randomText = generateRandomText(20, bigramMap, trigramMap);
        return randomText.startsWith('one two one . four 5 6 7 8 9 10 11 12 14 15 16 ? one')
          ? randomText
          : '';
      }).filter(Boolean);
      const wordsAtPositionExpectingDot = randomTextsValidForTest.map(
        (text) => text.split(' ')[18]
      );
      expect(wordsAtPositionExpectingDot).to.be.eql(['.']);
    });

    it('use bigram preceding dot when it exists', function () {
      const text = 'One two one four. one 6 7 8 9 10 11 12 14 15 16 17?';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const randomTextsValidForTest = runXTimesAndReturnDistinctResults(40, () => {
        const randomText = generateRandomText(20, bigramMap, trigramMap);
        return randomText.startsWith('one two one four . one 6 7 8 9 10 11 12 14 15 16 17 ? one')
          ? randomText
          : '';
      }).filter(Boolean);
      const fourteenthWords = randomTextsValidForTest.map((text) => text.split(' ')[19]);
      expect(fourteenthWords).to.be.eql(['four']);
    });

    it('use trigram with dot as value when it exists', function () {
      const text =
        'One two three four five six seven eight nine ten eleven key1 key2 fourteen instead key1 key2.';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const randomTextsValidForTest = runXTimesAndReturnDistinctResults(20, () =>
        generateRandomText(20, bigramMap, trigramMap)
      ).filter(Boolean);
      const wordsAtPositionExpectingDot = randomTextsValidForTest.map(
        (text) => text.split(' ')[13]
      );
      expect(wordsAtPositionExpectingDot).to.be.eql(['.']);
    });

    it('use trigram preceding dot when it exists', function () {
      const text =
        'One two three four five six seven eight nine ten eleven key1 key2 fourteen instead key1 key2 precedingdot.';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const randomTextsValidForTest = runXTimesAndReturnDistinctResults(20, () =>
        generateRandomText(20, bigramMap, trigramMap)
      ).filter(Boolean);
      const fourteenthWords = randomTextsValidForTest.map((text) => text.split(' ')[13]);
      expect(fourteenthWords).to.be.eql(['precedingdot']);
    });
  });
});

describe('extracting data from bigramMap; trigramMap', function () {
  it('should return an array of first key and keys preceding dot from bigramMap', function () {
    const text = 'Project management changing. Trends in automation. Today, one of the startups.';
    const bigramMap = bigramGenerator(text);
    expect(getFirstChunksOfSentences(bigramMap)).to.be.eql(['project', 'trends', 'today']);
  });

  it('should return random bigram object preceding dot from bigramMap', function () {
    const text = 'Project one changing. Trends one automation. Today one what ok.';
    const bigramMap = bigramGenerator(text);
    const randomBigramsValuesPrecedingDot = runXTimesAndReturnDistinctResults(20, () => {
      return getRandomBigramPrecedingDot('one', bigramMap).value;
    });
    expect(randomBigramsValuesPrecedingDot).to.have.members(['changing', 'automation']);
  });

  it('should return random trigram object preceding dot from trigramMap', function () {
    const text = 'Project one two three. Trends one two four. Today one two five ok.';
    const trigramMap = trigramGenerator(text);
    const randomTrigramsValuesPrecedingDot = runXTimesAndReturnDistinctResults(20, () => {
      return getRandomTrigramPrecedingDot('one two', trigramMap).value;
    });
    expect(randomTrigramsValuesPrecedingDot).to.have.members(['three', 'four']);
  });

  it('should return trigram object with dot as value from trigramMap', function () {
    const text = 'Project one two three. Trends one two. Today one two five ok.';
    const trigramMap = trigramGenerator(text);
    const trigramWithDotAsValue = getTrigramWithDotAsValue('one two', trigramMap);
    expect(trigramWithDotAsValue).to.be.eql({ key: 'one two', value: '.' });
  });
});

function runXTimesAndReturnDistinctResults(tries, fn) {
  const distinctResults = new Set();
  for (let i = 0; i < tries; i++) distinctResults.add(fn());
  return [...distinctResults];
}

function removeInterpunction(text) {
  return text
    .replace(
      /(?:\.{2,}|[.!,;:?…]+(?=\s|[“”‘’"'`{}()[\]]|$)|\B[“”‘’"'`{}()[\]]|[“”‘’"'`{}()[\]]\B)/g,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}
