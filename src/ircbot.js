"use strict";
var extend = require('extend'),
    IrcClient = require('irc').Client;

module.exports = class IRCBot {
    constructor (host, name, config){
        if( host === undefined || host === '' ){
            throw new Error('IRCBot: Missing required parameter(0): \'host\'. Received: ('+params.join(',')+')');
        }
        if( name === undefined || name === '' ){
            throw new Error('IRCBot: Missing required parameter(1): \'name\'. Received: ('+params.join(',')+')');
        }
        this.ircHost = host;
        this.ircName = name;
        //eliminate reference issues
        this.config = extend(true, {
            channels: [],
            autoJoin: false,
            autoConnect: false
        }, config||{});
        //init plugins container
        this._plugins = {};
    }
    
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
    }
    
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
            throw new Error('IRCBot.updateConfig: newConfig was not an object.');
        }
        
        //update the internal config with the new properties
        this.config = extend(true, this.config, newConfig);
    }
    
    start () {
        this._createClient();
        this._connectToHost();
    }
    
    _createClient () {
        this.irc = this._getNewIrcClient(this.ircHost, this.ircName, this.config.ircClientParams||{
            autoConnect: false
        });
    }
    //istanbul ES6 class method ignore hack: https://github.com/gotwarlost/istanbul/issues/445
    _getNewIrcClient /* istanbul ignore next */ (host, name, params){
        //wrapper around client constructor to allow better coverage
        return new IrcClient(host, name, params);
    }
    
    _connectToHost () {
        return new Promise((resolve, reject) => {
            try{
                this.irc.connect(resolve);
            } catch (e){
                reject(e);
            }
        });
    }

    /* Async */
    join () {
        return new Promise((resolve, reject)=>{
            var allJoinPromises = [];
            for( var i=0; i<this.config.channels.length; i++ ){
                var index = i;
                allJoinPromises.push(new Promise((res,rej) => {
                    try{
                        this.irc.join(this.config.channels[index], res);
                    } catch (e){
                        rej(e);
                    }
                }))
            }
            Promise.all(allJoinPromises).then(resolve).catch(reject);
        });
    }

    stop () {
        
    }

};