var asyncChainable = require('async-chainable');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - console event test', function() {
	var consoleOutput = [];

	before(function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareOn('console', function() {
				var args = Array.prototype.slice.call(arguments, 0);
				consoleOutput.push(args);
			})
			.nightmareGoto('http://facebook.com')
			.end(function(err) {
				expect(err).to.be.not.ok;
				evalResult = this.result;
				finish();
			});
	});

	it('should have detected some console output', function() {
		expect(consoleOutput).to.have.length.above(0);
	});
});
