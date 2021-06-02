const chai = require('chai');
const { expect } = chai;

const { randomTextGenerator } = require('../randomTextGenerator.js');
const { bigramGenerator } = require('../../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../../trigramGenerator/trigramGenerator.js');

describe('#randomTextGenerator()', function () {
  it('should be a function', function () {
    expect(randomTextGenerator).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => randomTextGenerator()).to.throw();
    });

    it('should throw error if first argument is not a positive integer or second and third are not a map', function () {
      const map = new Map();
      expect(() => randomTextGenerator(5, [], map)).to.throw();
      expect(() => randomTextGenerator({}, 5, map)).to.throw();
      expect(() => randomTextGenerator('', map, map)).to.throw();
      expect(() => randomTextGenerator(5.5, map, map)).to.throw();
      expect(() => randomTextGenerator(5, map)).to.throw();
    });
  });

  const text =
    'Project management has long been a people-led aspect of the workplace, but that has slowly been changing. Trends in automation, big data, and AI have not only ushered in a new wave of project management applications, but they have led to a stronger culture of people willing to use them. Today, one of the startups building a platform for the next generation of project management is announcing some funding — a sign of the traction it’s getting in the "market".';
  const bigramMap = bigramGenerator(text);
  const trigramMap = trigramGenerator(text);
  // console.log(bigramMap, trigramMap);

  it('should return a string', function () {
    // expect(randomTextGenerator(1, bigramMap, trigramMap)).to.be.a('string');
    expect(randomTextGenerator(2, bigramMap, trigramMap)).to.be.a('string');
    // expect(randomTextGenerator(3, bigramMap, trigramMap)).to.be.a('string');
    // expect(randomTextGenerator(4, bigramMap, trigramMap)).to.be.a('string');
    const randomText = randomTextGenerator(200, bigramMap, trigramMap);
    console.log(randomText);
    expect(randomText).to.be.a('string');
  });

  it('should return a string with n number of words', function () {
    const n = 20;
    const randomlyGeneratedText = randomTextGenerator(n, bigramMap, trigramMap);
    expect(randomlyGeneratedText.split(' ').length).to.be.equal(n);
  });

  it('should return a string ending with a dot if not empty string', function () {
    const randomlyGeneratedText = randomTextGenerator(1, bigramMap, trigramMap);
    if (randomlyGeneratedText.length) expect(randomlyGeneratedText.slice(-1)).to.be.equal('.');
  });

  context('should return text with 1 word', function () {
    it('should return empty string if no possible first word', function () {
      const text = '.';
      const bigramMap = bigramGenerator(text);
      expect(randomTextGenerator(1, bigramMap, new Map())).to.be.equal('');
    });
    it('return correct first word', function () {
      const text = 'First word.';
      const bigramMap = bigramGenerator(text);
      const randomText = randomTextGenerator(1, bigramMap, new Map());
      expect(randomText.slice(0, -1)).to.be.equal('first');
    });
    it('first word should be a random word from bigram keys that is following a dot or the very first key', function () {
      const text = 'First word. Second word.';
      const bigramMap = bigramGenerator(text);
      const randomText = randomTextGenerator(1, bigramMap, new Map());
      const possibleFirstWords = ['first', 'second'];
      const firstWord = randomText.slice(0, -1).split(' ')[0];
      expect(firstWord).to.be.oneOf(possibleFirstWords);
    });
  });

  context('last word should prioritize a word that is followed by a dot', function () {
    it('when word preceding dot exists as bigram', function () {
      const text = 'First one first two.';
      const bigramMap = bigramGenerator(text);
      const randomText = randomTextGenerator(2, bigramMap, new Map());
      const possibleLastWords = ['two'];
      const lastWord = randomText.slice(0, -1).split(' ').slice(-1)[0];
      expect(lastWord).to.be.oneOf(possibleLastWords);
    });
    it('when word preceding dot does not exist as bigram; pick random word followed by a dot', function () {
      const text = 'First one first two ok.';
      const bigramMap = bigramGenerator(text);
      const randomText = randomTextGenerator(2, bigramMap, new Map());
      const possibleLastWords = ['ok'];
      const lastWord = randomText.slice(0, -1).split(' ').slice(-1)[0];
      expect(lastWord).to.be.oneOf(possibleLastWords);
    });

    it('when word preceding dot exists as trigram', function () {
      const text = 'First word one First word two.';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const possibleThirdWords = ['two'];
      const randomText = randomTextGenerator(3, bigramMap, trigramMap);
      const thirdWord = randomText.slice(0, -1).split(' ')[2];
      expect(thirdWord).to.be.oneOf(possibleThirdWords);
    });

    it('when word preceding dot does not exist as trigram but does as bigram', function () {
      const text = 'First word one First word two Second word ok.';
      const bigramMap = bigramGenerator(text);
      const trigramMap = trigramGenerator(text);
      const possibleThirdWords = ['ok'];
      const randomText = randomTextGenerator(3, bigramMap, trigramMap);
      const thirdWord = randomText.slice(0, -1).split(' ')[2];
      expect(thirdWord).to.be.oneOf(possibleThirdWords);
    });
  });

  it('second word should be a random word from bigram key`s values', function () {
    const text = 'First one. First two.';
    const bigramMap = bigramGenerator(text);
    const randomText = randomTextGenerator(2, bigramMap, new Map());
    const possibleSecondWords = ['one', 'two'];
    const secondWord = randomText.slice(0, -1).split(' ')[1];
    expect(secondWord).to.be.oneOf(possibleSecondWords);
  });

  it('third word should be a random word from trigrams key`s values', function () {
    const text = 'First word one. First word two.';
    const bigramMap = bigramGenerator(text);
    const trigramMap = trigramGenerator(text);
    const possibleThirdWords = ['one', 'two'];
    const randomText = randomTextGenerator(3, bigramMap, trigramMap);
    const thirdWord = randomText.slice(0, -1).split(' ')[2];
    expect(thirdWord).to.be.oneOf(possibleThirdWords);
  });

  it('fourth word should be a random word from trigrams key`s values', function () {
    const text = 'First word one there. First word one here.';
    const bigramMap = bigramGenerator(text);
    const trigramMap = trigramGenerator(text);
    const possibleThirdWords = ['there', 'here'];
    const randomText = randomTextGenerator(4, bigramMap, trigramMap);
    const fourthWord = randomText.slice(0, -1).split(' ')[3];
    expect(fourthWord).to.be.oneOf(possibleThirdWords);
  });

  context(
    'handle case when not existing trigram for bigram as key (words at the end of sentence)',
    function () {
      it('when trigram does not exist; use bigram', function () {
        const text = 'First word one there two. First word there';
        const bigramMap = bigramGenerator(text);
        const trigramMap = trigramGenerator(text);
        const possibleFourthWords = ['there', 'two'];
        const randomText = randomTextGenerator(5, bigramMap, trigramMap);
        const fourthWord = randomText.slice(0, -1).split(' ')[3];
        expect(fourthWord).to.be.oneOf(possibleFourthWords);
      });
      it('when trigram nor bigram exist; use random word preceding dot', function () {
        const text = 'First word one what why two. First word there';
        const bigramMap = bigramGenerator(text);
        const trigramMap = trigramGenerator(text);
        const possibleFourthWords = ['what', 'two'];
        const randomText = randomTextGenerator(5, bigramMap, trigramMap);
        const fourthWord = randomText.slice(0, -1).split(' ')[3];
        expect(fourthWord).to.be.oneOf(possibleFourthWords);
      });
    }
  );

  context.skip('sentence limits', function () {
    it('prioritize word that preceds dot if sentence is getting too long (sentenceSizeSoftLimit)', function () {});
  });
});
