var expect = require('chai').expect;
var IRCBot = require('../bot/ircbot.js');

describe('IRCBot constructor', function (){
    it('should clone the config to avoid reference issues', function (){
        var testConfig = {
            name: 'test',
            irc: {
                host: 'test'
            }
        };
        
        var myBot = new IRCBot(testConfig);
        
        expect(testConfig).to.not.equal(myBot.config);
        expect(testConfig).to.deep.equal(myBot.config);
    });
    
    it('should throw an error if config.name is not defined', function (){
        expect(function (){
            var myBot = new IRCBot({});
        }).to.throw();
    });
    
    it('should throw an error if config.irc is not defined', function (){
        expect(function (){
            var myBot = new IRCBot({
                name: 'test'
            });
        }).to.throw();
    });
    
    it('should throw an error if config.irc.host is not defined', function (){
        expect(function (){
            var myBot = new IRCBot({
                name: 'test',
                irc: {}
            });
        }).to.throw();
    });
});