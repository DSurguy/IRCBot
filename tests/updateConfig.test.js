var expect = require('chai').expect;
var IRCBot = require('../src/ircbot.js');

describe('IRCBot.updateConfig', function (){
    var myBot;
    beforeEach( () => {
        myBot = new IRCBot('host','name');
        myBot.config = {
            test: 'test'
        };
    });
    it('should accept an empty object and do nothing', () => {
        myBot.updateConfig({});
        
        expect(myBot.config).to.deep.equal({
            test: 'test'
        });
    });
    
    it('should throw an error if something other than an object is passed in', () => {
        expect( () => {
            myBot.updateConfig();
        }).to.throw(Error);
    });
    
    it('should add new properties to the bot config', () => {
        myBot.updateConfig({
            apple: 'orange'
        });
        
        expect(myBot.config.apple).to.equal('orange');
    });
    
    it('should add complex objects to the config', () => {
        myBot.updateConfig({
            fatObj: {
                thisObject: 'should lose weight'
            }
        });
        
        expect(myBot.config.fatObj).to.deep.equal({
            thisObject: 'should lose weight'
        });
    });
    
    it('should only update the properties in the new object', () => {
        myBot.updateConfig({
            banana: 'is a fruit, man'
        });
        
        expect(myBot.config.test).to.equal('test');
    });
    
    it('should allow overwriting existing properties', () => {
        myBot.updateConfig({
            test: 'newTest'
        });
        
        expect(myBot.config.test).to.equal('newTest');
    });
});