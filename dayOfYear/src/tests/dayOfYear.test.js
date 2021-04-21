const { expect } = require('chai');
const dayOfYear = require('../dayOfYear.js');

describe('#dayOfYear()', function () {
  it('should be a function', function () {
    expect(dayOfYear).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if not exactly 3 arguments', function () {
      expect(() => dayOfYear()).to.throw();
      expect(() => dayOfYear(1)).to.throw();
    });
    it('should throw error if any argument is not number', function () {
      expect(() => dayOfYear(2000, '1', 1)).to.throw();
    });
  });

  it('should return 1 if 1st of January 2000', function () {
    expect(dayOfYear(2000, 1, 1)).to.be.equal(1);
  });

  it('should return 2 if 2st of January 2000', function () {
    expect(dayOfYear(2000, 1, 2)).to.be.equal(2);
  });

  it('should return 32 if 1st of February 2000', function () {
    expect(dayOfYear(2000, 2, 1)).to.be.equal(1 + 31);
  });

  it('should return 61 if 1st of March 2000', function () {
    expect(dayOfYear(2000, 3, 1)).to.be.equal(1 + 31 + 29);
  });

  it('should return 60 if 1st of March 2001', function () {
    expect(dayOfYear(2001, 3, 1)).to.be.equal(1 + 31 + 28);
  });

  it('should return 60 if 1st of March 2100', function () {
    expect(dayOfYear(2100, 3, 1)).to.be.equal(1 + 31 + 28);
  });

  it('should return 91 if 1st of April 2000', function () {
    expect(dayOfYear(2000, 4, 1)).to.be.equal(1 + 31 + 29 + 31);
  });

  it('should return 136 if 15th of April 2000', function () {
    expect(dayOfYear(2000, 5, 15)).to.be.equal(136);
  });

  it('should return 350 if 15th of December 2000', function () {
    expect(dayOfYear(2000, 12, 15)).to.be.equal(15 + 31 * 6 + 30 * 4 + 29);
  });
});
