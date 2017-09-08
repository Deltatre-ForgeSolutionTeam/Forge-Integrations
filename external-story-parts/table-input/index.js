'use strict';

let app = require('../expressApp.js');

app.get('/table-input', function(req, res) {
	res.json({
		"icon":"grid_on",
		"schema":{
			"title": "Table",
			"type": "object",
			"properties": {
				"tableValue": {
					"type": "polymer",
					"extended-type": "forge-table-input"
				}
			}
		},
		"search":"http://forge-external-story-parts.azurewebsites.net/table-input/search"
	});
});
