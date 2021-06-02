const chai = require('chai');
const { expect } = chai;

const { trigramGenerator, generateChunks } = require('../trigramGenerator.js');

describe('#trigramGenerator()', function () {
  it('should be a function', function () {
    expect(trigramGenerator).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => trigramGenerator()).to.throw();
    });

    it('should throw error if argument is not a string', function () {
      expect(() => trigramGenerator(5)).to.throw();
      expect(() => trigramGenerator([])).to.throw();
      expect(() => trigramGenerator({})).to.throw();
    });
  });

  it('should return an object', function () {
    expect(trigramGenerator('')).to.be.a('map');
  });

  it(`should return correct trigram for 2 words input`, function () {
    expect(trigramGenerator('I wish')).to.eql(new Map());
  });

  it(`should return correct trigram for 3 words input`, function () {
    expect(trigramGenerator('I wish I')).to.eql(new Map([['I wish', ['I']]]));
  });

  it(`should return correct trigram for 4 words input`, function () {
    expect(trigramGenerator('I wish I may')).to.eql(
      new Map([
        ['I wish', ['I']],
        ['wish I', ['may']],
      ])
    );
  });

  it(`should return correct trigram for 5 words input`, function () {
    expect(trigramGenerator('I wish I may I')).to.eql(
      new Map([
        ['I wish', ['I']],
        ['wish I', ['may']],
        ['I may', ['I']],
      ])
    );
  });

  it(`should return correct trigram for 6 words input`, function () {
    expect(trigramGenerator('I wish I may I wish')).to.eql(
      new Map([
        ['I wish', ['I']],
        ['wish I', ['may']],
        ['I may', ['I']],
        ['may I', ['wish']],
      ])
    );
  });

  const sevenWordsInputTrigram = new Map([
    ['I wish', ['I', 'I']],
    ['wish I', ['may']],
    ['I may', ['I']],
    ['may I', ['wish']],
  ]);

  it(`should return correct trigram for 7 words input`, function () {
    expect(trigramGenerator('I wish I may I wish I')).to.eql(sevenWordsInputTrigram);
  });

  it(`should return correct trigram for 7 words with whitespace as input`, function () {
    expect(trigramGenerator('I wish\n I   may \tI \n\rwish I')).to.eql(sevenWordsInputTrigram);
  });

  context('text parsing', function () {
    it('should be letter capitalisation agnostic', function () {
      const text = 'Evo neka bude netko';
      const initial = trigramGenerator(text);
      const lowerCased = trigramGenerator(text.toLocaleLowerCase());
      expect(initial).to.eql(lowerCased);
    });

    it("should have pronoun 'I' correctly uppercase", function () {
      expect(trigramGenerator('Ivan with i or I')).to.eql(
        new Map([
          ['ivan with', ['I']],
          ['with I', ['or']],
          ['I or', ['I']],
        ])
      );
    });

    it('handles punctuation as a separate word', function () {
      expect(trigramGenerator('I am.')).to.eql(new Map([['I am', ['.']]]));
      expect(trigramGenerator('I a@email.com.')).to.eql(new Map([['I a@email.com', ['.']]]));
      expect(trigramGenerator('I am,')).to.eql(new Map([['I am', [',']]]));
      expect(trigramGenerator('I am;')).to.eql(new Map([['I am', [';']]]));
      expect(trigramGenerator('I am:')).to.eql(new Map([['I am', [':']]]));
      expect(trigramGenerator('I am!')).to.eql(new Map([['I am', ['!']]]));
      expect(trigramGenerator('I am?')).to.eql(new Map([['I am', ['?']]]));
      expect(trigramGenerator('I am?!')).to.eql(new Map([['I am', ['?!']]]));
      expect(trigramGenerator('I am...')).to.eql(new Map([['I am', ['...']]]));
      expect(trigramGenerator('“Says: "I am?"[w](ok){1}.”')).to.eql(
        new Map([
          ['“ says', [':']],
          ['says :', ['"']],
          [': "', ['I']],
          ['" I', ['am']],
          ['I am', ['?']],
          ['am ?', ['"']],
          ['am ?', ['"']],
          ['? "', ['[']],
          ['" [', ['w']],
          ['[ w', [']']],
          ['w ]', ['(']],
          ['] (', ['ok']],
          ['( ok', [')']],
          ['ok )', ['{']],
          [') {', ['1']],
          ['{ 1', ['}']],
          ['1 }', ['.']],
          ['} .', ['”']],
        ])
      );
    });
  });
});

describe('#generateChunks()', function () {
  it('should return correct array for less than 3 words input', function () {
    expect(generateChunks(['I', 'wish'])).to.eql([]);
  });

  it('should return correct array for 3 words input', function () {
    expect(generateChunks(['I', 'wish', 'I'])).to.eql([['I', 'wish', 'I']]);
  });

  it('should return correct array for 4 words input', function () {
    expect(generateChunks(['I', 'wish', 'I', 'may'])).to.eql([
      ['I', 'wish', 'I'],
      ['wish', 'I', 'may'],
    ]);
  });
});
