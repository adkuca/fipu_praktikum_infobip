const chai = require('chai');
const { expect } = chai;

const { arabic2roman } = require('../arabic2roman.js');

describe('arabic 2 roman', function () {
  it('arabic2roman should be a function', function () {
    expect(arabic2roman).to.be.a('function');
  });

  it('should return I from 1', function () {
    expect(arabic2roman(1)).to.be.equal('I');
  });

  it('should return II from 2', function () {
    expect(arabic2roman(2)).to.be.equal('II');
  });

  it('should return III from 3', function () {
    expect(arabic2roman(3)).to.be.equal('III');
  });

  it('should return IV from 4', function () {
    expect(arabic2roman(4)).to.be.equal('IV');
  });

  it('should return V from 5', function () {
    expect(arabic2roman(5)).to.be.equal('V');
  });

  it('should return VI from 6', function () {
    expect(arabic2roman(6)).to.be.equal('VI');
  });

  it('should return X from 10', function () {
    expect(arabic2roman(10)).to.be.equal('X');
  });

  it('should return L from 50', function () {
    expect(arabic2roman(50)).to.be.equal('L');
  });

  it('should return C from 100', function () {
    expect(arabic2roman(100)).to.be.equal('C');
  });

  it('should return D from 500', function () {
    expect(arabic2roman(500)).to.be.equal('D');
  });

  it('should return M from 1000', function () {
    expect(arabic2roman(1000)).to.be.equal('M');
  });

  it('should return MMM from 3000', function () {
    expect(arabic2roman(3000)).to.be.equal('MMM');
  });

  it('should return XIII from 13', function () {
    expect(arabic2roman(13)).to.be.equal('XIII');
  });

  it('should return XXXII from 32', function () {
    expect(arabic2roman(32)).to.be.equal('XXXII');
  });

  it('should return IX from 9', function () {
    expect(arabic2roman(9)).to.be.equal('IX');
  });

  it('should return XIV from 14', function () {
    expect(arabic2roman(14)).to.be.equal('XIV');
  });

  it('should return XIX from 19', function () {
    expect(arabic2roman(19)).to.be.equal('XIX');
  });

  it('should return XXIV from 24', function () {
    expect(arabic2roman(24)).to.be.equal('XXIV');
  });

  it('should return XL from 40', function () {
    expect(arabic2roman(40)).to.be.equal('XL');
  });
});
