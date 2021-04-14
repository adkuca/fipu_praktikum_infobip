const { expect } = require('chai');
const fizzBuzz = require('../fizzBuzz.js');

describe('#fizzBuzz()', function () {
  it('should be a function', function () {
    expect(fizzBuzz).to.be.a('function');
  });

  context('without argument', function () {
    it('should throw error if no argument', function () {
      expect(() => fizzBuzz()).to.throw();
    });
  });

  context('non-number argument', function () {
    it('should throw error if argument is not a number', function () {
      expect(() => fizzBuzz('1')).to.throw();
      expect(() => fizzBuzz({})).to.throw();
      expect(() => fizzBuzz([])).to.throw();
    });
  });

  context('number argument', function () {
    it('should accept number as an argument', function () {
      fizzBuzz(1);
    });

    it("should return 'Fizz' if number is divisible by 3", function () {
      expect(fizzBuzz(3)).to.equal('Fizz');
      expect(fizzBuzz(6)).to.equal('Fizz');
    });

    it("should return 'Buzz' if number is divisible by 5", function () {
      expect(fizzBuzz(5)).to.equal('Buzz');
      expect(fizzBuzz(10)).to.equal('Buzz');
    });

    it("should return 'FizzBuzz' if number is divisible by 3 and 5", function () {
      expect(fizzBuzz(15)).to.equal('FizzBuzz');
      expect(fizzBuzz(30)).to.equal('FizzBuzz');
    });

    it("should return 'FizzSuzz' if number is divisible by 3 and 7", function () {
      expect(fizzBuzz(21)).to.equal('FizzSuzz');
      expect(fizzBuzz(42)).to.equal('FizzSuzz');
    });

    it("should return 'BuzzSuzz' if number is divisible by 5 and 7", function () {
      expect(fizzBuzz(35)).to.equal('BuzzSuzz');
      expect(fizzBuzz(70)).to.equal('BuzzSuzz');
    });

    it("should return 'FizzBuzzSuzz' if number is divisible by 3, 5 and 7", function () {
      expect(fizzBuzz(105)).to.equal('FizzBuzzSuzz');
      expect(fizzBuzz(210)).to.equal('FizzBuzzSuzz');
    });

    it('should return undefined if number is not divisible by 3, 5 or 7', function () {
      expect(fizzBuzz(0)).to.equal(null);
      expect(fizzBuzz(4)).to.equal(null);
      expect(fizzBuzz(8)).to.equal(null);
    });
  });
});
