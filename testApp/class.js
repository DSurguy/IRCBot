class testClass{
    constructor(){
        this._priv = '123';
    }

    get priv(){
        return this._priv;
    }
    set priv(val){}

    updatePriv(val){
        this._priv = val;
    }
}

var me = new testClass();
console.log(me.priv);
me.priv = '321';
console.log(me.priv);
me.updatePriv('555');
console.log(me.priv);