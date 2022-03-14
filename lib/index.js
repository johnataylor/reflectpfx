
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');

var t = lexer.tokenize('foo(22, bar(xx + 2, 555), yyy)');

t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });

var v = parser.eval(t);

console.log(JSON.stringify(v, null, 2));

var b = utils.print(v);

console.log(b);
