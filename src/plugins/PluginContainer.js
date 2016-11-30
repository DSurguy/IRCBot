module.exports = class PluginContainer{
    constructor(plugin){
        this._plugin = plugin;
        this.nextId = 0;
    }

    get plugin(){return this._plugin}
    set plugin(val){}
}