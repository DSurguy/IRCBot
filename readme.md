#### Sample Usage
This document serves as a loose spec for the implementation of the IRCBot 
functionality, and demonstrates how it might be used. [Document](https://github.com/DSurguy/IRCBot/blob/master/spec/UsageSample2.js)

#### Hacks / Bugs
This is a list of bugs that we are waiting on to be resolved so that we 
can use them to improve the project code/testing/development. If a 
hack/workaround is being used, it will also be listed.

 - ES6 class method hack for istanbul ignore next: [github issue](https://github.com/gotwarlost/istanbul/issues/445)
 - mocha.opts not supported outside 'test' dir: [github issue](https://github.com/mochajs/mocha/issues/451)

#### Docs
This is a list of documentation, apis, sample usage and etc for the technologies 
used for development of IRCBot.
##### Testing  
[mocha](https://mochajs.org "Mocha Docs") - Test Runner  
[chai (expect)](http://chaijs.com/api/bdd/ "Chai Docs") - Expectation Library  
[sinon-chai](http://chaijs.com/plugins/sinon-chai "Sinon-Chai Docs") - Helper to connect sinon with chai expect  
[sinon](http://sinonjs.org/docs/ "Sinon Docs") - Spies, Mocks, Stubs  
[istanbul](https://github.com/gotwarlost/istanbul "Istanbul Docs") - Code Coverage

##### Production Deps
[node-irc](https://node-irc.readthedocs.org/en/latest/index.html "Node-irc Docs") - irc client  
[extend](https://github.com/justmoon/node-extend/ "Extend Docs") - object cloning/extension

##### Node ES6 Syntax
[Node-Supported ES6 Features](https://nodejs.org/en/docs/es6/)