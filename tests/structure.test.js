var expect = require('chai').expect;
var IRCBot = require('../src/ircbot.js');

describe('IRCBot constructor', () => {
    it('should throw an error if constructed with no host', () => {
        expect(()=>{
            var myBot = new IRCBot();
        }).to.throw(Error);
    });

    it('should throw an error if contructed with no bot name', () => {
        expect(()=>{
            var myBot = new IRCBot('someHost');
        }).to.throw(Error);
    });

    it('should allow construction with no config', () => {
        var myBot = new IRCBot('host','name');
        
        expect(myBot).to.exist;
    });
    it('should allow construction with config', () => {
        var myBot = new IRCBot('host','name', {
            name: 'test'
        });
        
        expect(myBot).to.exist;
    });
    it('should extend the internal config object with new values', () => {
        var testConfig = {
            name: 'test'
        };
        
        var myBot = new IRCBot('host','name', testConfig);
        
        expect(myBot.config.name).to.equal(testConfig.name);
    });
});

describe('Class Methods', () => {
    var myBot;
    beforeEach(() => {
        myBot = new IRCBot('host','name');
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