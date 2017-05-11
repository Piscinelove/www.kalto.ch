var express = require('express')
var app = express();
var http = require('http').Server(app);

var port = 1234;

app.use(express.static(__dirname));

app.get('/', function(req, res){
	//res.set("Content-Type", "charset=utf-8");
	res.sendFile(__dirname + '/.html');
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});