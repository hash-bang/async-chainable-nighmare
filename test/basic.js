var asyncChainable = require('async-chainable');
var asyncChainableLog = require('async-chainable-log');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - basic test', function() {
	var evalResult;

	before(function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Typing into `input[name="q"]`')
			.nightmareType('input[name="q"]', 'github async-chainable-nightmare')
			.log('Typed')
			.log('Clicking `input[name="btnK"]')
			.nightmareClick('input[name="btnK"]')
			.log('Clicked')
			.log('Waiting for `#resultStats`')
			.nightmareWait('#resultStats')
			.log('Main content area found')
			.log('Evaluating `#resultStats`')
			.nightmareEvaluate('result', function () {
				return document.querySelector('#resultStats').innerHTML;
			})
			.log('Evaluated')
			.log('All done')
			.end(function(err) {
				expect(err).to.be.not.ok;
				evalResult = this.result;
				finish();
			});
	});

	it('should have completed with the correct result', function() {
		expect(evalResult).to.match(/^About [0-9,]+ results/);
	});
});
