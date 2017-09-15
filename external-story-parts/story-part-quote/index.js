'use strict';

let app = require('../expressApp.js');

app.get('/story-part-quote', function(req, res) {
	res.json({
		"icon":"format_quote",
		"schema":{
			"title": "Quote",
			"type": "object",
			"properties": {
				"quoteValue": {
					"type": "polymer",
					"extended-type": "story-part-quote"
				}
			}
		},
		"search":"http://forge-external-story-parts.azurewebsites.net/story-part-quote/search"
	});
});
