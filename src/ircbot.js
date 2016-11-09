var irc = require('irc'),
    extend = require('extend');

const PLUGIN_TYPE = {
    PASSIVE: 0,
    MIDDLEWARE: 1,
    COMMAND: 2
};

class IRCBot{
    /**
     * @constructor
     */
    constructor(){
        this._plugins = {};
        this._irc = undefined;
        this.api = {
            bot: this,
            plugins: this._plugins,
            irc: this._irc
        };
    }

    /**
     * Configure, create and store an instance of the irc plugin's client on the bot api. Standard bot event listeners are attached at this point as well.
     * @param {String} server hostname of the server to connect to (like us.quakenet.org)
     * @param {String} nick Nickname for the bot to use on the server
     * @param {Object} [config] Configuration object for the irc client: https://node-irc.readthedocs.io/en/latest/API.html#client 
     * @throws {Error} An error will be thrown if the irc Client has already been set up. Use teardownClient to disable and remove the existing client before setting up a new one
     */
    setupClient(server, nick, config){
        //check for existing client and complain
        if( this._irc instanceof irc.Client ){
            throw new Error('IRC client is already configured. The client must be destroyed before a new one can be created.');
        }
        //create a new client
        this._irc = new irc.Client(server, nick, config);
        //update api reference
        this.api.irc = this._irc;
    }

    /**
     * Attach a new instance of a plugin to the bot.
     * The plugin constructor will receive three arguments, a plugin-scoped register and deregister function, as well as the bot api.
     * @param {String} pluginName scoped plugin name, preferring the CamelCase->"camel-case" transformation of the classname
     * @param {Function|Class} pluginConstructor This should be a function, class or other "new"-able object.
     */
    use(pluginName, pluginConstructor){
        var scopeName = pluginName;
        var bot = this;
        this._plugins[pluginName] = new pluginConstructor(function(type, config){
            bot.register(type, config, scopeName);
        }, function (pluginId){
            bot.deregister(pluginId, scopeName);
        }, bot.api);
    }

    /** 
     * Convenience method for registering all types of message handlers, using the PLUGIN_TYPE enum to identify the handler type.
     * @param {Integer} pluginType Handler type, uses PLUGIN_TYPE enum to identify
     * @param {Object} config Configuration object to pass to registration function for specific handler type
     * @param {String} scope Plugin scope, if applicable
     * @throws {Error} Will throw an error if the plugin type provided is not valid. Currently, PASSIVE, MIDDLEWARE and COMMAND are supported.
     */
    register(pluginType, config, scope){
        switch(pluginType){
            case PLUGIN_TYPE.PASSIVE: this.registerPassive(config, scope); break;
            case PLUGIN_TYPE.MIDDLEWARE: this.registerMiddleware(config, scope); break;
            case PLUGIN_TYPE.COMMAND: this.registerCommand(config, scope); break;
            default: throw new Error(pluginType.toString()+' is not a valid plugin type. Use PLUGIN_TYPE enum for valid values.');
        }
    };
    registerPassive(config, scope){};
    registerMiddleware(config, scope){};
    registerCommand(config, scope){};

    /**
     * Remove a specific handler from the bot instance
     */
    deregister(pluginId, scope){}
}

class PassiveConfig{
    /**
     * @constructor
     */
    constructor(inConfig){
        let baseConfig = {
            //by default, execute on any string
            regex: new RegExp(),
            //by default, do nothing, this has to be overwritten for anything to happen!
            handler: function (){}
        };
        for( let prop in this ){
            if( baseConfig.hasOwnProperty(prop) && inConfig.hasOwnProperty(prop) ){
                baseConfig[prop] = inConfig[prop];
            }
        }

        extend(this, baseConfig);
    }

    get regex(){return this._regex;}
    set regex(val){this._regex = val;}

    get handler(){return this._handler;}
    set handler(val){this._handler = val;}
}

module.exports = {
    IRCBot: IRCBot,
    PLUGIN_TYPE: PLUGIN_TYPE,
    PassiveConfig: PassiveConfig
};