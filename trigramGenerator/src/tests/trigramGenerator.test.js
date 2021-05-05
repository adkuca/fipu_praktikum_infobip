const chai = require('chai');
const { expect } = chai;
const chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);

const trigramGenerator = require('../trigramGenerator.js');

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
    console.log(trigramGenerator('I wish I'));
    expect(trigramGenerator('I wish I')).to.eql(new Map([['I wish', ['I']]]));
  });

  // it(`should return correct trigram for 4 words input`, function () {
  //   console.log(trigramGenerator('I wish I'));
  //   expect(trigramGenerator('I wish I')).to.eql(new Map([['I wish', ['I']]]));
  // });
});
