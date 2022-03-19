
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');
const roundtrip = require('../test/testHelper.js').roundtrip;

//var t = lexer.tokenize('7 && 0');
//var t = lexer.tokenize('f(x, y >= 6)');
//var t = lexer.tokenize('Not Blank()');
//var t = lexer.tokenize('Not(Blank())');
//var t = lexer.tokenize('Table({b:1,a:2},{a:4,b:3})');
//var t = lexer.tokenize('{b:1,a:2}');
//var t = lexer.tokenize('{a:1}');
//var t = lexer.tokenize('a.b');
//var t = lexer.tokenize('a.b.c.d');
//var t = lexer.tokenize('foo().b');
//var t = lexer.tokenize('{ b: 42 }.b');
//var t = lexer.tokenize('a.b.c');

var t = lexer.tokenize('foo()% * 10 + 2%');

t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });

var v = parser.eval(t);

console.log(JSON.stringify(v, null, 2));

var b = utils.print(v);

console.log(b);

//roundtrip('"x" in "apple"');




