var IRCBot = require('../src/ircbot.js');

var myBot = new IRCBot('us.quakenet.org', 'IRCBot', {
    channels: ['#wootTest'],
    autoJoin: true
});

function TestPlugin(){
    console.log('Created new instance of TestPlugin');
};

myBot.use('TestPlugin', TestPlugin);

console.log(myBot._plugins);
myBot.start();