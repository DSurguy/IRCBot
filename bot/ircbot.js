"use strict";
var extend = require('extend');

module.exports = class IRCBot {
    constructor(config){
        //eliminate reference issues
        this.config = extend(true, {}, config);
        if( this.config.name === undefined ){
            throw new Error('IRCBot.Constructor: config.name is undefined');
        }
    };
    
    use(){
        
    };
};