const { expect } = require('chai');
const priceListFormatter = require('../priceListFormatter.js');

describe('#priceListFormatter()', function () {
  it('should be a function', function () {
    expect(priceListFormatter).to.be.a('function');
  });
});
