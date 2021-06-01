const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require('ejs');
require('dotenv').config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let weather = {
    city: 'City Name',
    temp: '',
    pressure: '',
    humidity: '',
    wind: '',
    weatherD: 'Description',
    icon: '',
};

app.get('/', function(req, res) {
    res.render('home', weather);
});

app.post('/failure', function(req, res) {
    res.redirect('/');
});

app.post('/', function(req, res) {

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;

    https.get(url, function(response) {

        response.on("data", function(data) {

            if (response.statusCode !== 200) {
                res.render('failure', { code: response.statusCode });

            } else {

                const weatherData = JSON.parse(data);
                console.log(weatherData)

                const temp = weatherData.main.temp;
                const pressure = weatherData.main.pressure;
                const humidity = weatherData.main.humidity;
                const wind = weatherData.wind.speed;
                const weatherDescripstion = weatherData.weather[0].description;

                const weatherIcon = weatherData.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`

                weather = {
                    city: query,
                    temp: temp,
                    pressure: pressure,
                    humidity: humidity,
                    wind: wind,
                    weatherD: weatherDescripstion,
                    icon: iconUrl
                };

                res.redirect('/');
            }
        });
    });
});

app.listen(process.env.PORT || port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
});