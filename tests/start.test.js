var chai = require('chai'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    IrcClient = require('irc').Client,
    IRCBot = require('../src/ircbot.js');

chai.use(sinonChai);

describe('IRCBot.start', () => {
    var myBot;
    beforeEach(() => {
        myBot = new IRCBot();
    });
    it('should call supporting methods', () => {
        //stub out the helper methods
        sinon.stub(myBot, '_createClient');
        sinon.stub(myBot, '_connectClient');
        myBot.start();
        expect(myBot._createClient).to.have.been.called;
        expect(myBot._connectClient).to.have.been.called;
        //no need to unstub the methods, the bot is recreated before each test
    });
    describe('IRCBot._createClient', () => {
        it('should throw an error if config.ircHost is undefined', () => {
            //define the name to avoid its error handling
            myBot.config.ircName = 'test';
            expect( () => {
                myBot._createClient();
            }).to.throw(Error);
        });
        it('should throw an error if config.ircName is undefined', () => {
            //define the host to avoid its error handling
            myBot.config.ircHost = 'test';
            expect( () => {
                myBot._createClient();
            }).to.throw(Error);
        });
        it('should create and store an IRC client internally', () => {
            //set required config
            myBot.config.ircHost = 'test';
            myBot.config.ircName = 'test';
            //stub the constuctor
            sinon.stub(myBot, '_getNewIrcClient', function (){
                return new IrcClient('','');
            });
            myBot._createClient();
            expect(myBot.irc instanceof IrcClient).to.be.true;
        });
        it('should pass irc client parameters to the client constructor', () => {
            //set required config
            myBot.config.ircHost = 'test';
            myBot.config.ircName = 'test';
            //set an additional parameter
            myBot.config.irc.client = {
                someParam: 'test'
            };
            sinon.stub(myBot, '_getNewIrcClient', function (){
                return new IrcClient('','');
            });
            //call the method
            myBot._createClient();
            expect(myBot._getNewIrcClient)
                .to.have.been
                .calledWith(myBot.config.ircHost, myBot.config.ircName, myBot.config.irc.client);
        });
    });
    describe('IRCBot._connectClient', () => {
        it('should use the stored client to connect to the preconfigured server', () => {
            myBot.irc = {
                connect: sinon.spy()
            };
            myBot._connectClient();
            expect(myBot.irc.connect).to.have.been.called;
        })
    });
});