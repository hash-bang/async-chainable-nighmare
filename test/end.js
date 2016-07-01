var asyncChainable = require('async-chainable');
var asyncChainableLog = require('async-chainable-log');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');

describe('async-chainable-nightmare - force .end() call', function() {
	it('should call .end()', function(finish) {
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
			.log('Force call to end()')
			.nightmareEnd()
			.log('Ended')
			.log('All done')
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(this.nightmare).to.not.be.ok;
				finish();
			});
	});
});
