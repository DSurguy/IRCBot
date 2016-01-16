"use strict";
var extend = require('extend');

module.exports = class IRCBot {
    constructor(config){
        config = config || {};
        //eliminate reference issues
        this.config = extend(true, {}, config);
        //init plugins container
        this._plugins = {};
    };
    
    use (pluginName, PluginConstructor, injectedServices) {
        //check for valid parameters
        if( typeof pluginName != 'string' ){
            throw new Error('IRCBot.use: pluginName was not a string, received '+(typeof pluginName));
        }
        if( typeof PluginConstructor != 'function' ){
            throw new Error('IRCBot.use: PluginConstructor was not a constructor function, received '+(typeof PluginConstructor));
        }
        //check to see if the plugin is already registered
        if( this._plugins[pluginName] ){
            throw new Error('IRCBot.use: Plugin \''+pluginName+'\' is already registered.');
        }
        //see if we should initialize the injectedServices array
        injectedServices = injectedServices || [];
        
        //create the constructor arguments as an array for apply
        var pluginArguments = [this].concat(injectedServices.map((val) => {
            //arrow function allows this to still be the bot instance. Hooray!
            if( !this._plugins[val] ){
                throw new Error('IRCBot.use: Plugin \''+val+'\' was injected before it was registered on the bot.');
            }
            return this._plugins[val];
        }));
        
        //add a new instance of this plugin under the correct name
        this._plugins[pluginName] = new (PluginConstructor.bind.apply(PluginConstructor, [PluginConstructor].concat(pluginArguments)));
        //if the environment supported node 5.x.x, we could use the spread operator :(
        /*this._plugins[pluginName] = new PluginConstructor(this, ...injectedServices.map((val) => {
            return this._plugins[val];
        }))*/
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