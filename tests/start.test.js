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
        myBot = new IRCBot('host','name');
    });
    it('should call supporting methods', () => {
        //stub out the helper methods
        sinon.stub(myBot, '_createClient');
        sinon.stub(myBot, '_connectToHost');
        myBot.start();
        expect(myBot._createClient).to.have.been.called;
        expect(myBot._connectToHost).to.have.been.called;
        //no need to unstub the methods, the bot is recreated before each test
    });
    describe('IRCBot._createClient', () => {
        it('should throw any errors from client construction', () => {
            sinon.stub(myBot, '_getNewIrcClient').throws();
            expect( () => {
                myBot._createClient();
            }).to.throw(Error);
        });
        it('should create and store an IRC client internally', () => {
            //set required config
            myBot.ircHost = 'test';
            myBot.ircName = 'test';
            //stub the constuctor
            sinon.stub(myBot, '_getNewIrcClient', function (){
                return new IrcClient('','');
            });
            myBot._createClient();
            expect(myBot.irc instanceof IrcClient).to.be.true;
        });
        it('should pass irc client parameters to the client constructor', () => {
            //set required config
            myBot.ircHost = 'test';
            myBot.ircName = 'test';
            //set an additional parameter
            myBot.config.ircClientParams = {
                someParam: 'test'
            };
            sinon.stub(myBot, '_getNewIrcClient', function (){
                return new IrcClient('','');
            });
            //call the method
            myBot._createClient();
            expect(myBot._getNewIrcClient)
                .to.have.been
                .calledWith(myBot.ircHost, myBot.ircName, myBot.config.ircClientParams);
        });
    });
    describe('IRCBot._connectToHost', () => {
        beforeEach(()=>{
            myBot.irc = {connect: function(){}};
        })
        it('should return a promise', () => {
            sinon.stub(myBot.irc, 'connect');
            var returnValue = myBot._connectToHost();
            expect(typeof returnValue.then == 'function').to.be.true;
        });

        it('should resolve after connecting', (done) => {
            sinon.stub(myBot.irc, 'connect', function (cb){
                cb();
            });

            myBot._connectToHost().then(()=>{
                expect(myBot.irc.connect.called);
                done();
            });
        });

        it('should reject the promise if there was an error', (done) => {
            myBot.irc = {connect: function(){}};
            sinon.stub(myBot.irc, 'connect').throws();

            myBot._connectToHost().catch((err)=>{
                expect(err).to.be.defined;
                done();
            });
        });
    });
});