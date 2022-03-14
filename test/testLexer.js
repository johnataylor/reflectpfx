var assert = require('assert');
const lexer = require('../lib/lexer.js');

describe('whitespace', function() {
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
        });
        describe('dot', function() {
        });
    });
});

describe('literals', function() {
    describe('numbers', function() {
        it('numbers should be tokenized', function(){
            var tokens = lexer.tokenize('123');
            assert.equal(2, tokens.length)
            assert.equal('NUMBER', tokens[0].type);
            assert.equal('123', tokens[0].value);
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
    });
    describe('strings', function() {
    });
    describe('boolean', function() {
    });
});

describe('cross token interference', function() {
});
