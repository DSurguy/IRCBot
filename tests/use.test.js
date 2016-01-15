var expect = require('chai').expect;
var IRCBot = require('../src/ircbot.js');

describe('IRCBot.use', () => {
    var myBot;
    beforeEach(() =>{
        myBot = new IRCBot({});
    });
    describe('Exceptions', () => {
        it('should throw an error if the first argument is not a string', () => {
            expect(() => {
                myBot.use();
            }).to.throw(Error);
            
            expect(() =>{
                myBot.use({});
            }).to.throw(Error);
        });
        
        it('should throw an error if the second argument is not a constructor', () => {
            "use strict";
            class test {
                constructor(){};
            }; //typeof test == function
            function alsoTest(){};
            
            expect(() => {
                myBot.use('1',undefined);
            }).to.throw(Error);
            
            expect(() => {
                myBot.use('2', {});
            }).to.throw(Error);
            
            expect(() => {
                myBot.use('3', test);
            }).to.not.throw(Error);
            
            expect(() => {
                myBot.use('4', alsoTest);
            }).to.not.throw(Error);
        });
        
        it('should throw an error if the plugin is already registered', () => {
            myBot.use('test', function (){});
            expect(() => {
                myBot.use('test', function (){});
            }).to.throw(Error);
        });
        
        it('should throw an error if a dependency is injected before it is registered', () => {
            expect(() => {
                myBot.use('test', function (){}, ['someDep']);
            }).to.throw(Error);
        });
    });
    
    describe('Dependency Injection', () => {
        it('should allow no parameter for injection', () => {
            expect(() => {
                myBot.use('firstPlugin', function (){}, undefined);
            }).to.not.throw(Error);
        });
        it('should send the bot as the first parameter to the new plugin constructor without the _plugins property exposed', () => {
            var somePlugin = function (bot){
                expect(bot === myBot).to.be.true;
            };
            myBot.use('test', somePlugin);
        });
        it('should send injected plugins to the constructor of the new plugin', () => {
            "use strict";
            class firstPlugin {
                constructor (){};
            };
            
            class secondPlugin {
                constructor (bot, dep){
                    expect(dep instanceof firstPlugin).to.be.true;
                };
            };
            
            myBot.use('firstPlugin', firstPlugin);
            //run the expectation constructor
            myBot.use('secondPlugin', secondPlugin, ['firstPlugin']);
        });
    });
});