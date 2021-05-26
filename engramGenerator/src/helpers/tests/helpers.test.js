const chai = require('chai');
const { expect } = chai;

const { interpunctionHandler, whitespaceHandler } = require('../helpers.js');

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
