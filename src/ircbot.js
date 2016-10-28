var irc = require('irc');

class IRCBot{
    /**
     * @constructor
     */
    constructor(){
        this._api = {
            _bot: this
        };
    }

    get api(){
        return this._api;
    }

    /**
     * This function configures, creates and stores an instance of the irc plugin's client on the bot api.
     * @param {String} server hostname of the server to connect to (like us.quakenet.org)
     * @param {String} nick Nickname for the bot to use on the server
     * @param {Object} [config] Configuration object for the irc client: https://node-irc.readthedocs.io/en/latest/API.html#client 
     * @returns {Promise}
     */
    setupClient(server, nick, config){
        this._api.irc = new irc.Client(server, nick, config);
    }

    /**
     * Attach an instance of a plugin to the bot instance
     */
    use(pluginName, pluginConstructor){}

    /** 
     * Attach a handler (passive/middleware/command) to the bot instance
     * This register function is similar to the one passed to plugins, but 
     * it is not scoped.
     */
    register(type, config){}

    /**
     * Remove a specific handler from the bot instance
     */
    deregister(id){}

    _registerPlugin(){}
    _registerPassive(){}
    _registerMiddleware(){}
    _registerCommand(){}
}

module.exports = IRCBot;