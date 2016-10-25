var argy = require('argy');
var debug = require('debug')('async-chainable-nightmare');
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
		var chain = this;

		argy(arguments)
			.ifForm('', function() {
				chain._struct.push({type: 'nightmareNightmare'});
			})
			.ifForm('object', function(settings) {
				chain._struct.push({
					type: 'nightmareNightmare',
					options: settings,
				});
			})
			.ifFormElse(function(form) {
				throw new Error('Unknown async-chainable-nightmare#nightmare() style: ' + form);
			});

		return this;
	},

	// Setup end call to correctly terminate Nightmare instance
	this.hook('end', function(next) {
		var self = this;
		if (this._context.nightmare) { // Not correctly terminated
			debug('WARNING: Killing orphaned Nightmare process - .end() called before .endNightmare()');
			q.resolve(this._context.nightmare.end())
				.then(function() {
					delete self._context.nightmare;
					debug('Nightmare process destructed');
					next();
				}, next); // Termination errors get passed to next anyway
		} else { // Ended Nightmare correctly anyway
			next();
		}
	});
	// }}}

	// nightmareClick() {{{
	this._plugins['nightmareClick'] = function(params) {
		var self = this;
		self._context.nightmare.click(params.selector).then(function() {
			self._execute();
		}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareClick = argy('string', function(selector) {
		this._struct.push({
			type: 'nightmareClick',
			selector: selector,
		});

		return this;
	});
	// }}}

	// nightmareEnd() {{{
	this._plugins['nightmareEnd'] = function(params) {
		var self = this;
		q.resolve(self._context.nightmare.end())
			.then(function() {
				debug('Nightmare process destructed');
				delete self._context.nightmare;
				self._execute();
			}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmareEnd = function() {
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
		var chain = this;

		argy(arguments)
			.ifForm('', function() {})
			.ifForm('string', function(key) {
				throw new Error('Cannot pass just a key into async-chainable-nightmare#nightmareEvaluate. Require at least a function to run');
			})
			.ifForm('string function', function(key, func) {
				chain._struct.push({
					type: 'nightmareEvaluate',
					key: key,
					callback: func,
				});
			})
			.ifForm('function', function(func) {
				chain._struct.push({
					type: 'nightmareEvaluate',
					callback: func,
				});
			})
			.ifFormElse(function(form) {
				throw new Error('Unknown async-chainable-nightmare#nightmareEvaluate() style: ' + form);
			});

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

	this.nightmareGoto = argy('string', function(url) {
		this._struct.push({
			type: 'nightmareGoto',
			url: url,
		});

		return this;
	});
	// }}}

	// nightmareOn() {{{
	this._plugins['nightmareOn'] = function(params) {
		var self = this;
		self._context.nightmare.on(params.binding, params.callback);
		self._execute();
	};

	this.nightmareOn = function(url) {
		var chain = this;

		argy(arguments)
			.ifForm('', function() {})
			.ifForm('string', function(hook) {
				throw new Error('Cannot pass just an event into async-chainable-nightmare#nightmareOn. Require at least a string and a function to run');
			})
			.ifForm('string function', function(hook, callback) {
				chain._struct.push({
					type: 'nightmareOn',
					binding: hook,
					callback: callback,
				});
			})
			.ifFormElse(function(form) {
				throw new Error('Unknown async-chainable-nightmare#nightmareOn() style: ' + form);
			});

		return this;
	};
	// }}}

	// nightmarePdf() {{{
	this._plugins['nightmarePdf'] = function(params) {
		var self = this;
		q.resolve(self._context.nightmare.pdf(params.path, params.options))
			.then(function() {
				self._execute();
			}, self._execute); // Errors get passed to self._execute()
	};

	this.nightmarePdf = argy('string [object]', function(path, options) {
		this._struct.push({
			type: 'nightmarePdf',
			path: path,
			options: options,
		});

		return this;
	});

	this.nightmarePDF = this.nightmarePdf; // Common misspelling
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
		var chain = this;

		argy(arguments)
			.ifForm('', function() { // Return a buffer
				chain._struct.push({
					type: 'nightmareScreenshot',
					toBuffer: true,
				});
			})
			.ifForm('string', function(path) { // Save to a file
				chain._struct.push({
					type: 'nightmareScreenshot',
					path: path,
				});
			})
			.ifFormElse(function(form) {
				throw new Error('Unknown async-chainable-nightmare#nightmareScreenshot() style: ' + form);
			});

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
				if (/^Cannot read property '(blur|focus)' of null$/.test(err)) return self._execute();
				self._execute(err);
			});
	};

	this.nightmareType = argy('string string', function(selector, text) {
		this._struct.push({
			type: 'nightmareType',
			selector: selector,
			text: text,
		});

		return this;
	});
	// }}}

	// nightmareWait() {{{
	this._plugins['nightmareWait'] = function(params) {
		var self = this;
		self._context.nightmare.wait(params.selector).then(function() {
			self._execute();
		}, self._execute) // Errors get passed to self._execute()
		.catch(function(err) {
			if (err && err.toString() == 'TypeError: this._finalize is not a function') return self._execute('NIGHTMARE-TIMEOUT');
			self._execute(err || 'NIGHTMARE-ERROR');
		});
	};

	this.nightmareWait = argy('string', function(selector) {
		this._struct.push({
			type: 'nightmareWait',
			selector: selector,
		});

		return this;
	});
	// }}}
};
