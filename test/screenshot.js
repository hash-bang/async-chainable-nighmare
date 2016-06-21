var asyncChainable = require('async-chainable');
var asyncChainableLog = require('async-chainable-log');
var asyncChainableNightmare = require('..');
var expect = require('chai').expect;
var fs = require('fs');
var mlog = require('mocha-logger');
var temp = require('temp');

describe('async-chainable-nightmare - screenshots (image)', function() {
	it('should take a screenshot', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.png'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Taking screenshot -> ' + ssPath)
			.nightmareScreenshot(ssPath)
			.log('Screenshot taken')
			.log('All done')
			.nightmareEnd()
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(fs.statSync(ssPath).isFile()).to.be.true;
				finish();
			});
	});

	it('should return a screenshot buffer', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.png'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Taking screenshot -> BUFFER')
			.nightmareScreenshot()
			.log('Screenshot taken')
			.log('All done')
			.nightmareEnd()
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(this.screenshot).to.be.instanceOf(Buffer);
				finish();
			});
	});
});


describe('async-chainable-nightmare - screenshots (pdf)', function() {
	it('should take a screenshot', function(finish) {
		this.timeout(30 * 1000);
		var ssPath = temp.path({suffix: '.png'});

		asyncChainable()
			.use(asyncChainableNightmare)
			.use(asyncChainableLog)
			.logDefaults(mlog.log)
			.nightmare({show: true})
			.nightmareGoto('http://google.com')
			.log('Navigated')
			.log('Taking screenshot -> ' + ssPath)
			.nightmarePdf(ssPath)
			.log('Screenshot taken')
			.log('All done')
			.nightmareEnd()
			.end(function(err) {
				expect(err).to.be.not.ok;
				expect(fs.statSync(ssPath).isFile()).to.be.true;
				finish();
			});
	});
});
