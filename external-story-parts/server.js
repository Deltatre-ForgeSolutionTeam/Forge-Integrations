'use strict'

let path = require('path');
let app = require('./expressApp.js');

let bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended:false
}));

let port = process.env.PORT || 1337;

let tableinput = require('./table-input/parts.js');

	app.listen(port, function(){
		console.log(`forge-external-story-parts listening at port ${port}`);
	});
