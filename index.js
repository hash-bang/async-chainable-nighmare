var nightmare = require('nightmare');
var q = require('q');

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

	// nightmareEnd() {{{
	this._plugins['nightmareEnd'] = function(params) {
		var self = this;
		q.resolve(self._context.nightmare.end())
			.then(function() {
				delete self._context.nightmare;
				self._execute();
			}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareEnd = function(selector) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != '') throw new Error('Unknown async-chainable-nightmare#nightmareClick() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareEnd',
		});

		return this;
	};
	// }}}

	// nightmareEvaluate() {{{
	this._plugins['nightmareEvaluate'] = function(params) {
		var self = this;
		q.resolve(self._context.nightmare.evaluate(params.callback))
			.then(function(res) {
				if (params.key) self._context[params.key] = res;
				self._execute();
			}, function(err) {
				self._execute(err);
			});
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
					type: 'nightmareEvaluate',
					key: arguments[0],
					callback: arguments[1],
				});
				break;
			case 'function':
				this._struct.push({
					type: 'nightmareEvaluate',
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
		q.resolve(self._context.nightmare.screenshot(params.path))
			.then(function(res) {
				if (params.toBuffer) self._context.screenshot = res;
				self._execute();
			}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareScreenshot = function(path) {
		var calledAs = this._getOverload(arguments);

		switch(calledAs) {
			case '': // Return a buffer
				this._struct.push({
					type: 'nightmareScreenshot',
					toBuffer: true,
				});
				break;
			case 'string': // Save to a file
				this._struct.push({
					type: 'nightmareScreenshot',
					path: arguments[0],
				});
				break;
			default:
				throw new Error('Unknown async-chainable-nightmare#nightmareScreenshot() style: ' + calledAs);
		}

		return this;
	};
	// }}}

	// nightmareType() {{{
	this._plugins['nightmareType'] = function(params) {
		var self = this;

		q.resolve(self._context.nightmare.type(params.selector, params.text))
			.then(function(res) {
				self._execute();
			}, function(err) {
				// Ignore weird errors we get back from Nightmare
				if (err == "Cannot read property 'blur' of null") return self._execute();
				self._execute(err);
			});
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
	this._plugins['nightmareWait'] = function(params) {
		var self = this;
		self._context.nightmare.wait(params.selector).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareWait = function(selector) {
		var calledAs = this._getOverload(arguments);
		if (calledAs != 'string') throw new Error('Unknown async-chainable-nightmare#nightmareSelector() style: ' + calledAs);

		this._struct.push({
			type: 'nightmareWait',
			selector: arguments[0],
		});

		return this;
	};
	// }}}
};
