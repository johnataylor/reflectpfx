
const roundtrip = require('./testHelper.js').roundtrip;

describe('round trip', function() {
    it('(2 + 3) * (4 + 5)', function () { roundtrip(this.test.title) });
    it('(22 + (33 + 1)) * (2 + 4) + 4', function () { roundtrip(this.test.title) });
    it('foo(2, bar(3 + 2, 5), 4)', function () { roundtrip(this.test.title) });
    it('foo(22, bar(xx + 2, 555), yyy)', function () { roundtrip(this.test.title) });
    it('f(g(h(11, 22, p(33, q(1)))))', function () { roundtrip(this.test.title) });
    it('f(g(), 2)', function () { roundtrip(this.test.title) });
    it('f(1, a)', function () { roundtrip(this.test.title) });
    it('f(1, g())', function () { roundtrip(this.test.title) });
    it('f(a, b, g(c + 2, 4))', function () { roundtrip(this.test.title) });
    it('f(a, b, g(p(q(4)), c * (2 + x), 4 * x, foo(2, 3, y)))', function () { roundtrip(this.test.title) });
    it('x * 2 < (42 - y)', function () { roundtrip(this.test.title) });
    it('len(x) > 20', function () { roundtrip(this.test.title) });
    it('"hello" & " " & "world"', function () { roundtrip(this.test.title) });
    it(`"You say, ""How are you?"", ""Good luck""" & "But you don't mean it"`, function () { roundtrip(this.test.title) });
    it('4 < x <> true', function () { roundtrip(this.test.title) });
});

