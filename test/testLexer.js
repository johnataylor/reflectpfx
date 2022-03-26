const assert = require('assert');
const lexer = require('../lib/lexer.js');

describe('whitespace', function() {
    it('single space should be tokenized', function(){
        var tokens = lexer.tokenize(' ');
        assert.equal('WS', tokens[0].type);
    });
    it('multiple space should be tokenized', function(){
        var tokens = lexer.tokenize('    ');
        assert.equal('WS', tokens[0].type);
    });
    it('cr and tab space should be tokenized', function(){
        var tokens = lexer.tokenize('\n\n\t \t');
        assert.equal('WS', tokens[0].type);
    });
    it('mixed tokens and whitespace space should be tokenized', function(){
        var tokens = lexer.tokenize(' 2 +\n\n 2+3 + 4\t-34 + 1');
        tokens = tokens.filter((token) => token.type != 'WS'); 
        assert.equal(12, tokens.length);
    });
});

describe('comments', function() {
    it('regular C style comment', function(){
        var tokens = lexer.tokenize('hello /* this is a comment */ world');
        assert.equal('COMMENT', tokens[2].type);
        assert.equal('/* this is a comment */', tokens[2].value);
    });
    it('C++ style comments (reintroduced from BCPL)', function(){
        var tokens = lexer.tokenize('hello // this is a comment\r\n world');
        assert.equal('COMMENT', tokens[2].type);
        assert.equal('// this is a comment', tokens[2].value);
    });
    it('multiple comments C style comments', function(){
        var tokens = lexer.tokenize('no /* comment 1 */ direction /* comment 2 */ home');
        assert.equal('COMMENT', tokens[2].type);
        assert.equal('/* comment 1 */', tokens[2].value);
        assert.equal('COMMENT', tokens[6].type);
        assert.equal('/* comment 2 */', tokens[6].value);
    });
    it('combining comment styles', function(){
        var tokens = lexer.tokenize('like /* comment 1 */ a // /* comment 2 */ rolling\r\nstone');
        assert.equal('COMMENT', tokens[2].type);
        assert.equal('/* comment 1 */', tokens[2].value);
        assert.equal('COMMENT', tokens[6].type);
        assert.equal('// /* comment 2 */ rolling', tokens[6].value);
    });
    it('comments in code', function(){
        var tokens = lexer.tokenize('f(/* comment 1 */42, /* comment 2 */"hello world" /* comment 3 */, x + y)');
        assert.equal('COMMENT', tokens[2].type);
        assert.equal('/* comment 1 */', tokens[2].value);
        assert.equal('COMMENT', tokens[6].type);
        assert.equal('/* comment 2 */', tokens[6].value);
        assert.equal('COMMENT', tokens[9].type);
        assert.equal('/* comment 3 */', tokens[9].value);
    });
});

