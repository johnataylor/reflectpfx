
const find = require('./find.js').find;
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');
const postfix = require('./postfix.js').postfix;
const nary = require('./nary.js');
const structuredCondition = require('./structuredCondition.js').structuredCondition;
const makeStructuredConditionTree = require('./structuredCondition.js').makeStructuredConditionTree;
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

//var t = lexer.tokenize('(Topic.A = 1 || Topic.B = 2) && Topic.C = 3');
//var t = lexer.tokenize('Topic.A = 1 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('Topic.A + 5 < 7 || Topic.B = 2 && Topic.C = 3');
//var t = lexer.tokenize('a = 1 || b = 2 && c = 3');

//var t = lexer.tokenize('a = 2 && (b || c) && (d || e)');
//var t = lexer.tokenize('Topic.A = 1 && Topic.B = 2 && Topic.C = 3 && Topic.D = 4');

//var t = lexer.tokenize('a = 2 && (b + c) * 2 > d');

//var t = lexer.tokenize('a + b * 2');

//var t = lexer.tokenize('a = 1 && (b = 2 || c = 3 || d = 4)');
//var t = lexer.tokenize('(b = 2 || c = 3) && a = 1');
//var t = lexer.tokenize('a = 1 && b = 2 || c = 3');
//var t = lexer.tokenize('a + 32 > b * 2 && foo(b) = 2 || (x + y) * z = 3');

//var t = lexer.tokenize('a = 1 && b = 2 && c = 3 || d = 4');
//var t = lexer.tokenize('a = 1 && (b = 2 || c = 3)');
//var t = lexer.tokenize('(Topic.a = 1 && Topic.b = 2 || Topic.c = 3) && (Topic.a = 1 || Topic.d = 4)');
//var t = lexer.tokenize('(a && b || c) && (d || e)');
//var t = lexer.tokenize('a || b || c || d || e');
//var t = lexer.tokenize('a && b && c || d && e');

//var t = lexer.tokenize('a = 1 && b = 2 && c = 3 || d = 4');
//var t = lexer.tokenize('d = 4 || a = 1 && b = 2 && c = 3');
//var t = lexer.tokenize('a || b && c && d || e && f');
//var t = lexer.tokenize('a && b && c && d && e && f && (g || h)');
//var t = lexer.tokenize('a = 1 and b = 2 and c = 3 || d = 4');
//var t = lexer.tokenize('a');

var t = lexer.tokenize('x & $"text1{x + y}text2{"hello" & $" {userName} "}text3" & y');
//var t = lexer.tokenize('x + y * z');
//var t = lexer.tokenize('x & $"text1{"hello " & $" {name} "}text2" & y');

//var t = lexer.tokenize('$"text1{x + y}text2{expr2}text3"');

t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });

var parseTree = parser.eval(t);

if (parseTree === undefined) {
    throw new Error('eval returned undefined');
}

console.log(JSON.stringify(parseTree, null, 2));
console.log();

console.log(utils.toString(parseTree));

// var structuredConditionTree = structuredCondition(parseTree);
// console.log(JSON.stringify(structuredConditionTree, null, 2));
// console.log();

//var structuredConditionTree = makeStructuredConditionTree(parseTree);
//console.log(JSON.stringify(structuredConditionTree, null, 2));
//console.log(r);

