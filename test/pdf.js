var asyncChainable = require('async-chainable');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var mlog = require('mocha-logger');
var temp = require('temp');

describe('async-chainable-nightmare - PDFs', function() {
	it('should create a PDF', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.pdf'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.then(function(cb) { mlog.log('Navigated'); cb() })
			.then(function(cb) { mlog.log('Taking PDF screenshot -> ' + ssPath); cb() })
			.nightmarePdf(ssPath)
			.then(function(cb) { mlog.log('Screenshot taken'); cb() })
			.then(function(cb) { mlog.log('All done'); cb() })
			.end(function(err) {
				expect(err).to.be.not.ok;
				evalResult = this.result;
				finish();
			});
	});
});
