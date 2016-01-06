var expect = require('chai').expect;
var IRCBot = require('../bot/ircbot.js');

describe('IRCBot constructor', () => {
    it('should clone the config to avoid reference issues', () => {
        var testConfig = {
            name: 'test'
        };
        
        var myBot = new IRCBot(testConfig);
        
        expect(testConfig).to.not.equal(myBot.config);
        expect(testConfig).to.deep.equal(myBot.config);
    });
    
    it('should throw an error if config.name is not defined', () => {
        expect(() => {
            var myBot = new IRCBot({});
        }).to.throw();
    });
});

describe('Class Methods', () => {
    var myBot;
    beforeEach(() => {
        myBot = new IRCBot({
            name: 'test'
        });
    });
    it('should contain a use method', () => {
        expect(myBot.use).to.be.instanceof(Function);
    });
});