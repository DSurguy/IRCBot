var extend = require('extend');

module.exports = class IRCBot {
    constructor(config){
        //eliminate reference issues
        this.config = extend(true, {}, config);
        if( this.config.name === undefined ){
            throw new Error('IRCBot.Constructor: config.name is undefined');
        }
        
        if( this.config.irc === undefined ){
            throw new Error('IRCBot.Constructor: config.irc is undefined');
        }
        
        if( this.config.irc.host === undefined ){
            throw new Error('IRCBot.Constructor: config.irc.host is undefined');
        }
    }
};