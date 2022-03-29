
const find = require('./find.js').find;
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');
const postfix = require('./postfix.js');
const structuredCondition = require('./structuredCondition.js').structuredCondition;
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

//var t = lexer.tokenize('foo()% * 10 + 2%');
//var t = lexer.tokenize('[1, 2, 3] as X');
//var t = lexer.tokenize('x < y < z < 42');
//var t = lexer.tokenize('Not(IsBlank(1/0))');
//var t = lexer.tokenize('foo(x + y, z, g(h(a, b, c), 42))');
//var t = lexer.tokenize('Topic.A = 5 And Topic.B < 5 * (8 - y) || length(hello & " world") > 15');
//var t = lexer.tokenize('Topic.A = 5 && Topic.B < 5 * (8 - y) || length(hello & " world") > 15');
//var t = lexer.tokenize('');

//var t = lexer.tokenize('2 + 2');
//var t = lexer.tokenize('Not(IsBlank(Topic.A))');
//var t = lexer.tokenize('x < 4 && y + 6 > z || a = 64');

//var t = lexer.tokenize('"hello"');

//var t = lexer.tokenize('(a + b) (c + d)');

var t = lexer.tokenize('(Topic.A = 1 || Topic.B = 2) && Topic.C = 3');
//var t = lexer.tokenize('Topic.A = 1 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('a = 1 || b = 2 && c = 3');

//var t = lexer.tokenize('a = 2 && (b || c) && (d || e)');
//var t = lexer.tokenize('Topic.A = 1 && Topic.B = 2 && Topic.C = 3 && Topic.D = 4');

t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });

var v = parser.eval(t);

if (v === undefined) {
    throw new Error('eval returned undefined');
}

console.log(JSON.stringify(v, null, 2));
console.log();

//var u = structuredCondition(v);
//console.log(JSON.stringify(u, null, 2));
//console.log();

//var result = find(v, (node) => node.type === 'primary' && node.match === 'function');
// var result = find(v, (node) => node.type === 'primary' && node.match === 'variable');

// result.forEach(function(item) {
//     console.log(item.name);
// })

//var b = utils.print(v);

var b = postfix.print(v);

console.log(b);

var operator = undefined;
var last = 0;
for (var i=0; i<b.length; i++) {
    if (b[i] === '&&' || b[i] === '||') {
        if (operator === undefined || operator !== b[i]) {
            last = i;
            operator = b[i];
        }
        else if (operator === b[i]) {
            b[last] = null;
            last = i;
        }
    }
}

var result = b.filter(value => value !== null);

console.log(result);
