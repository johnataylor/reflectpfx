
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');

//var tokens = lexer.tokenize('(2 + 3) * (4 + 5)');
//var tokens = lexer.tokenize('(22 + (33 + 1)) * (2 + 4) + 4');
var tokens = lexer.tokenize('foo(2, bar(3 + 2, 5), 4)');

//lexer.log(tokens);

var v = parser.eval(tokens);

console.log(JSON.stringify(v, null, 2));

var buf = utils.print(v);

console.log(buf);

