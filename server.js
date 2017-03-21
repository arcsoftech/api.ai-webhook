/*
 *Author:Arihant Chhajed
 *Language:Node.JS
 *License:Free
 *Service Used:Yahoo Weather API
*/


//Initialization
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var json_body_parser = bodyParser.json();//this is used to prevent empty reponse in api.ai
var request = require('request');
app.use(bodyParser.json());
//const proxy='http://proxy.company.com:8080';// or blank for without proxy
 const proxy = '';
app.post('/weather',json_body_parser, function (req, res) //2nd parameter is used to prevent empty string error in api.ai
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
    var template = "<html>"+
"<head>"+
"<title>Arcsoftech-Webhook</title>"+
"</head>"+
"<body>"+
"<div>"+
    "<centre>"+
    "<h3>Application Info</h3>"+
    "<h4><b>Status:</b>App is running</h4>"+
    "<table border='1'>"+
        "<thead>"+
            "<tr>"+
                "<th>S.no</th>"+
                "<th>Entity</th>"+
                "<th>Value</th>"+
            "</tr>"+
        "</thead>"+
        "<tbody>"+
            "<tr>"+
                "<td>1</td>"+
                "<td>Name</td>"+
                "<td>Arcsoftech-Heroku</td>"+
            "</tr>"+
            "<tr>"+
                "<td>2</td>"+
                "<td>Purpose</td>"+
                "<td>To showcase Example for Webhook in API.AI</td>"+
            "</tr>"+
               "<tr>"+
                "<td>3</td>"+
                "<td>Author</td>"+
                "<td>Arihant Chhajed</td>"+
            "</tr>"+
               "<tr>"+
                "<td>4</td>"+
                "<td>Github Repository</td>"+
                "<td>https://github.com/arcsoftech/api.ai-webhook.git</td>"+
            "</tr>"+
               "<tr>"+
                "<td>5</td>"+
                "<td>API Request Method</td>"+
                "<td>POST</td>"+
            "</tr>"+
             "<tr>"+
                "<td>6</td>"+
                "<td>Service Used</td>"+
				"<td>Yahoo Weather API</td>"+
            "</tr>"+
                 "<tr>"+
                "<td>7</td>"+
                "<td>API EndPoint</td>"+
                "<td>https://webhook-arcsoftech.herokuapp.com/weather</td>"+
            "</tr>"+ 
        "</tbody>"+
    "</table>"+
    "</center>"+
"</div>"+
"</body>"+
"</html>"
    response.send(template);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
