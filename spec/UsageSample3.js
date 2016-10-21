var IRCBot = require('ircbot');

class MyPlugin{
    api;

    MyPlugin(register, deregister, api){
        this.api = api;
        register({
            type: 'passive',
            regex: /slap/g,
            handler: handler
        });
    }

    handler(msg){
        this.api.irc.say(msg.target, 'Test');
    }
};

var myBot = new IRCBot();
myBot.setupClient('us.quakenet.org', 'surgeBot', {
    autoConnect: false,
    channels: ['#surgeBotTest']
});

//shorthand for plugin
myBot.use('my-plugin', MyPlugin);

//long form
myBot.register({
    type: 'plugin',
    name: 'my-plugin',
    constructor: MyPlugin
});

myBot.api.irc.connect();