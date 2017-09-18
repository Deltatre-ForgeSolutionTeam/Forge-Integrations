'use strict';

let app = require('../expressApp.js');
var escape = require('escape-html');

app.get('/story-part-quote/search', function (req, res) {
	res.json({ "error": "I feel a disturbance in the Force, you should use POST, not GET." });
});

app.post('/story-part-quote/search', function (req, res) {

	var quote = req.body.quoteValue;
	var result = "result";
	var quoteData = { "quote": quote.quote, "author": quote.author };




	res.json([{
		"type": "story-part-quote",
		"preview": result,
		"content": quoteData
	}]);

});
