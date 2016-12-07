"use strict";
const {IRCBot, MessageHandler} = require('../src/ircbot.js');
var expect = require('chai').expect;
var irc = require('irc');
var sinon = require('sinon');

describe('IRCBot', function (){
    var testBot;
    beforeEach(function (){
        testBot = new IRCBot();
    });

    describe('setupClient', function (){
        beforeEach(function (){
            sinon.spy(irc, 'Client');
        });
        afterEach(function (){
            irc.Client.restore();
        });

        it('should pass parameters to irc.Client', function (){
            var myConfig = {};
            testBot.setupClient('host', 'nick', myConfig);
            expect(irc.Client.calledWith('host', 'nick', myConfig));
        });

        it('should store an instance of irc.Client on the bot', function (){
            var myConfig = {};
            testBot.setupClient('host', 'nick', myConfig);
            expect(testBot._irc).to.be.instanceOf(irc.Client);
        });

        it('should error if the client is already configured and is called again', function (){
            var myConfig = {};
            testBot.setupClient('host', 'nick', myConfig);
            expect(testBot.setupClient.bind(testBot, 'host', 'nick', myConfig)).to.throw(Error);
        });
    });

    describe('use', function (){
        it('should store a new instance of the plugin class in _plugins', function (){
            function MyPlugin(){};
            testBot.use('test', MyPlugin);
            expect(testBot._plugins['test'].plugin).to.be.instanceOf(MyPlugin);
        });

        it('should pass a register and deregister function to the plugin constructor, as well as reference to the bot', function (){
            function MyPlugin(register, deregister, bot){
                expect(typeof register).to.equal('function');
                expect(typeof deregister).to.equal('function');
                expect(bot).to.deep.equal(testBot);
            };
            testBot.use('my-plugin', MyPlugin);
        });

        it('should setup the nextId for the plugin to be used for handler registration', function (){
            function MyPlugin(){};
            testBot.use('test', MyPlugin);
            expect(testBot._plugins['test'].nextId).to.equal(0);
        });

        describe('scoped register', function (){
            beforeEach(function (){
                sinon.stub(testBot, 'register');
            });
            afterEach(function (){
                testBot.register.restore();
            });
            it('should call register with the plugin name hardcoded as scope', function (){
                function MyPlugin(register, deregister){
                    var myHandler = {};
                    register(myHandler);
                    expect(testBot.register.calledWith(myHandler, 'my-plugin')).to.equal(true);
                };
                testBot.use('my-plugin', MyPlugin);
            });

            it('should not allow manual overwrite of scope name', function (){
                function MyPlugin(register, deregister){
                    var myHandler = {};
                    register(myHandler, 'overwriteScope');
                    expect(testBot.register.calledWith(myHandler, 'my-plugin')).to.equal(true);
                };
                testBot.use('my-plugin', MyPlugin);
            });
        });

        describe('scoped deregister', function (){
            beforeEach(function (){
                sinon.stub(testBot, 'deregister');
            });
            afterEach(function (){
                testBot.deregister.restore();
            });
            it('should call deregister with the plugin name hardcoded as scope', function (){
                function MyPlugin(register, deregister){
                    deregister(1);
                    expect(testBot.deregister.calledWith(1, 'my-plugin')).to.equal(true);
                };
                testBot.use('my-plugin', MyPlugin);
            });

            it('should not allow manual overwrite of scope name', function (){
                function MyPlugin(register, deregister){
                    deregister(1, 'overwriteScope');
                    expect(testBot.deregister.calledWith(1, 'my-plugin')).to.equal(true);
                };
                testBot.use('my-plugin', MyPlugin);
            });
        });
    });

    describe('register', function (){
        beforeEach(function (){
            testBot._irc = {on: sinon.stub()};
        });
        afterEach(function (){
            
        });
        it('Should bind an event for every eventname returned from the Handler "boundEvents" function', function (){
            var newHandler = {boundEvents: ()=>{return['a','b','c']}};
            testBot.register(newHandler);
            var testArgs;
            for( var i=0; i<3; i++ ){
                testArgs = testBot._irc.on.getCall(i).args;
                expect(testArgs[0]).to.equal(newHandler.boundEvents()[i]);
                expect(typeof testArgs[1]).to.equal('function');
            }
        })

        it('should store reference to handlers and bound events with scope', function (){
            var scope = 'my-plugin';
            testBot._plugins[scope] = {nextId: 0};
            var myHandler = {boundEvents: ()=>['test']};
            testBot.register(myHandler, scope);
            expect(typeof testBot._plugins[scope][0].events['test']).to.equal('function');
            expect(testBot._plugins[scope][0].handler).to.equal(myHandler);
        })

        it('should store reference to handlers without scope', function (){
            var myHandler = {boundEvents: ()=>['test']};
            testBot.register(myHandler);
            expect(typeof testBot._plugins[0].events['test']).to.equal('function');
            expect(testBot._plugins[0].handler).to.equal(myHandler);
        })

        it('should autoincrement plugin ids in scope', function (){
            var scope = 'my-plugin';
            testBot._plugins[scope] = {nextId: 0};
            var myHandler = {boundEvents: ()=>[]};
            testBot.register(myHandler, scope);
            expect(testBot._plugins[scope].nextId).to.equal(1);
        })

        it('should autoincrement plugin ids without scope', function (){
            var myHandler = {boundEvents: ()=>[]};
            testBot.register(myHandler);
            expect(testBot._plugins.nextId).to.equal(1);
        })
    });
    
    describe('deregister', function (){
        beforeEach(function (){
            testBot._irc = {removeListener: sinon.stub()};
        });
        afterEach(function (){
            
        });
        it('should remove all bound events for a deregistered handler (with scope)', function (){
            var scope = 'scope';
            var myHandler = function (){};
            var myBind = function (){myHandler()};
            testBot._plugins[scope] = {
                nextId: 1,
                0: {
                    handler: myHandler,
                    events: {
                        'banana': myBind
                    }
                }
            };
            testBot.deregister(0,scope);
            expect(testBot._irc.removeListener.calledWith('banana', myBind)).to.be.equal(true);
        });
        it('should remove the handler (with scope)', function (){
            var scope = 'scope';
            var myHandler = function (){};
            var myBind = function (){myHandler()};
            testBot._plugins[scope] = {
                nextId: 1,
                0: {
                    handler: myHandler,
                    events: {
                        'banana': myBind
                    }
                }
            };
            testBot.deregister(0,scope);
            expect(testBot._plugins[scope][0]).to.be.equal(undefined);
        });
        it('should remove all bound events for a deregistered handler (without scope)', function (){
            var myHandler = function (){};
            var myBind = function (){myHandler()};
            testBot._plugins[0] = {
                handler: myHandler,
                events: {
                    'banana': myBind
                }
            };
            testBot.deregister(0);
            expect(testBot._irc.removeListener.calledWith('banana', myBind)).to.be.equal(true);
        });
        it('should remove the handler (without scope)', function (){
            var myHandler = function (){};
            var myBind = function (){myHandler()};
            testBot._plugins[0] = {
                handler: myHandler,
                events: {
                    'banana': myBind
                }
            };
            testBot.deregister(0);
            expect(testBot._plugins[0]).to.be.equal(undefined);
        });
        it('should throw an error if the handlerId is not an int', function (){
            expect(testBot.deregister.bind(testBot, 'nextId')).to.throw(Error);
            expect(testBot.deregister.bind(testBot, {})).to.throw(Error);
        });
        it('should silently fail if the handlerId is not present (with scope)', function (){
            var scope = 'scope';
            var myHandler = function (){};
            testBot._plugins[scope] = {
                nextId: 1
            };
            expect(testBot.deregister.bind(testBot, 0, scope)).to.not.throw(Error);
        });
        it('should silently fail if the handlerId is not present (without scope)', function (){
            var myHandler = function (){};
            testBot._plugins = {
                nextId: 1
            };
            expect(testBot.deregister.bind(testBot, 0)).to.not.throw(Error);
        });
    });
});