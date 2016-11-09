const {IRCBot, PLUGIN_TYPE, PassiveConfig} = require('ircbot');

/**
 * A sample plugin that does the following
 *  1. Register a passive handler that looks for the word 'slap'
 *  2. When the handler is triggered, increment a counter and emote a silly tuna slap message
 *  3. When the trigger count exceeds 5, "die", emoting a new message and removing the handler permanently
 */
class FishSlap{
    constructor(register, deregister, api){
        this.api = api;
        this.register = register;
        this.deregister = deregister;

        this.regs = [];
        this.count = 0;

        this.init();
    }

    init(){
        //store the handler ID to unregister it later
        this.regs.push(this.register(PLUGIN_TYPE.PASSIVE, new PassiveConfig({
            regex: /slap/g,
            handler: this.handler
        })));
    }

    handler(msg){
        if( this.count > 4 ){
            this.api.irc.say(msg.target, '/me gets slapped by a large tuna.');
            this.api.irc.say(msg.target, '/me succumbs to death by tuna.')
            this.deregister(this.regs[0]);
        }
        else{
            this.api.irc.say(msg.target, '/me gets slapped by a large tuna.');
            this.count++;
        }
    }
};

var myBot = new IRCBot();
myBot.setupClient('us.quakenet.org', 'surgeBot', {
    autoConnect: false,
    channels: ['#surgeBotTest']
});

//Attach plugin, which attaches a passive handler
myBot.use('fish-slap', FishSlap);

myBot.api.irc.connect();