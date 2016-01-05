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
    doStuff();
};
MyService.prototype.doSomething = function (){};

//the bot knows this is a service because it has no execute
//it can be injected into other services, commands, passives
myBot.use('MyService', MyService);


/* Sample Plugin Creation */
function MyPlugin(bot, MyService){
    this.bot = bot;
    this.MyService = MyService;
    
    //create a scoped service
    bot.scope(this).use('SomeService', {
        doSomething: function (){}
    });
    
    //create a scoped command
    bot.scope(this).use('subCmd', function (bot, SomeService, MyService){
        this.bot = this.bot;
        this.SomeService = SomeService;
        this.MyService = this.MyService;
        
        //command handler
        this.execute = function (messageData, paramArr, paramObj){
            //run this on !botName plugin subCmd
            MyService.doSomething();
            SomeService.doSomething();
            this.bot.irc.say(messageData.from, "Test IRC Message");
        };
    }, [
        //use scoped service
        bot.scope(this).service('SomeService'),
        //use global service
        'MyService'
    ]);
};
//because this plugin has an execute, it can't be injected elsewhere
MyCommand.prototype.execute = function (messageData, paramArr, paramObj){
    //run this on !botName plugin
    this.bot.irc.say(messageData.from, "Use a sub command, or maybe not");
};

//use a plugin and inject MyService
myBot.use('plugin', MyPlugin, ['MyService']);

myBot.start();