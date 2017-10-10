'use strict';

let app = require('../expressApp.js');
var escape = require('escape-html');

app.get('/story-part-html-not-supported/search', function (req, res) {
	res.json({ "error": "I feel a disturbance in the Force, you should use POST, not GET." });
});

app.post('/story-part-html-not-supported/search', function (req, res) {

	var bodyValue = req.body.content;

	var result = '<div class="layout vertical">' +
					'<div class="layout horizontal center" style="margin-bottom: 10px; font-size: 16px;">' +
						'<iron-icon icon="warning" style=" width: 32px; height: auto; margin-right: 10px; color: red;"></iron-icon>' +
						'<span>This part contains the following HTML Code that is not supported:</span>' +
					'</div>' +
					'<pre>' + escape(bodyValue) + '</pre>' +
				'</div>';

	var valueData = { "content": bodyValue };

	res.json([{
		"type": "story-part-html-not-supported",
		"preview": result,
		"content": valueData
	}]);

});