describe('individual tokens', function() {
    describe('arithmetic operators', function() {
        it('+ should be tokenized', function(){
            var tokens = lexer.tokenize('+');
            assert.equal('PLUS', tokens[0].type);
        });
        it('- should be tokenized', function(){
            var tokens = lexer.tokenize('-');
            assert.equal('MINUS', tokens[0].type);
        });
        it('* should be tokenized', function(){
            var tokens = lexer.tokenize('*');
            assert.equal('MUL', tokens[0].type);
        });
        it('/ should be tokenized', function(){
            var tokens = lexer.tokenize('/');
            assert.equal(2, tokens.length)
            assert.equal('DIV', tokens[0].type);
            assert.equal('END', tokens[1].type);
        });
        it('multiple operators in context should be tokenized', function(){
            var tokens = lexer.tokenize('500 + 300 - 5 * 3 + 20 / 4');
            assert.equal(22, tokens.length);
            assert.equal('PLUS', tokens[2].type);
            assert.equal('MINUS', tokens[6].type);
            assert.equal('MUL', tokens[10].type);
            assert.equal('PLUS', tokens[14].type);
            assert.equal('DIV', tokens[18].type);
        });
    });
    describe('logical operators', function() {
    });
    describe('language mechanism operators', function() {
        describe('functions', function() {
            it('function calls should be tokenized', function(){
                var tokens = lexer.tokenize('func(arg0, arg1, arg2)');
                tokens = tokens.filter(token => token.type != 'WS');
                tokens.pop();
                assert.equal(8, tokens.length)
                assert.equal('NAME', tokens[0].type);
                assert.equal('LP', tokens[1].type);
                assert.equal('NAME', tokens[2].type);
                assert.equal('COMMA', tokens[3].type);
                assert.equal('NAME', tokens[4].type);
                assert.equal('COMMA', tokens[5].type);
                assert.equal('NAME', tokens[6].type);
                assert.equal('RP', tokens[7].type);
            });
            it('nested function calls should be tokenized', function(){
                var tokens = lexer.tokenize('a( b( c( 42 ) ) )');
                tokens = tokens.filter(token => token.type != 'WS');
                tokens.pop();
                assert.equal(10, tokens.length)
                assert.equal('NAME', tokens[0].type);
                assert.equal('LP', tokens[1].type);
                assert.equal('NAME', tokens[2].type);
                assert.equal('LP', tokens[3].type);
                assert.equal('NAME', tokens[4].type);
                assert.equal('LP', tokens[5].type);
                assert.equal('NUMBER', tokens[6].type);
                assert.equal('42', tokens[6].value);
                assert.equal('RP', tokens[7].type);
                assert.equal('RP', tokens[8].type);
                assert.equal('RP', tokens[9].type);
            });
            it('function calls containing expressions should be tokenized', function(){
                var tokens = lexer.tokenize('f(x + 42)');
                tokens = tokens.filter(token => token.type != 'WS');
                tokens.pop();
                assert.equal(6, tokens.length)
                assert.equal('NAME', tokens[0].type);
                assert.equal('LP', tokens[1].type);
                assert.equal('NAME', tokens[2].type);
                assert.equal('PLUS', tokens[3].type);
                assert.equal('NUMBER', tokens[4].type);
                assert.equal('RP', tokens[5].type);
            });
        });
        describe('dot', function() {
        });
    });
});

