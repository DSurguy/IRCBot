var IRCBot = require('../src/ircbot.js');
var expect = require('chai').expect;

describe('IRCBot', function (){
    var testBot;
    beforeEach(function (){
        testBot = new IRCBot();
    });
});