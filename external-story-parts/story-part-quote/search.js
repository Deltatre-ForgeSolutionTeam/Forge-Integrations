'use strict';

let app = require('../expressApp.js');
var escape = require('escape-html');

app.get('/story-part-quote/search', function (req, res) {
	res.json({ "error": "I feel a disturbance in the Force, you should use POST, not GET." });
});

app.post('/story-part-quote/search', function (req, res) {

	var quote = req.body.quoteValue;
	var result = '<pre>'
	+ '<div style="overflow: hidden; position: relative;">'
		+ '<div style="float:left; width:10%; text-align: left; -webkit-transform: rotateY(180deg); moz-transform: rotateY(180deg); -o-transform: rotateY(180deg); -ms-transform: rotateY(180deg);"><i class="material-icons" style="color:gray; font-size:60px">format_quote</i></div>'
		+ '<div style="float:left; width:80%; padding:20px; min-height:130px; border:dotted 1px #999; white-space: pre-wrap; position: relative;">'
			+ '<div>' + quote.quote + '</div>'
			+ '<div style="padding-top:10px; padding-bottom:10px; text-align:right; font-style:italic; font-weight:bold; font-size:16px;">' + quote.author + '</div>'
		+ '</div>'
		+ '<div style="float:left; width:10%; position: absolute; bottom:0px; right:0px;"><i class="material-icons" style="color:gray; font-size:60px">format_quote</i></div>'
	+ '</div>'
	+'</pre>';
	var quoteData = { "quote": quote.quote, "author": quote.author };




	res.json([{
		"type": "story-part-quote",
		"preview": result,
		"content": quoteData
	}]);

});
