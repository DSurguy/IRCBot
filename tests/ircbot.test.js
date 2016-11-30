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
            expect(testBot._plugins['test']).to.be.instanceOf(MyPlugin);
        });

        it('should pass a register and deregister function to the plugin constructor', function (){
            function MyPlugin(register, deregister){
                expect(typeof register).to.equal('function');
                expect(typeof deregister).to.equal('function');
            };
            testBot.use('my-plugin', MyPlugin);
        });

        it('should give the plugin access to the bot', function (){
            function MyPlugin(reg, dereg, bot){
                expect(bot).to.deep.equal(testBot);
            };
            testBot.use('test', MyPlugin);
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
    });
});