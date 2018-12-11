var http = require('http');
var fs = require('fs');

function handle_incoming_request (req, res) {

    console.log("INCOMING REQUEST: " + req.method + " " + req.url);

    load_sensor_data(function(err, readings){
		if (err) { 
			console.log("Couldn't read file");
		}
		var lines = readings;
		//console.log(lines);
		lines = lines.toString('ascii', 0, lines.length);
		lines = lines.split("\n");

		var z;
		for(z in lines) {
		console.log(lines[z]);
		lines[z]=lines[z].replace(/(\r\n|\n|\r)/gm,"");
		}
        var topobj = {};
        var key = 'Sensor Log';
        topobj[key]=[];
		///////////////////
		for(z =0; z < lines.length; z++) {

		var array = lines[z];
		//console.log(array);
		//console.log(lines.length.toString());
		array = array.toString('ascii', 0, array.length);
		array = array.split(",");
	    //for(i in array) {
		//	console.log(array[i]);
		//}
		var text1 = '{"temperature":'+'"'+array[0]+'",';
		var text2 = '"humidity":'+'"'+array[1]+'",';
		var text3 = '"wind speed":'+'"'+array[2]+'",';
		var text4 = '"time":'+'"'+array[3]+'",';
		var text5 = '"location":'+'"'+array[4]+'"}';

		sensorText = text1 + text2 + text3 + text4 + text5;   	
		console.log(sensorText);
		var obj = JSON.parse(sensorText);
        topobj[key].push(obj);
		}

		res.writeHead(200, { "Content-Type" : "application/json" });
		res.end(JSON.stringify(topobj));
   });
}

function load_sensor_data(callback) {
  	
      fs.readFile(
		"sensorlog.txt",'utf8',
		function (err, readings) {

		if (err) {
			callback(err);
			return;
		}
		callback(null, readings);
	});   
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);




