var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var request = require('request');
app.use(bodyParser.json());
//const proxy='http://proxy.tcs.com:8080';// or blank for without proxy
        const proxy = '';


app.post('/weather', function (req, res) {
var WeatherResult="";
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

WeatherResult=request(options, function (error, response, body) {
  if (error) 
  {
  var error=
  {
	  "status": {
    "code": 206,
    "errorType": "partial_content",
    "errorDetails": "Webhook call failed. Status code 503. Error:503 Service Unavailable"
}
  }
      res.end(JSON.stringify(error));
	  throw new Error(error);
  }
  else{
  
  console.log(body);
  var data = JSON.parse( body );
  var fulfillment=
  {
  "fulfillment":
  {
  "speech": "Today in "+data.query.results.channel.location.city+","+data.query.results.channel.location.country +" : "+data.query.results.channel.item.condition.text+", the temperature is "+data.query.results.channel.item.condition.temp+" F",
  "source": "Arcsoftech-Webhook",
  "displayText": "Today in "+data.query.results.channel.location.city+","+data.query.results.channel.location.country +" : "+data.query.results.channel.item.condition.text+", the temperature is "+data.query.results.channel.item.condition.temp+" F"
 }
  }

  res.end(JSON.stringify(fulfillment));
  }
});
   
      // console.log( req.body.result.parameters );
  
	   
  // });
})

var server = app.listen(Number(process.env.port) || 8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

})
