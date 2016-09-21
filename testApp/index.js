var IRCBot = require('../src/ircbot.js');

var myBot = new IRCBot('us.quakenet.org', 'IRCBot', {
    channels: ['#surgeTest'],
    autoJoin: true
});

function TestPlugin(){
    console.log('Created new instance of TestPlugin');
};

myBot.use('TestPlugin', TestPlugin);

myBot.start();

myBot.join().then(function (){
    console.log('joined');
}).catch(console.error);