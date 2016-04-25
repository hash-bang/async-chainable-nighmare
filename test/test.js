var asyncChainable = require('async-chainable');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - basic test', function() {
	var evalResult;

	before(function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.then(function(cb) { mlog.log('Navigated'); cb() })
			.then(function(cb) { mlog.log('Typing into `input[name="q"]`'); cb() })
			.nightmareType('input[name="q"]', 'github async-chainable-nightmare')
			.then(function(cb) { mlog.log('Typed'); cb() })
			.then(function(cb) { mlog.log('Clicking `input[name="btnK"]'); cb() })
			.nightmareClick('input[name="btnK"]')
			.then(function(cb) { mlog.log('Clicked'); cb() })
			.then(function(cb) { mlog.log('Waiting for `.content`'); cb() })
			.nightmareWait('.content')
			.then(function(cb) { mlog.log('Main content area found'); cb() })
			.then(function(cb) { mlog.log('Evaluating `#resultStats`'); cb() })
			.nightmareEvaluate('result', function () {
				return document.querySelector('#resultStats').innerHTML;
			})
			.then(function(cb) { mlog.log('Evaluated'); cb() })
			.then(function(cb) { mlog.log('All done'); cb() })
			.end(function(err) {
				expect(err).to.be.not.ok;
				this.evalResult = this.result;
				console.log('Async-Chainable-NightMare ended with: ' + this.result);
				finish();
			});
	});

	it('should have completed with the correct result', function() {
		expect(evalResult).to.be.equal('foo');
	});
});

