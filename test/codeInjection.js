var asyncChainable = require('async-chainable');
var asyncChainableLog = require('async-chainable-log');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - action test', function() {
	it('should be able to inject code into a page and run it', function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.log('Init')
			.nightmare({show: true})
			.log('Nagivate')
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Injecting code into search box via action')
			.then('title', function(next) {
				this.nightmare.evaluate_now(function() {
					return document.title;
				}, next);
			})
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(this.title).to.match(/Google/);
				finish();
			});
	});
});
