var irc = require('irc'),
    extend = require('extend'),
    _handlers = require('./handlers/bundle.js');
    PluginContainer = require('./plugins/PluginContainer.js');

const PLUGIN_TYPE = {
    PASSIVE: 0,
    MIDDLEWARE: 1,
    COMMAND: 2
};

function getPluginType(plugin){
    let passive = [_handlers.MessageHandler],
        middleware = [],
        command = [];
    
    if( passive.filter((p)=>{return p==plugin.constructor}).length ){
        return 0;
    }

    if( middleware.filter((p)=>{return p==plugin.constructor}).length ){
        return 1;
    }

    if( command.filter((p)=>{return p==plugin.constructor}).length ){
        return 2;
    }
    return -1;
};

class IRCBot{
    /**
     * @constructor
     */
    constructor(){
        this._plugins = {
            nextId: 0
        };
        this._irc = undefined;
        this._api = {};
        this._registry = {};
    }
    
    get irc(){return this._irc;}
    set irc(val){}

    get api(){return this._api;}
    set api(val){}

    get plugins(){return this._plugins;}
    set plugins(val){}

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
        //create a new instance of the plugin with a scoped register and deregister function as constructor parameters
        this._plugins[pluginName] = new PluginContainer(new pluginConstructor(function(handler){
            bot.register(handler, scopeName);
        }, function (pluginId){
            bot.deregister(pluginId, scopeName);
        }, bot));
    }

    /**
     * Adds a handler to the IRC bot instance to handle irc events
     * @param {Handler} handler Handler that will bind to events emitted by the bot
     * @param {String} [scope] Plugin scope, if applicable
     */
    register(handler, scope){
        var events = handler.boundEvents(),
            eventFns = {};
        for( var i=0; i<events.length; i++ ){
            eventFns[events[i]] = function (){
                //convert the irc client event data into an object we can pass along
                var args = Array.prototype.slice.call(arguments);
                var ircData = {};
                for( var arg in args ){
                    ircData[arg] = args[arg];
                }
                //test if we should execute the handler or not, then do so
                if( handler.test(ircData, this) ){
                    handler.execute(ircData);
                }
            };
            this._irc.on(events[i], eventFns[events[i]]);
        }
        //store the handler
        if( scope ){
            var nextId = this._plugins[scope].nextId++;
            this._plugins[scope][nextId] = {
                handler: handler,
                events: eventFns
            };
        }
        else{
            var nextId = this._plugins.nextId++;
            this._plugins[nextId] = {
                handler: handler,
                events: eventFns
            };
        }
    };

    /**
     * Remove a specific handler from the bot instance
     */
    deregister(handlerId, scope){
        if( typeof handlerId !== 'number' ){
            throw new Error('handlerId should be an integer, got: '+handlerId)
        }
        if( scope && this._plugins[scope][handlerId] ){
            for( var evName in this._plugins[scope][handlerId].events ){
                this._irc.removeListener(evName, this._plugins[scope][handlerId].events[evName]);
            }
            this._plugins[scope][handlerId] = undefined;
            delete this._plugins[scope][handlerId];
        }
        else if( this._plugins[handlerId] ){
            for( var evName in this._plugins[handlerId].events ){
                this._irc.removeListener(evName, this._plugins[handlerId].events[evName]);
            }
            this._plugins[handlerId] = undefined;
            delete this._plugins[handlerId];
        }
    }
}

//just add the IRCBot to the handlers object to get our export object
_handlers.IRCBot = IRCBot;
module.exports = _handlers;