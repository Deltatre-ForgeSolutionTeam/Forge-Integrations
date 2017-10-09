'use strict'

let path = require('path');
let app = require('./expressApp.js');

let bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:false
}));

let port = process.env.PORT || 1337;

let tableinput = require('./story-part-table/parts.js');
let storypartquote = require('./story-part-quote/parts.js');
let storyparthtmlnotsupported = require('./story-part-html-not-supported/parts.js');

	app.listen(port, function(){
		console.log(`forge-external-story-parts listening at port ${port}`);
	});
