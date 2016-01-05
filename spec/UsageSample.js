var myBot = new Bot({
	name: 'testName',
	irc: {
		host: 'us.quakenet.org',
		channels: ['test','test']
	}
});

/* Ultra-Simple command */
myBot.use('testCmd', {execute: function(messageData, Actions, Services){
	Actions.say("Test Message");
}});

/* Simple command */
function MyCommand(){};
MyCommand.prototype.execute = function (messageData, Actions, Services){
	Actions.say("Test Message");
};

myBot.use(['cmd', 'command'], new MyCommand({
	someConfigParam: 'testString'
}));

/* Complex Command */
function MyComplexCommand(){};
MyComplexCommand.prototype.prepare = function (use){
	use('SubCmd1', {
		execute: function (messageData, Actions, Services){
			Actions.say("Test Message");
		}
	});

	use('SubCmd2', {
		execute: function (messageData, Actions, Services){
			Actions.say("Test Message");
		}
	});

	//sub sub
	use('SubNamespace', {
		prepare: function (){
			//...etc
		}
	});
};

myBot.use('CmdNamespace', new MyComplexCommand());

/* Ultra-Simple Passive  w/regex */
myBot.use({
	filter: /testRegex/g,
	execute: function (messageData, Actions, Services){
		Actions.say("Test Message");
	}
});

/* Ultra-Simple Passive  w/func */
myBot.use({
	filter: function (messageData){
		return true;
	},
	execute: function (messageData, Actions, Services){
		Actions.say("Test Message");
	}
});

/* Simple Passive w/regex */
function MyPassive(){
	this.filter = /testRegex/g;
};
MyPassive.prototype.execute = function (messageData, Actions, Services){
	Actions.say("Test Message");
};

myBot.use(new MyPassive({
	someConfigParam: 'test'
}));

/* Simple Passive w/function */
function MyPassive(){};
MyPassive.prototype.filter = function (messageData){
	return true;
};
MyPassive.prototype.execute = function (messageData, Actions, Services){
	Actions.say("Test Message");
};

myBot.use(new MyPassive({
	someConfigParam: 'test'
}));

/* Complex Passive w/function */
function MyComplexPassive(){};
MyComplexPassive.prototype.prepare = function (use){
	use({
		filter: /testRegex/g,
		execute: function (messageData, Actions, Services){
			Actions.say("Test Message");
		}
	});

	use({
		filter: /testRegex2/g,
		execute: function (messageData, Actions, Services){
			Actions.say("Test Message");
		}
	});
}

myBot.use(new MyComplexPassive({
	someConfigParam: 'test'
}))

/* Simple Service */
myBot.useService({
	prepare: function (botConfig, Actions, Events){
		this.Actions = Actions;
		this.Events = Events;
	},
	execute: function (){
		//Executed when registered to bot
		this.Events.on("SomeEvent", function (e){
			//handle the event!
		});
	},
	exposedMethod: function (methodParam1, methodParam2){
		//dostuff
	}
});

/* Complex Full Plugin */
function MyPlugin(){}
MyPlugin.prototype.prepare = function (use, useService){
	/* Register Complex Command */
	use('commandNamespace', {
		prepare: function (use){
			use('SubCmd', {execute: function(messageData, Actions, Services){
				Actions.say('test message');
			}});
		}
	});

	/* Register Passives */
	use({
		filter: /regex/g,
		execute: function (messageData, Actions, Services){
			Actions.say('test message');
		}
	});

	use({
		filter: /regexSecond/g,
		execute: function (messageData, Actions, Services){
			Actions.say('test message');
		}
	});

	/* Register Services */
	useService({
		prepare: function (botConfig, Actions, Events){
			this.Actions = Actions;
			this.Events = Events;
		},
		execute: function (){
			//Executed when registered to bot
			this.Events.on("SomeEvent", function (e){
				//handle the event!
			});
		},
		exposedMethod: function (methodParam1, methodParam2){
			//dostuff
		}
	});
};

myBot.start();