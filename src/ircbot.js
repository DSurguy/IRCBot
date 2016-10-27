class IRCBot{
    api;
    /**
     * @constructor
     */
    IRCBot(){}

    /**
     * This function configures, creates and stores an instance of the irc plugin's client on the bot api.
     * @param {String} server hostname of the server to connect to (like us.quakenet.org)
     * @param {String} nick Nickname for the bot to use on the server
     * @param {Object} [config] Configuration object for the irc client: https://node-irc.readthedocs.io/en/latest/API.html#client 
     */
    setupClient(server, nick, config){}

    //shorthand for register
    use(pluginName, pluginConstructor){}

    //add plugins
    register(type, config){}
    
    //remove plugins
    deregister(){}
}

module.exports = IRCBot;