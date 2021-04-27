const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
chai.use(require('sinon-chai'));

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

  context('with correctly formatted data as input', function () {
    beforeEach(() => {
      sinon.restore();
    });

    const data = [
      {
        from: '2020-01-01',
        to: '2020-02-01',
        price: 34.5,
      },
    ];

    it('should return undefined', function () {
      expect(priceListFormatter(data)).to.be.an('undefined');
    });

    it('should log once', function () {
      const log = sinon.spy(console, 'log');
      priceListFormatter(data);
      expect(log).to.be.calledOnce;
    });
  });
});
