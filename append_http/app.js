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

var port = 8080;

http.createServer(app).listen(port);

app.get('/', function (req, res) {
  res.header('Content-type', 'text/html');
  return res.end('<h1>Hello World!</h1>');
});


app.post('/', function (req, res) {
  //var newbody = JSON.parse(req.body);
  //console.log("request body: " +req.body);

  //var body = req.body;
  var logoutput = JSON.stringify(req.body);
  console.log(logoutput);

  var output = req.body;

  const Json2csvParser = require('json2csv').Parser;
  const fields = ['timeStamp', 'userID', 'targetApp', 'url', 'eventType', 'target.id', 'target.tagName', 'target.type', 'target.name', 'target.value', 'target.innerText', 'target.checked', 'target.href', 'target.option'];

  var json2csvParser;

  if (!fs.existsSync('logs.csv')) {
    json2csvParser = new Json2csvParser({ fields, header: true });
  } else {
    json2csvParser = new Json2csvParser({ fields, header: false });
  };

  const csv = json2csvParser.parse(output);




  fs.appendFile('logs.csv', csv + "\n", function (err) {
    if (err) throw err;
    // console.log(json2csvParser);
    //res.write(JSON.stringify(req.body));
    res.write("http appended");
    res.end();
  });

});

console.log('Server running at ' + port);

//const clipboardy = require('./clipboardy.js');
const clipMonit = require('./clipboard/clipmonit.js');

//initialize & optionally set the interval with which to monitor the clipboard
var monitor = clipMonit(500);
var initialize = false;

//'copy. event is fired every time data is copied to the clipboard
monitor.on('copy', function (data) {
  if (initialize == true && typeof data == "string") {
    //do something with the data
    // var output = "[" + new Date() + "] " + JSON.stringify({eventType:"Copy",data:data});
    console.log(typeof data + "'" + data + "'");
    //  console.log(output);
  } else { initialize = true; }
});

//clipboardy.read().then(function (data){console.log("clip: "+data)})