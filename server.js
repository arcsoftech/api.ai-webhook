//Initialization
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var json_body_parser = bodyParser.json();
var request = require('request');
app.use(bodyParser.json());
//const proxy='http://proxy.company.com:8080';// or blank for without proxy
 const proxy = '';
app.post('/weather',json_body_parser, function (req, res) 
{
	res.set('Content-Type', 'application/json');
	var options = { 
	method: 'GET',
	url: 'https://query.yahooapis.com/v1/public/yql',
	qs: 
	{ 
		format: 'json',
		q: 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+req.body.result.parameters.city+'")' },
	headers: 
   { 
		'cache-control': 'no-cache' 
   } ,
   proxy: proxy
   };
	request(options, function (error, response, body) {
	if (error) 
	{
		console.log("API call Failed")
		var errorResponse=
	{
		"status": 
		{
		"code": 206,
		"errorType": "partial_content",
		"errorDetails": "Webhook call failed. Status code 503. Error:503 Service Unavailable"
		}
	}
		res.end(JSON.stringify(errorResponse));
		throw new Error(error);
	}
	else
	{
		console.log("API call succesfull.");
		var data = JSON.parse( body );
		var fulfillment=
		{
			"speech": "Today in "+data.query.results.channel.location.city+","+data.query.results.channel.location.country +" : "+data.query.results.channel.item.condition.text+", the temperature is "+data.query.results.channel.item.condition.temp+" F",
			"source": "Arcsoftech-Webhook",
			"displayText": "Today in "+data.query.results.channel.location.city+","+data.query.results.channel.location.country +" : "+data.query.results.channel.item.condition.text+", the temperature is "+data.query.results.channel.item.condition.temp+" F"
		}
		res.end(JSON.stringify(fulfillment));
	}
});
})

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = '<html><title>Arcsoftech-Heroku</title><body><h1>Name:Arcsoftech-Webhook.<br/>Author:Arihant Chhajed.<br/>Status:App is running.<br/></h1></body></html>'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
