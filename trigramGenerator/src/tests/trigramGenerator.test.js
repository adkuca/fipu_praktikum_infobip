const chai = require('chai');
const { expect } = chai;

const { trigramGenerator, generateChunks, parseText } = require('../trigramGenerator.js');

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
    // expect(trigramGenerator('')).to.be.an('object');
    expect(typeof trigramGenerator('')).to.equal('object');
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

  it(`should return correct trigram for 7 words input`, function () {
    expect(trigramGenerator('I wish I may I wish I')).to.eql(
      new Map([
        ['I wish', ['I', 'I']],
        ['wish I', ['may']],
        ['I may', ['I']],
        ['may I', ['wish']],
      ])
    );
  });
});

describe('#parseText()', function () {
  it('should return correct array with given text as input', function () {
    expect(parseText('')).to.eql(['']);
    expect(parseText('I wish')).to.eql(['I', 'wish']);
    expect(parseText('I wish, I may.')).to.eql(['I', 'wish,', 'I', 'may.']);
  });

  it('should return correct array ignoring whitespace', function () {
    expect(parseText('I  wish')).to.eql(['I', 'wish']);
    expect(parseText('I\twish')).to.eql(['I', 'wish']);
    expect(parseText('I\nwish')).to.eql(['I', 'wish']);
    expect(parseText('I\n\rwish')).to.eql(['I', 'wish']);
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
