var expect = require('chai').expect;
var IRCBot = require('../src/ircbot.js');

describe('IRCBot constructor', () => {
    it('should allow construction with no config', () => {
        var myBot = new IRCBot();
        
        expect(myBot).to.exist;
    });
    it('should allow construction with config', () => {
        var myBot = new IRCBot({
            name: 'test'
        });
        
        expect(myBot).to.exist;
    });
    it('should clone the config to avoid reference issues', () => {
        var testConfig = {
            name: 'test'
        };
        
        var myBot = new IRCBot(testConfig);
        
        expect(testConfig).to.not.equal(myBot.config);
        expect(testConfig).to.deep.equal(myBot.config);
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
    it('should contain an updateConfig method', () => {
        expect(myBot.updateConfig).to.be.instanceof(Function);
    });
    it('should have a start method', () => {
        expect(myBot.start).to.be.instanceof(Function);
    });
    it('should have a stop method', () => {
        expect(myBot.stop).to.be.instanceof(Function);
    });
});