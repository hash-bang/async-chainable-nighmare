async-chainable-nightmare
=========================
Plugin for [async-chainable](https://github.com/hash-bang/async-chainable) that wraps [Nightmare](https://github.com/segmentio/nightmare#readme)


This plugin patches many of the somewhat odd behaviours of the Nightmare module including:

* All async calls that need to be wrapped in Promises (e.g. `resolve`, `type` etc.) are done so automatically
* Some inconsiquential error messages that would otherwise abort the sequence chain are ignoerd (e.g. typing into an input box that doesn't raise the `blur` event)


	var asyncChainable = require('async-chainable');
	var asyncChainableNightmare = require('async-chainable-nightmare');

	asyncChainable()
		.use(asyncChainableNightmare)
		.nightmare({show: true})

		.nightmareOn('console', function() {
			var args = Array.prototype.slice.call(arguments, 0);
			console.log('Page Console>', args);
		})

		.nightmareGoto('http://google.com')
		.then(function(cb) { console.log('Navigated'); cb() })

		.then(function(cb) { console.log('Typing into `input[name="q"]`'); cb() })
		.nightmareType('input[name="q"]', 'github async-chainable-nightmare')
		.then(function(cb) { console.log('Typed'); cb() })

		.then(function(cb) { console.log('Clicking `input[name="btnK"]'); cb() })
		.nightmareClick('input[name="btnK"]')
		.then(function(cb) { console.log('Clicked'); cb() })

		.then(function(cb) { console.log('Waiting for `.content`'); cb() })
		.nightmareWait('.content')
		.then(function(cb) { console.log('Main content area found'); cb() })

		.then(function(cb) { console.log('Evaluating `#resultStats`'); cb() })
		.nightmareEvaluate('result', function () {
			return document.querySelector('#resultStats').innerHTML;
		})
		.then(function(cb) { console.log('Evaluated'); cb() })

		.then(function(cb) { console.log('All done'); cb() })
		.end();


API
===
The async-chainable-nightmare API follows the specification of the main [Nightmare](https://github.com/segmentio/nightmare#readme). The Nightmare instance must be first initialized by a call to `nightmare([options])` followed by subsequent calls to any `nightmare` prefixed function.

async-chainable-nightmare provides the following functions:

| Function                             | Description                                                                                                                     |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `nightmare([options])`               | Initialize a Nightmare instance and store it as `nightmare` in the async-chainable context                                      |
| `nightmareClick(selector)`           | Simulate a mouse click event on a given selector                                                                                |
| `nightmareEvaluate([key], function)` | Execute the given function within the context of the page and, optionally, store the result in the named key within the context |
| `nightmareGoto(url)`                 | Navigate the Nightmare instance to the given URL                                                                                |
| `nightmareOn(event, function)`       | Bind to a Nightmare event                                                                                                       |
| `nightmarePdf(path, [options])`      | Take a PDF screenshot and save it to the given file. [PDF options are specified here](https://github.com/atom/electron/blob/v0.35.2/docs/api/web-contents.md#webcontentsprinttopdfoptions-callback). |
| `nightmarePDF(path, [options])`      | Alias of `nightmarePdf`.                                                                                                        |
| `nightmareScreenshot([path])`        | Take a screenshot. if path is provided that file will be written (must end in `.png`), if no path is provided a buffer is returned into the `screenshot` key within the context |
| `nightmareType(selector, text)`      | Enter the given text into the input box specified by the selector                                                               |
| `nightmareWait(selector | timeout)`  | Wait for a given selector to appear or a given number of milliseconds                                                           |


Timeouts
--------
You can set the default Nightmare timeouts by passing `waitTimeout` (default: 30s), `gotoTimeout` (default: 30s), `loadTimeout` (default: infinite) into the initial `nightmare(options)` call.

Should any subsequent event timeout the `NIGHTMARE-TIMEOUT` error response will be passed to `end()`.

For example in the following code the module is asked to load a page and wait for an element which will never load. Since the timeout is set for 1 second Nightmare will give up after that time and immediately throw an error, skipping to the `end()` call.

		asyncChainable()
			.use(require('async-chainable-nightmare'))
			.nightmare({waitTimeout: 1000}) // Give up waiting after 1 second
			.nightmareGoto('http://somewhere.com')
			.nightmareWait('#someImpossibleElement')
			... Do other things ...
			.end(function(err) {
				// Err will be 'NIGHTMARE-TIMEOUT' here
			});
