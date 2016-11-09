const {IRCBot, PLUGIN_TYPE} = require('../src/ircbot.js');
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

        it('should update the api with access to the irc client instance', function (){
            var myConfig = {};
            testBot.setupClient('host', 'nick', myConfig);
            expect(testBot.api.irc).to.equal(testBot._irc);
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

        it('should give the plugin access to the api, which is plugins, irc and bot', function (){
            function MyPlugin(reg, dereg, api){
                expect(api.plugins).to.deep.equal(testBot._plugins);
                expect(api.irc).to.deep.equal(testBot._irc);
                expect(api.bot).to.deep.equal(testBot);
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
                    var configObj = {};
                    register('type', configObj);
                    expect(testBot.register.calledWith('type', configObj, 'my-plugin')).to.equal(true);
                };
                testBot.use('my-plugin', MyPlugin);
            });

            it('should not allow manual overwrite of scope name', function (){
                function MyPlugin(register, deregister){
                    var configObj = {};
                    register('type', configObj, 'overwriteScope');
                    expect(testBot.register.calledWith('type', configObj, 'my-plugin')).to.equal(true);
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
            sinon.stub(testBot, 'registerPassive');
            sinon.stub(testBot, 'registerMiddleware');
            sinon.stub(testBot, 'registerCommand');
        });
        afterEach(function (){
            testBot.registerPassive.restore();
            testBot.registerMiddleware.restore();
            testBot.registerCommand.restore();
        });
        it('should route to the correct registration function and pass along parameters', function (){
            var myConfig = {};
            var myScope = 'testScope';
            testBot.register(PLUGIN_TYPE.PASSIVE, myConfig, myScope);
            expect(testBot.registerPassive.calledWith(myConfig, myScope));
            testBot.register(PLUGIN_TYPE.MIDDLEWARE, myConfig, myScope);
            expect(testBot.registerMiddleware.calledWith(myConfig, myScope));
            testBot.register(PLUGIN_TYPE.COMMAND, myConfig, myScope);
            expect(testBot.registerCommand.calledWith(myConfig, myScope));
        });
        it('should throw an error if passed an invalid plugin type', function (){
            expect(testBot.register.bind(testBot, 12345)).to.throw(Error);
        });
    });

    describe('registerPassive', function (){
        
    });
});