describe('literals', function() {
    describe('numbers', function() {
        it('numbers should be tokenized', function(){
            var tokens = lexer.tokenize('5');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('5', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('multi-digit numbers should be tokenized', function(){
            var tokens = lexer.tokenize('123');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('123', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with decimal place should be tokenized', function(){
            var tokens = lexer.tokenize('1.4');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('1.4', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('multi-digit numbers with decimal place should be tokenized', function(){
            var tokens = lexer.tokenize('123.456');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('123.456', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with leading decimal place should be tokenized', function(){
            var tokens = lexer.tokenize('.99');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('.99', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with decimal and - exponent should be tokenized', function(){
            var tokens = lexer.tokenize('1.23e-4');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('1.23e-4', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with - exponent should be tokenized', function(){
            var tokens = lexer.tokenize('7e-4');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('7e-4', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with + exponent should be tokenized', function(){
            var tokens = lexer.tokenize('1.23e+4');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('1.23e+4', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('numbers with no sign in exponent should be tokenized', function(){
            var tokens = lexer.tokenize('1.23e4');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('1.23e4', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('dot should not be tokenized as a number', function(){
            var tokens = lexer.tokenize('.');
            assert.equal(2, tokens.length)
            assert.equal('DOT', tokens[0].type);
            assert.equal('.', tokens[0].value);
            assert.equal('END', tokens[1].type);
        });
        it('multiple numbers should be tokenized', function(){
            var tokens = lexer.tokenize('123 456 789');
            assert.equal(6, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('123', tokens[0].value);
            assert.equal('NUMBER', tokens[2].type);
            assert.equal('456', tokens[2].value);
            assert.equal('NUMBER', tokens[4].type);
            assert.equal('789', tokens[4].value);
            assert.equal('END', tokens[5].type);
        });
        it('multiple numbers of all kinds should be tokenized', function(){
            var tokens = lexer.tokenize('1.3 3.1415 42 .99999 1.23e-4 64');
            assert.equal(12, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('1.3', tokens[0].value);
            assert.equal('NUMBER', tokens[2].type);
            assert.equal('3.1415', tokens[2].value);
            assert.equal('NUMBER', tokens[4].type);
            assert.equal('42', tokens[4].value);
            assert.equal('NUMBER', tokens[6].type);
            assert.equal('.99999', tokens[6].value);
            assert.equal('NUMBER', tokens[8].type);
            assert.equal('1.23e-4', tokens[8].value);
            assert.equal('NUMBER', tokens[10].type);
            assert.equal('64', tokens[10].value);
            assert.equal('END', tokens[11].type);
        });
    });
    describe('strings', function() {
        it('string literals should be tokenized', function(){
            var tokens = lexer.tokenize('"hello world"');
            assert.equal(2, tokens.length)
            assert.equal('TEXT_LITERAL', tokens[0].type);
            assert.equal('"hello world"', tokens[0].value);
        });
        it('string literals containing escaped double quotes should be tokenized', function(){
            var tokens = lexer.tokenize('"hello and ""goodbye"""');
            assert.equal(2, tokens.length)
            assert.equal('TEXT_LITERAL', tokens[0].type);
            assert.equal('"hello and ""goodbye"""', tokens[0].value);
        });
        it('multiple string literals should be tokenized', function(){
            var tokens = lexer.tokenize('"one" "two" "three" "four"');
            tokens = tokens.filter(token => token.type != 'WS');
            tokens.pop();
            assert.equal(4, tokens.length)
            assert.equal('TEXT_LITERAL', tokens[0].type);
            assert.equal('"one"', tokens[0].value);
            assert.equal('TEXT_LITERAL', tokens[1].type);
            assert.equal('"two"', tokens[1].value);
            assert.equal('TEXT_LITERAL', tokens[2].type);
            assert.equal('"three"', tokens[2].value);
            assert.equal('TEXT_LITERAL', tokens[3].type);
            assert.equal('"four"', tokens[3].value);
        });
        it('string literals in context should be tokenized', function(){
            var tokens = lexer.tokenize('"one" & "two"');
            tokens = tokens.filter(token => token.type != 'WS');
            tokens.pop();
            assert.equal(3, tokens.length)
            assert.equal('TEXT_LITERAL', tokens[0].type);
            assert.equal('"one"', tokens[0].value);
            assert.equal('CONCAT', tokens[1].type);
            assert.equal('TEXT_LITERAL', tokens[2].type);
            assert.equal('"two"', tokens[2].value);
        });
        it('string literals including escaped double quotes in context should be tokenized', function(){
            var tokens = lexer.tokenize('"one and ""one""" & "two and ""two"""');
            tokens = tokens.filter(token => token.type != 'WS');
            tokens.pop();
            assert.equal(3, tokens.length)
            assert.equal('TEXT_LITERAL', tokens[0].type);
            assert.equal('"one and ""one"""', tokens[0].value);
            assert.equal('CONCAT', tokens[1].type);
            assert.equal('TEXT_LITERAL', tokens[2].type);
            assert.equal('"two and ""two"""', tokens[2].value);
        });
    });
    describe('boolean', function() {
        it('true should be tokenized', function(){
            var tokens = lexer.tokenize('true');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('true', tokens[0].value);
        });
        it('True should be tokenized', function(){
            var tokens = lexer.tokenize('True');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('True', tokens[0].value);
        });
        it('TRUE should be tokenized', function(){
            var tokens = lexer.tokenize('TRUE');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('TRUE', tokens[0].value);
        });
        it('false should be tokenized', function(){
            var tokens = lexer.tokenize('false');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('false', tokens[0].value);
        });
        it('False should be tokenized', function(){
            var tokens = lexer.tokenize('False');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('False', tokens[0].value);
        });
        it('FALSE should be tokenized', function(){
            var tokens = lexer.tokenize('FALSE');
            assert.equal(2, tokens.length)
            assert.equal('LOGICAL_LITERAL', tokens[0].type);
            assert.equal('FALSE', tokens[0].value);
        });
    });
});

describe('comparison operators', function() {
});

describe('cross token interference', function() {
});
