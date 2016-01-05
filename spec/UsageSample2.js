var IRCBot = require('ircbot');

var myBot = new IRCBot({
    name: 'testBot',
    irc: {
        host: 'us.quakenet.org',
        channels: ['#mfdguild']
    }
});

/* Sample Global Service Creation */
function MyService(bot){
    this.bot = bot;

    //service runtime code
    //doStuff();
};
MyService.prototype.doSomething = function (){};

//the bot knows this is a service because it has no execute
//it can be injected into other services, commands, passives
myBot.use('MyService', MyService);


/* Sample Plugin Creation */
function MyPlugin(name, bot, InjectedServices){
    //name is passed in so that services or commands can be 
    //"scoped" to the plugin namespace
    this.name = name;
    this.bot = bot;
    this.MyService = InjectedServices.MyService;
    
    //create a "scoped" service using the plugin name
    //that was originally passed to bot.use
    bot.use(name+'SomeService', {
        doSomething: function (){}
    });
    
    //create a scoped command
    bot.scope(this).use('subCmd', function (name, bot, InjectedServices){
        this.name = name;
        this.bot = this.bot;
        this.SomeService = InjectedServices.SomeService;
        this.MyService = InjectedServices.MyService;
        
        //command handler
        this.execute = function (messageData, paramArr, paramObj){
            //run this on !botName plugin subCmd
            this.MyService.doSomething();
            this.SomeService.doSomething();
            this.bot.irc.say(messageData.from, "Test IRC Message");
        };
    }, [
        //use the "scoped" service
        name+'SomeService',
        'MyService'
    ]);
};
//because this plugin has an execute, it can't be injected elsewhere
MyPlugin.prototype.execute = function (messageData, paramArr, paramObj){
    //run this on !botName plugin
    this.bot.irc.say(messageData.from, "Use a sub command, or maybe not");
};

//use a plugin and inject MyService
myBot.use('plugin', MyPlugin, ['MyService']);

myBot.start();