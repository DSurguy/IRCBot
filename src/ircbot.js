var irc = require('irc');

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
        if( this._irc instanceof irc.Client ){
            throw new Error('IRC client is already configured. The client must be destroyed before a new one can be created.');
        }
        this._irc = new irc.Client(server, nick, config);
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
     * Attach a handler (passive/middleware/command) to the bot instance
     * This register function is similar to the one passed to plugins, but 
     * it is not scoped.
     */
    register(type, config, scope){}

    /**
     * Remove a specific handler from the bot instance
     */
    deregister(pluginId, scope){}

    _registerPlugin(){}
    _registerPassive(){}
    _registerMiddleware(){}
    _registerCommand(){}
}

module.exports = IRCBot;