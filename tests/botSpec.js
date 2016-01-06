'use strict';

var Bot = require('../src/bot.js');
var expect = require('chai').expect;

describe('bot', function() {
    var bot;
    beforeEach(function() {
        bot = new Bot(); 
    });
    it('should be defined', function() {
        expect(bot).to.be.ok;
    });

    describe('use()', function() {
        it('should be defined', function() {
            expect(bot.use).to.exist;
        });
    });
});
