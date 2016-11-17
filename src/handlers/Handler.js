//Base handler interface. Should not be used in production.
class Handler{
    constructor(){}
    //function that runs tests against the incoming event and the bot to see if it should execute logic
    test(ircEventData, botData){ return true; }
    //perform any logic on the event data that the plugin defines
    execute(){}
    //return an array of event names to bind on
    boundEvents(){return [];}
}

module.exports = Handler;