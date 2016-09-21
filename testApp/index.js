var IRCBot = require('../src/ircbot.js');

var myBot = new IRCBot('underworld1.no.quakenet.org', 'IRCBot', {
    channels: ['#surgeTest'],
    autoJoin: true
});

function TestPlugin(){
    console.log('Created new instance of TestPlugin');
};

myBot.use('TestPlugin', TestPlugin);

myBot.start()
.then(()=>{return myBot.join()})
.then(()=>{console.log('joined')})
.catch(console.error);