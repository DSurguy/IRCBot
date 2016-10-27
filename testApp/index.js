var IRCBot = require('../src/ircbot.js');

class MyPlugin{
    api;
    register;
    deregister;

    MyPlugin(register, deregister, api){
        this.api = api;
        this.register = register;
        this.deregister = deregister;

        register('passive', {
            regex: /slap/g,
            handler: handler
        });
    }

    handler(msg){
        this.api.irc.say(msg.target, '/me gets slapped by a large tuna.');
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
myBot.register('plugin', {
    name: 'my-plugin',
    constructor: MyPlugin
});

myBot.api.irc.connect();