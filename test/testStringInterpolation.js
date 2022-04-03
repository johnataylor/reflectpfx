const assert = require('assert');
const stringInterpolate = require('../lib/stringInterpolation.js');

function getSegments(s) {
    var segments = [];
    function literal(s) {
        if (s.length > 0) {
            segments.push({ type: 'LITERAL', value: s });
        }
    }
    function expression(s) {
        segments.push({ type: 'EXPRESSION', value: s });
    }
    stringInterpolate.read(s, 0, literal, expression);
    return segments;
}

// note the stringInterpolation.read function assumes the leading $" has been consumed

describe('read string interpolation', function() {
    it('text1{expr1}text2{expr2}text3"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr1', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('text2', segments[2].value);
        assert.equal('EXPRESSION', segments[3].type);
        assert.equal('expr2', segments[3].value);
        assert.equal('LITERAL', segments[4].type);
        assert.equal('text3', segments[4].value);
    });
    it('text1"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
    });
    it('{expr1}"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('EXPRESSION', segments[0].type);
        assert.equal('expr1', segments[0].value);
    });
    it('{expr1}{expr2}"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('EXPRESSION', segments[0].type);
        assert.equal('expr1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr2', segments[1].value);
    });
    it('te""xt1{expr1}t""ex{{t2"""', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('te""xt1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr1', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('t""ex{{t2""', segments[2].value);
    });
    it('text1{x + y * z}text2"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('x + y * z', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('text2', segments[2].value);
    });
    it('text1{With({a:4,b:6},a*b) + c}text2"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('With({a:4,b:6},a*b) + c', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('text2', segments[2].value);
    });
    it(' text1 {expr1}  text2  {expr2}   text3   "', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal(' text1 ', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr1', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('  text2  ', segments[2].value);
        assert.equal('EXPRESSION', segments[3].type);
        assert.equal('expr2', segments[3].value);
        assert.equal('LITERAL', segments[4].type);
        assert.equal('   text3   ', segments[4].value);
    });
    it(' text1 {expr1}  text2  {expr2}   text3   "', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal(' text1 ', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr1', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('  text2  ', segments[2].value);
        assert.equal('EXPRESSION', segments[3].type);
        assert.equal('expr2', segments[3].value);
        assert.equal('LITERAL', segments[4].type);
        assert.equal('   text3   ', segments[4].value);
    });
    it(' t e x t { e x p r }"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal(' t e x t ', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal(' e x p r ', segments[1].value);
    });
    it('text1{ {{{{{{{{{{hello}}}}}}}}}} }text2"', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal(' {{{{{{{{{{hello}}}}}}}}}} ', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('text2', segments[2].value);
    });
    it('text1{expr1}text2{expr2}text3" & a & b & c', function(){
        var segments = getSegments(this.test.title);
        assert.equal('LITERAL', segments[0].type);
        assert.equal('text1', segments[0].value);
        assert.equal('EXPRESSION', segments[1].type);
        assert.equal('expr1', segments[1].value);
        assert.equal('LITERAL', segments[2].type);
        assert.equal('text2', segments[2].value);
        assert.equal('EXPRESSION', segments[3].type);
        assert.equal('expr2', segments[3].value);
        assert.equal('LITERAL', segments[4].type);
        assert.equal('text3', segments[4].value);
    });
});
