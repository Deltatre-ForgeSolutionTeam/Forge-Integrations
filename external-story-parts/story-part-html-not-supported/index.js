'use strict';

let app = require('../expressApp.js');

app.get('/story-part-html-not-supported', function(req, res) {
	res.json({
		"icon":"block",
		"schema":{
			"title": "HTML Not Supported",
			"type": "object",
			"properties": {
				"content": {
					"type": "polymer",
					"extended-type": "story-part-html-not-supported"
				}
			}
		},
		"search":"http://forge-external-story-parts.azurewebsites.net/story-part-html-not-supported/search"
	});
});
