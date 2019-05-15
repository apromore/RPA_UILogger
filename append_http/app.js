/*
 * Copyright © 2019 The University of Melbourne.
 *
 * This file is part of "Apromore".
 *
 * "Apromore" is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * "Apromore" is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */
 
 var fs = require('fs'),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  http = require('http');

app.use(bodyParser.json());

//enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var port = 8080;
http.createServer(app).listen(port);

var userID = process.argv[2];
if(userID == null) {
  console.log("Please provide your username.");
  process.exit();
}

app.get('/', function (req, res) {
  res.header('Content-type', 'text/html');
  return res.end('<h1>Hello World!</h1>');
});

app.post('/', function (req, res) {
  
  // var logoutput = JSON.stringify(req.body);
  // console.log(logoutput);
  var output = req.body;
  output.userID = userID;
  console.log(JSON.stringify(output));
  csvParse(output,res)
});

console.log('Server running at ' + port);
console.log("Action Logger now recording")

const clipMonit = require('./clipboard/clipmonit.js');

//initialize & optionally set the interval with which to monitor the clipboard
var monitor = clipMonit(1);
var initialize = false;

//'copy. event is fired every time data is copied to the clipboard
monitor.on('copy', function (data) {
  if (initialize == true && typeof data == "string" && data !== "Invalid Content") {
    //do something with the data
    // var output = "[" + new Date() + "] " + JSON.stringify({eventType:"Copy",data:data});
	var regex = /\r|\n|\t/g;
	eventObj={timeStamp:new Date(Date.now()),targetApp:"OS-Clipboard",eventType:"copy",content:data.replace(regex,'')};
	console.log(eventObj);
    csvParse(eventObj,0)
    //  console.log(output);
  } else { initialize = true; }
});

function csvParse(data,res){
  const Json2csvParser = require('json2csv').Parser;
  const fields = ['timeStamp', 'userID', 'targetApp', 'eventType', 'url', 'content', 'target.workbookName', 'target.sheetName','target.id','target.class','target.tagName', 'target.type', 'target.name', 'target.value', 'target.innerText', 'target.checked', 'target.href', 'target.option'];
  // console.log(" DATA IS: " + JSON.stringify(data));
  var json2csvParser;
  if (!fs.existsSync('logs.csv')) {
    json2csvParser = new Json2csvParser({ fields, header: true });
  } else {
    json2csvParser = new Json2csvParser({ fields, header: false });
  };

  var csv = json2csvParser.parse(data);
  fs.appendFile('logs.csv', csv + "\n", function (err) {
    if (err) throw err;
    if (res != 0){
    res.write("http appended");
    res.end();}
  });
}
