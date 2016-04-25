var nightmare = require('nightmare');

module.exports = function() {
	// nightmare() {{{
	this._plugins['nightmareNightmare'] = function(params) {
		var self = this;
		self._context.nightmare = nightmare(params.options);
		self._execute();
	};

	this.nightmare = function(options) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != '' && calledAs != 'object') throw new Error('Unknown async-chainable-nightmare#nightmare() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareNightmare',
			options: arguments[0],
		});

		return this;
	},
	// }}}

	// nightmareClick() {{{
	this._plugins['nightmareClick'] = function(params) {
		var self = this;
		self._context.nightmare.click(params.selector).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareClick = function(selector) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string') throw new Error('Unknown async-chainable-nightmare#nightmareClick() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareClick',
			selector: arguments[0],
		});

		return this;
	};
	// }}}

	// nightmareEvaluate() {{{
	this._plugins['nightmareEvaluate'] = function() {
		var self = this;
		var result = self._context.nightmare.evaluate(params.callback);
		if (params.key) self[params.key] = result;
		self._execute();
	};

	this.nightmareEvaluate = function() {
		var calledAs = this._getOverload(arguments);

		switch (calledAs) {
			case '':
				// Pass
				break;
			case 'string':
				throw new Error('Cannot pass just a key into async-chainable-nightmare#nightmareEvaluate. Require at least a function to run');
				break;
			case 'string,function':
				this._struct.push({
					type: 'nightmareClick',
					key: arguments[0],
					callback: arguments[1],
				});
				break;
			case 'function':
				this._struct.push({
					type: 'nightmareClick',
					callback: arguments[0],
				});
				break;
			default:
				throw new Error('Unknown async-chainable-nightmare#nightmareEvaluate() style: ' + calledAs);
		}

		return this;
	};
	// }}}

	// nightmareGoto() {{{
	this._plugins['nightmareGoto'] = function(params) {
		var self = this;
		self._context.nightmare.goto(params.url).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareGoto = function(url) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string') throw new Error('Unknown async-chainable-nightmare#nightmareGoto() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareGoto',
			url: arguments[0],
		});

		return this;
	};
	// }}}

	// nightmareScreenshot() {{{
	this._plugins['nightmareScreenshot'] = function(params) {
		var self = this;
		self._context.nightmare.screenshot(params.path).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareScreenshot = function(path) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string') throw new Error('Unknown async-chainable-nightmare#nightmareScreenshot() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareScreenshot',
			path: arguments[0],
		});

		return this;
	};
	// }}}

	// nightmareType() {{{
	this._plugins['nightmareType'] = function(params) {
		var self = this;
		self._context.nightmare.type(params.selector, params.text).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareType = function(selector, text) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string,string') throw new Error('Unknown async-chainable-nightmare#nightmareType() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareType',
			path: arguments[0],
			text: arguments[1],
		});

		return this;
	};
	// }}}

	// nightmareWait() {{{
	this._plugins['nightmare.wait'] = function(params) {
		var self = this;
		self._context.wait.wait(params.selector).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareWait = function(selector) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string') throw new Error('Unknown async-chainable-nightmare#nightmareSelector() style: ' + calledAs);

		this._struct.push({
			type: 'nightmare.selector',
			selector: arguments[0],
		});

		return this;
	};
	// }}}
};
