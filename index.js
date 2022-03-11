
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');

var tokens = lexer.tokenize('(2 + 3) * (4 + 5)');
//var tokens = lexer.tokenize('(22 + (33 + 1)) * (2 + 4) + 4');
//var tokens = lexer.tokenize('foo(2, bar(3 + 2, 5), 4)');
//var tokens = lexer.tokenize('f(g(h(11, 22, p(33, q(1)))))');
//var tokens = lexer.tokenize('f(g(), 2)');
//var tokens = lexer.tokenize('f(1, a)');
//var tokens = lexer.tokenize('f(1, g())');

//var tokens = lexer.tokenize('f(a, b, g(c + 2, 4))');
//var tokens = lexer.tokenize('f(a, b, g(p(q(4)), c * (2 + x), 4 * x, foo(2, 3, y)))');
//var tokens = lexer.tokenize('x * 2 < (42 - y)');
//var tokens = lexer.tokenize('len(x) > 20');

//lexer.log(tokens);

var v = parser.eval(tokens);

console.log(JSON.stringify(v, null, 2));

var buf = utils.print(v);

console.log(buf);
