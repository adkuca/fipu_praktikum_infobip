const { expect } = require('chai');
const priceListFormatter = require('../priceListFormatter.js');

describe('#priceListFormatter()', function () {
  it('should be a function', function () {
    expect(priceListFormatter).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => dayOfYear(1)).to.throw();
      expect(() => dayOfYear({})).to.throw();
    });
    it('should throw error if argument is not an array', function () {
      expect(() => dayOfYear(1)).to.throw();
      expect(() => dayOfYear({})).to.throw();
    });
    it('should throw error if argument is an empty array', function () {
      expect(() => dayOfYear([])).to.throw();
    });
  });
});
