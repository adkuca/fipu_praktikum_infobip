const chai = require('chai');
const { expect } = chai;

const { bigramGenerator, generateChunks } = require('../bigramGenerator.js');

const { interpunctionHandler, whitespaceHandler } = require('../../helpers/helpers.js');

describe('#bigramGenerator()', function () {
  it('should be a function', function () {
    expect(bigramGenerator).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => bigramGenerator()).to.throw();
    });

    it('should throw error if argument is not a string', function () {
      expect(() => bigramGenerator(5)).to.throw();
      expect(() => bigramGenerator([])).to.throw();
      expect(() => bigramGenerator({})).to.throw();
    });
  });

  it('should return an object', function () {
    // expect(bigramGenerator('')).to.be.an('object');
    expect(typeof bigramGenerator('')).to.equal('object');
  });

  it(`should return correct bigram for 1 word input`, function () {
    expect(bigramGenerator('I')).to.eql(new Map());
  });

  it(`should return correct bigram for 2 words input`, function () {
    expect(bigramGenerator('I wish')).to.eql(new Map([['I', ['wish']]]));
  });

  it(`should return correct bigram for 3 words input`, function () {
    expect(bigramGenerator('I wish I')).to.eql(
      new Map([
        ['I', ['wish']],
        ['wish', ['I']],
      ])
    );
  });

  it(`should return correct bigram for 4 words input`, function () {
    expect(bigramGenerator('I wish I may')).to.eql(
      new Map([
        ['I', ['wish', 'may']],
        ['wish', ['I']],
      ])
    );
  });

  it(`should return correct bigram for 5 words input`, function () {
    expect(bigramGenerator('I wish I may I')).to.eql(
      new Map([
        ['I', ['wish', 'may']],
        ['wish', ['I']],
        ['may', ['I']],
      ])
    );
  });

  it(`should return correct bigram for 6 words input`, function () {
    expect(bigramGenerator('I wish I may I wish')).to.eql(
      new Map([
        ['I', ['wish', 'may', 'wish']],
        ['wish', ['I']],
        ['may', ['I']],
      ])
    );
  });

  const sevenWordsInputbigram = new Map([
    ['I', ['wish', 'may', 'wish']],
    ['wish', ['I', 'I']],
    ['may', ['I']],
  ]);

  it(`should return correct bigram for 7 words input`, function () {
    expect(bigramGenerator('I wish I may I wish I')).to.eql(sevenWordsInputbigram);
  });

  it(`should return correct bigram for 7 words with whitespace as input`, function () {
    expect(bigramGenerator('I wish\n I   may \tI \n\rwish I')).to.eql(sevenWordsInputbigram);
  });

  context('text parsing', function () {
    it('should be letter capitalisation agnostic', function () {
      const text = 'Evo neka bude netko';
      const initial = bigramGenerator(text);
      const lowerCased = bigramGenerator(text.toLocaleLowerCase());
      expect(initial).to.eql(lowerCased);
    });

    it("should have pronoun 'I' correctly uppercase", function () {
      expect(bigramGenerator('Ivan with i or I')).to.eql(
        new Map([
          ['ivan', ['with']],
          ['with', ['I']],
          ['I', ['or']],
          ['or', ['I']],
        ])
      );
    });

    it('handles punctuation as a separate word', function () {
      expect(bigramGenerator('am.')).to.eql(new Map([['am', ['.']]]));
      expect(bigramGenerator('a@email.com.')).to.eql(new Map([['a@email.com', ['.']]]));
      expect(bigramGenerator('am,')).to.eql(new Map([['am', [',']]]));
      expect(bigramGenerator('am;')).to.eql(new Map([['am', [';']]]));
      expect(bigramGenerator('am:')).to.eql(new Map([['am', [':']]]));
      expect(bigramGenerator('am!')).to.eql(new Map([['am', ['!']]]));
      expect(bigramGenerator('am?')).to.eql(new Map([['am', ['?']]]));
      expect(bigramGenerator('am?!')).to.eql(new Map([['am', ['?!']]]));
      expect(bigramGenerator('am...')).to.eql(new Map([['am', ['...']]]));
      expect(bigramGenerator('“Says: "I am?"[w](ok){1}.”')).to.eql(
        new Map([
          ['“', ['says']],
          ['says', [':']],
          [':', ['"']],
          ['"', ['I', '[']],
          ['I', ['am']],
          ['am', ['?']],
          ['?', ['"']],
          ['[', ['w']],
          ['w', [']']],
          [']', ['(']],
          ['(', ['ok']],
          ['ok', [')']],
          [')', ['{']],
          ['{', ['1']],
          ['1', ['}']],
          ['}', ['.']],
          ['.', ['”']],
        ])
      );
    });
  });
});

describe('#whitespaceHandler()', function () {
  it('should return correct string', function () {
    expect(whitespaceHandler('I  wish')).to.equal('I wish');
    expect(whitespaceHandler('I\twish')).to.equal('I wish');
    expect(whitespaceHandler('I\nwish')).to.equal('I wish');
    expect(whitespaceHandler('I\r\nwish')).to.equal('I wish');
  });
});

describe('#interpunctionHandler()', function () {
  it('should return correct string', function () {
    expect(interpunctionHandler('I am.')).to.equal('I am .');
    expect(interpunctionHandler('I a@email.com.')).to.equal('I a@email.com .');
    expect(interpunctionHandler(',;:!??!...')).to.equal(', ; : ! ? ?! ...');
    expect(interpunctionHandler('“”‘’"\'`{}()[]')).to.equal('“ ” ‘ ’ " \' ` { } ( ) [ ]');
  });
});

describe('#generateChunks()', function () {
  it('should return correct array for less than 2 words input', function () {
    expect(generateChunks(['I'])).to.eql([]);
  });

  it('should return correct array for 2 words input', function () {
    expect(generateChunks(['I', 'wish'])).to.eql([['I', 'wish']]);
  });

  it('should return correct array for 3 words input', function () {
    expect(generateChunks(['I', 'wish', 'I'])).to.eql([
      ['I', 'wish'],
      ['wish', 'I'],
    ]);
  });
});
