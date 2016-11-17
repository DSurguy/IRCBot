var extend = require('extend'),
    Handler = require('../Handler.js');

class MessageHandler extends Handler {
    constructor(inConfig){
        super(inConfig);
        var inConfig = inConfig || {};
        //Regular expression to filter messages
        this.match = inConfig.match || new RegExp();
        //Function to execute on text match
        this.handler = inConfig.handler || function(){};
        //Check direct messages
        this.includeDirectMessages = (inConfig.includeDirectMessages !== undefined ? inConfig.includeDirectMessages : true);
        //restrict checking of channel messages to certain channels
        this.channels = inConfig.channels || undefined;
        //restrict to messages from specific nicks
        this.nicks = inConfig.nicks || undefined;
    }

    test(ircEventData, ircClient){
        //test against the list of filtered nicks if it exists
        if( this.nicks ){
            if( this.nicks.filter((n)=>{return n==ircEventData.nick;}).length == 0 ){
                return false;
            }
        }
        //test against the list of target channels if it exists
        if( this.channels ){
            if( this.channels.filter((t)=>{return t==ircEventData.to;}).length == 0 ){
                return false;
            }
        }
        //check if we are including direct messages
        if( to == ircClient.nick && !this.includeDirectMessages ){
            return false;
        }
        //finally, check the regex to see if the message matches
        this.match.lastIndex = 0; //reset it first.
        return this.match.test(ircEventData.text);
    }

    execute(ircEventData){
        this.handler(ircEventData);
    }

    boundEvents(){
        return ['message'];
    }
}

module.exports = MessageHandler;