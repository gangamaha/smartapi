var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');

var app = express();
app.use(bodyparser.json());

var constvar = {
	GM_API_URL : 'http://gmapi.azurewebsites.net/',
	RESPONSE_BODY : {
		'responseType': 'JSON'
	}
};

app.listen(3000, function(){
	console.log("Server running at port 3000");
})

var smartcarapi = {
	'vehicleinfo' : {
		'endpoint': constvar.GM_API_URL + 'getVehicleInfoService',
		'GET': {
			'requestbody': function(request){
				var carbody = constvar.RESPONSE_BODY;
				carbody.id = request.params.id;
				return carbody;
			},
			'parsebody': function(carbody){
				if(carbody.data.fourDoorSedan.value === "True"){  
					carbody.data.fourDoorSedan.value = 4;
				}
				else{
					carbody.data.fourDoorSedan.value = 2;
				}
				return{
					'vin': carbody.data.vin.value,
					'color': carbody.data.color.value,
					'doorCount': carbody.data.fourDoorSedan.value,
					'driveTrain': carbody.data.driveTrain.value
				};
			}
		}
	},
	'doors': {
		'endpoint': constvar.GM_API_URL + 'getSecurityStatusService',
		'GET': {
			'requestbody': function(request){
				var carbody = constvar.RESPONSE_BODY;
				carbody.id = request.params.id;
				return carbody;
			},
			'parsebody': function(carbody){
				var doordisp = [];
				// depending on 2 door or 4 door vehicle
				for(var i=0; i< carbody.data.doors.values.length; i++){
					doordisp.push({
						location: carbody.data.doors.values[i].location.value,
						locked: carbody.data.doors.values[i].locked.value === 'True'

					});
				}
				return doordisp;
			}
		}
	},
	'fuel': {
		'endpoint': constvar.GM_API_URL + 'getEnergyService',
		'GET':{
			'requestbody' : function(request){
				var carbody = constvar.RESPONSE_BODY;
				carbody.id = request.params.id;
				return carbody;
			},
			'parsebody' : function(carbody){
				if(carbody.data.tankLevel.value === 'null'){
					carbody.data.tankLevel.value = 0;
				}
				return{
					'percent': Number(carbody.data.tankLevel.value)	//the value should be number 30 instead of string "30" as given in spec
				};
			}
		}
	},
	'battery': {
		'endpoint': constvar.GM_API_URL + 'getEnergyService',
		'GET':{
			'requestbody' : function(request){
				var carbody = constvar.RESPONSE_BODY;
				carbody.id = request.params.id;
				return carbody;
			},
			'parsebody' : function(carbody){
				if(carbody.data.batteryLevel.value === 'null'){
					carbody.data.batteryLevel.value = 0;
				}
				return{
					'percent': Number(carbody.data.batteryLevel.value) // value should be 50 not "50" as given in specs
				};
			}
		}
	},
	'engine': {
		'endpoint': constvar.GM_API_URL + 'actionEngineService',
		'POST':{
			'enginestatus': function(carbody){
				return (carbody.action === 'START' || carbody.action === 'STOP');
			},
			'requestbody' : function(request){
				var command;
				if(request.params.action === 'START'){
					command = 'START_VEHICLE';
				}
				else{
					command = 'STOP_VEHICLE';
				}
				var carbody = constvar.RESPONSE_BODY;
				carbody.id = request.params.id;
				carbody.command = command;
				return carbody;
			},
			'parsebody': function(carbody){
				var result;
				if(carbody.actionResult.status === 'EXECUTED'){
					result = 'success';
				}
				else{
					result = 'error';
				}
				return{
					'status' : result
				}; 
			}

		}
	}
};


var displayres = function(err, gmres, body, smartreq, smartres){
	if(err || gmres.statusCode != 200){
		return smartres.sendStatus(500);
	}
	// if the GM API response is 200 OK then send the details to smart-car api
	smartres.send(smartcarapi[smartreq.params.requestType][smartreq.method].parsebody(body));
}

var check = function(req, res, next){
	if(!req.params.requestType){
		req.params.requestType = 'vehicleinfo';
	}
	if(! smartcarapi[req.params.requestType]){
		console.log("Invalid resource specified " + req.params.requestType)
		return res.sendStatus(404);
	}
	next();
}

// accepting a request to my own localhost service that matches the pattern /vehicles/:id/:requestType and passing to the function
app.get('/vehicles/:id/:requestType?', check, function(req,res){
	// posting the request to the GM API
	request.post({
		url: smartcarapi[req.params.requestType].endpoint,
		body: smartcarapi[req.params.requestType][req.method].requestbody(req),
		json: true			
		}, function(err, response, body){
			// function to decide what to do with the GM API response
			displayres(err, response, body, req, res);
		});
});

app.post('/vehicles/:id/:requestType?', check, function(req,res){
	// posting the request to the GM API
	request.post({
		url: smartcarapi[req.params.requestType].endpoint,
		body: smartcarapi[req.params.requestType][req.method].requestbody(req),
		json: true			
		}, function(err, response, body){
			// function to decide what to do with the GM API response
			displayres(err, response, body, req, res);
		});
});

module.exports = app;