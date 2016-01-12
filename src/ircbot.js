"use strict";
var extend = require('extend');

module.exports = class IRCBot {
    constructor(config){
        config = config || {};
        //eliminate reference issues
        this.config = extend(true, {}, config);
    };
    
    use () {
        
    };
    
    /*
    * Wrapper around the extend module for updating
    * the bot config to make it clear what is happening 
    * in plugins when they update the config. This also 
    * allows for a central place to add hooks into the 
    * config update process.
    */
    updateConfig (newConfig) {
        //throw an error if we got something like undefined or a primitive
        if( typeof newConfig !== 'object' ){
            throw new Error('IRCBot.updateConfig - newConfig was not an object.');
        }
        
        //update the internal config with the new properties
        this.config = extend(true, this.config, newConfig);
    };
    
    start () {
        
    };
    
    stop () {
        
    };
};