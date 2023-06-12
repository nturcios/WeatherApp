//the packages we will use for our application
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const https = require("https"); 
const axios = require('axios'); 



// we need to parse the data from the url
app.use(bodyParser.urlencoded({ extended: true }));

// "get" is used to send the html file to the browser when a request is made
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/page.html");
});

// "post" is used to send a response with data from apis to the user when a request is made, when zipcode is entered the temp will return
app.post("/", function (req, res) {
  const cityName = req.body.cityName;
// axios is used to make an api call to the geolocation api below
  axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${cityName}&appid=051798100cfbd690b65891fdd5077af5`)
    .then(response => {
      // Retreve needed data from response
  
      const latitude = response.data.lat;
      const longitude = response.data.lon;
// Longitude and latitude variables are then entered with template literial in the second api url below that will return weather.
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=051798100cfbd690b65891fdd5077af5&units=imperial`;
 
// we use "get method" to get the data from the second api with the weather
  https.get(url, function (weatherResponse) {

    weatherResponse.on("data", function (data) {
      const jsondata = JSON.parse(data);
      const temp = jsondata.main.temp;
      const des = jsondata.weather[0].description;
      const icon = jsondata.weather[0].icon;
    //  should use image as the current weather in that moment upon search
      const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(`<h1>The temperature in ${cityName} is ${temp} degrees</h1>`);
      res.write(`<p>The weather description is ${des} </p>`);
      res.write("<img src=" + imageurl + ">");
    //   response sent to user
      res.send();
    });
  });
})
// catch any errors
.catch(error => {
    console.error('Error:', error);
    res.status(500).send('Error occurred');
  });
});
// server running on port 3000
app.listen(3000);
console.log(`Server connected`);