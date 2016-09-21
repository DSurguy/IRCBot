var IRCBot = require('../src/ircbot.js');

var myBot = new IRCBot({
    ircHost: 'us.quakenet.org',
    ircName: 'IRCBot'
});

function TestPlugin(){
    console.log('Created new instance of TestPlugin');
};

myBot.use('TestPlugin', TestPlugin);

console.log(myBot._plugins);
myBot.start();