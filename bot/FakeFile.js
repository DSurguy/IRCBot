function testFunc(config){
    if( config.test === undefined ){
        throw new Error("config.test was undefined");
    }
};
module.exports = testFunc;