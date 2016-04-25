var asyncChainable = require('async-chainable');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;

describe('async-chainable-nightmare - basic test', function() {
	var evalResult;

	before(function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.nightmareType('input[name="q"]', 'github async-chainable-nightmare')
			.nightmareClick('input[name="btnK"]')
			.nightmareWait('.content')
			.nightmareEvaluate('result', function () {
				return document.querySelector('#resultStats').href
			})
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

