'use strict';

let app = require('../expressApp.js');
var escape = require('escape-html');

app.get('/story-part-table/search', function (req, res) {
	res.json({ "error": "I feel a disturbance in the Force, you should use POST, not GET." });
});

app.post('/story-part-table/search', function (req, res) {

	console.log(JSON.stringify(req.body));

	var table = req.body.tableValue;
  var result;
	var formattedTable = {"data": [] };
  console.log(table);
  if(table){
		result = "<table class=\"table\"><thead><tr>";


		for (let i = 0; i < table.columns.length; i++) {
			const col = table.columns[i];
			var colContent = col.content;

			if(colContent == ''){
				colContent = "column name empty";
			}

			result += `<th>${escape(colContent)}</th>`;
		}

		result += "</tr></thead><tbody>";

		for (let i = 0; i < table.rows.length; i++) {
			const row = table.rows[i];
			result += "<tr>";
			for (let j = 0; j < row.content.length; j++) {
				const cell = row.content[j];
				result += `<td>${escape(cell)}</td>`;
			}
			result += "</tr>";
		}

		result += "</tbody></table>";


		var columns = table.columns;

		for(var i = 0; i < table.rows.length; i++){
		  var rowItem = table.rows[i].content;

		  var rowFormatted = {};
		  for(var r = 0; r < rowItem.length; r++){
		    var columnValue = columns[r].content;
				if(columnValue == ''){
					columnValue = "column name empty";
				}

		    rowFormatted[columnValue] = rowItem[r];

		  }

		  formattedTable.data.push(rowFormatted);
		}
	}else{
		result = "<table class=\"table\"><thead><tr>";
		result += "<th>Empty Table</th>";
		result += "</tr></thead><tbody>";
		result += "</tbody></table>";

	}




	res.json([{
		"type": "editorial-table",
		"preview": result,
		"content": formattedTable
	}]);

});
