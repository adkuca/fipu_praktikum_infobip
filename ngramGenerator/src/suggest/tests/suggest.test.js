const chai = require('chai');
const { expect } = chai;

const { suggest } = require('../suggest.js');
const { bigramGenerator } = require('../../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../../trigramGenerator/trigramGenerator.js');

describe('#suggest()', function () {
  it('should be a function', function () {
    expect(suggest).to.be.a('function');
  });

  context('wrong input', function () {
    it('should throw error if no argument', function () {
      expect(() => suggest()).to.throw();
    });

    it('should throw error if first argument is not a string or second is not a map', function () {
      const map = new Map();
      expect(() => suggest(5, map)).to.throw();
      expect(() => suggest([], map)).to.throw();
      expect(() => suggest({}, map)).to.throw();
      expect(() => suggest('', {})).to.throw();
      expect(() => suggest('')).to.throw();
    });
  });

  it('should return an array', function () {
    expect(suggest('', new Map())).to.be.an('array');
  });
  describe('suggest bigram', function () {
    const text =
      "I wish they wish I may I wish I might I wish I could I should I would I won't, could he wish he might he won't";
    const bigramMap = bigramGenerator(text);
    // Map(12) {
    //   'I' => [ 'wish', 'may', 'wish', 'might', 'wish', 'could', 'should', 'would', "won't" ],
    //   'wish' => [ 'they', 'I', 'I', 'I', 'he' ],
    //   'they' => [ 'wish' ],
    //   'may' => [ 'I' ],
    //   'might' => [ 'I', 'he' ],
    //   'could' => [ 'I', 'he' ],
    //   'should' => [ 'I' ],
    //   'would' => [ 'I' ],
    //   "won't" => [ ',' ],
    //   ',' => [ 'could' ],
    //   'he' => [ 'wish', 'might', "won't" ]
    // }

    it('should return empty array for non-existing bigram key', function () {
      expect(suggest('none', bigramMap)).to.be.eql([]);
    });
    it('should return correct array with only one suggestion', function () {
      expect(suggest('may', bigramMap)).to.be.eql(['I']);
      expect(suggest('they', bigramMap)).to.be.eql(['wish']);
    });
    it('should return correct array with multiple suggestions', function () {
      expect(suggest('he', bigramMap)).to.be.eql(['wish', 'might', "won't"]);
    });
    it('should return correct array with distinct suggestions ordered by elements frequency', function () {
      expect(suggest('wish', bigramMap)).to.be.eql(['I', 'they', 'he']);
    });
    it('should return correct array with max. 5 distinct suggestions ordered by elements frequency', function () {
      expect(suggest('I', bigramMap)).to.be.eql(['wish', 'may', 'might', 'could', 'should']);
    });
  });

  describe('suggest trigram', function () {
    const text =
      "I wish they wish I might I may I wish I wish I might I could I might I could, they wish I might I wish I wish they could I wish won't I wish might I wish may I wish could I wish they";
    const trigram = trigramGenerator(text);
    // Map(18) {
    //   'I wish' => [ 'they', 'I', 'I', 'I', 'they', "won't", 'might', 'may', 'could', 'they' ],
    //   'wish they' => [ 'wish', 'could' ],
    //   'they wish' => [ 'I', 'I' ],
    //   'wish I' => [ 'might', 'wish', 'might', 'might', 'wish' ],
    //   'I might' => [ 'I', 'I', 'I', 'I' ],
    //   'might I' => [ 'may', 'could', 'could', 'wish', 'wish' ],
    //   'I may' => [ 'I' ],
    //   'may I' => [ 'wish', 'wish' ],
    //   'I could' => [ 'I', ',' ],
    //   'could I' => [ 'might', 'wish', 'wish' ],
    //   'could ,' => [ 'they' ],
    //   ', they' => [ 'wish' ],
    //   'they could' => [ 'I' ],
    //   "wish won't" => [ 'I' ],
    //   "won't I" => [ 'wish' ],
    //   'wish might' => [ 'I' ],
    //   'wish may' => [ 'I' ],
    //   'wish could' => [ 'I' ]
    // }

    it('should return empty array for non-existing bigram key', function () {
      expect(suggest('not key', trigram)).to.be.eql([]);
    });
    it('should return correct array with only one suggestion', function () {
      expect(suggest('I may', trigram)).to.be.eql(['I']);
      expect(suggest('could ,', trigram)).to.be.eql(['they']);
    });
    it('should return correct array with multiple suggestions', function () {
      expect(suggest('wish they', trigram)).to.be.eql(['wish', 'could']);
    });
    it('should return correct array with distinct suggestions ordered by elements frequency', function () {
      expect(suggest('might I', trigram)).to.be.eql(['could', 'wish', 'may']);
    });
    it('should return correct array with max. 5 distinct suggestions ordered by elements frequency', function () {
      expect(suggest('I wish', trigram)).to.be.eql(['they', 'I', "won't", 'might', 'may']);
    });
  });
});
