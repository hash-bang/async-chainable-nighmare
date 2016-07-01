var asyncChainable = require('async-chainable');
var asyncChainableLog = require('async-chainable-log');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - timeout handling', function() {

	it('should timeout during a long wait operation', function(finish) {
		this.timeout(30 * 1000);
		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.log('Init')
			.nightmare({show: true, waitTimeout: 2 * 1000})
			.log('Nagivate')
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Waiting for non-existant `#blahblahblah`')
			.nightmareWait('#blahblahblah')
			.log('Typed - this should never happen!')
			.then(function(next) {
				return next('Somehow managed to type into non-existant component!');
			})
			.end(function(err) {
				expect(err).to.be.equal('NIGHTMARE-TIMEOUT');
				finish();
			});
	});

});
