var expect = require('chai').expect;
var IRCBot = require('../src/ircbot.js'),
    sinon = require('sinon');

describe('IRCBot.join', () => {
    var myBot;
    beforeEach(() => {
        myBot = new IRCBot('host','name');
        //stub out relevant irc client methods
        myBot.irc = {
            join: function (){}
        };
    });

    it('should return a promise and resolve', (done) => {
        sinon.stub(myBot.irc, 'join', function (channel, cb){
            cb();
        });
        var returnValue = myBot.join();

        expect(typeof returnValue.then == 'function').to.be.true;

        returnValue.then(()=>{
            expect(1);
            done();
        })
    })

    it('should do nothing if no channels are defined', (done) => {
        sinon.stub(myBot.irc, 'join', function (channel, cb){
            cb();
        });
        myBot.join().then(()=>{
            expect(myBot.irc.join).to.not.have.been.called;
            done();
        });
    });
    
    it('should fire a join once for each channel in config', (done) => {
        sinon.stub(myBot.irc, 'join', function (channel, cb){
            cb();
        });
        myBot.config.channels = ['#test', '#otherTest'];
        myBot.join().then(()=>{
            expect(myBot.irc.join.calledWith('#test'));
            expect(myBot.irc.join.calledWith('#otherTest'));
            done();
        });
    });

    it('should reject the promise if any of the joins fail', (done) => {
        sinon.stub(myBot.irc, 'join').throws();

        myBot.config.channels = ['#test'];

        myBot.join().catch((err)=>{
            expect(err).to.be.defined;
            done();
        });
    });
});