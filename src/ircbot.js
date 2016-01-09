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
    
    updateConfig () {
        
    };
    
    start () {
        
    };
    
    stop () {
        
    };
};