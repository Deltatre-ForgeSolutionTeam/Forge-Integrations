'use strict';

let app = require('../expressApp.js');

app.get('/story-part-table', function(req, res) {
	res.json({
		"icon":"grid_on",
		"schema":{
			"title": "Table",
			"type": "object",
			"properties": {
				"tableValue": {
					"type": "polymer",
					"extended-type": "story-part-table"
				}
			}
		},
		"search":"http://forge-external-story-parts.azurewebsites.net/story-part-table/search"
	});
});
