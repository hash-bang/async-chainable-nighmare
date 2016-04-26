var asyncChainable = require('async-chainable');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');
var temp = require('temp');

describe('async-chainable-nightmare - screenshots', function() {
	it('should take a screenshot', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.png'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.then(function(cb) { mlog.log('Navigated'); cb() })
			.then(function(cb) { mlog.log('Taking screenshot -> ' + ssPath); cb() })
			.nightmareScreenshot(ssPath)
			.then(function(cb) { mlog.log('Screenshot taken'); cb() })
			.then(function(cb) { mlog.log('All done'); cb() })
			.end(function(err) {
				expect(err).to.be.not.ok;
				evalResult = this.result;
				finish();
			});
	});

	it.only('should return a screenshot buffer', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.png'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.then(function(cb) { mlog.log('Navigated'); cb() })
			.then(function(cb) { mlog.log('Taking screenshot -> BUFFER'); cb() })
			.nightmareScreenshot()
			.then(function(cb) { mlog.log('Screenshot taken'); cb() })
			.then(function(cb) { mlog.log('All done'); cb() })
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(this.screenshot).to.be.instanceOf(Buffer);
				finish();
			});
	});
});
