var fs = require('fs'),
 // https = require('https'),
  express = require('express'),
  app = express();
var bodyParser = require('body-parser');


http = require('http')

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

http.createServer(app).listen(8080);

// https.createServer({
//   key: fs.readFileSync('./sslcert/key.pem'),
//   cert: fs.readFileSync('./sslcert/cert.pem')
// }, app).listen(8080);

app.get('/', function (req, res) {
  res.header('Content-type', 'text/html');
  return res.end('<h1>Hello World!</h1>');
});


app.post('/', function (req, res) {
  //var newbody = JSON.parse(req.body);
  //console.log("request body: " +req.body);

  //var body = req.body;
  var logoutput = "[" + new Date() + "] " + JSON.stringify(req.body);
  console.log(logoutput);
  // if (body.a != undefined) {
  //   logoutput = logoutput + "|Source: " + body.a;
  //   console.log(logoutput);


  //   if (body.a == "Excel") {

  //     if (body.b != undefined) {
  //       logoutput = logoutput + "|Type: " + body.b;
  //       console.log(logoutput);
  //     };

  //     if (body.c != undefined) {
  //       logoutput = logoutput + "|Address: " + body.c;
  //       console.log(logoutput);
  //     };

  //     if (body.d != undefined) {
  //       logoutput = logoutput + "|Values: " + body.d;
  //       console.log(logoutput);
  //     };
  //   };
  //   logoutput = logoutput + "|";
  //   console.log(logoutput);
  // }
  // else {
  //   logoutput = req.body;
  // };

  //console.log("write-to-file activated");

  fs.appendFile('logs.txt', JSON.stringify(logoutput) + "\n", function (err) {
    if (err) throw err;
    console.log('Append File Saved!');
    //res.write(JSON.stringify(req.body));
    res.write("http appended");
    res.end();
  });

});

console.log('Server running at 8080');
// const http = require('http');
// const fs = require("fs");

// http.createServer((request, response) => {
//     console.log('Running...');
//     const { headers, method, url } = request;
// let body = [];
// request.on('error', (err) => {
//     console.error(err);
// }).on('data', (chunk) => {
//     body.push(chunk);
// }).on('end', () => {
//     body = Buffer.concat(body).toString();
// // BEGINNING OF NEW STUFF

// response.on('error', (err) => {
//     console.error(err);
// });

// response.statusCode = 200;
// response.setHeader('Content-Type', 'application/json');
// // Note: the 2 lines above could be replaced with this next one:
// // response.writeHead(200, {'Content-Type': 'application/json'})

// const responseBody = { headers, method, url, body };

// response.write(JSON.stringify(responseBody));
// console.log("write-to-file (node-connector):");
// fs.writeFile('textresponse-8080.txt', JSON.stringify(responseBody.body), (error) => { /* handle error */ });

// response.end();
// // Note: the 2 lines above could be replaced with this next one:
// // response.end(JSON.stringify(responseBody))

// // END OF NEW STUFF
// });


// }).listen(8080);

// console.log('Server running at 8080');


///// CLIPBOARD MONITOR


const clipboardy = require('clipboardy');

// clipboardy.writeSync('🦄');
 
// clipboardy.readSync();
// //=> '🦄'

const clipMonit = require('clipboard-monitor');
 
//initialize & optionally set the interval with which to monitor the clipboard
 
var monitor = clipMonit(500);
var initialize = false; 
/*
NOTE: interval defaults to 500ms so you can simply initialize using:
    'monitor = clipMonit()';
*/
 
 
//now monitor your events...
 
//'copy. event is fired every time data is copied to the clipboard
monitor.on('copy', function (data) {
    if (initialize == true ) {
    //do something with the data
    var output = "[" + new Date() + "] " + JSON.stringify({eventType:"Copy",data:data});
    console.log(output);
} else { initialize = true;}
});
 
// Add error handling for copying pictures
 
//Stop the monitoring the clipboard
//monitor.end();
//