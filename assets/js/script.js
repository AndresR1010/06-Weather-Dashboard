// shows current date and time
var update = function() {
    document.getElementById("datetime").innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
setInterval(update, 1000);

// shows current date on card
document.getElementById("date").innerHTML = moment().format("MMM Do YY");  

// shows saved data 
document.addEventListener("DOMContentLoaded", function() {
    var saved = localStorage.getItem('list');
    if (saved) {
      list.innerHTML = saved;
  };
});

// Saves search history
var list = document.getElementById('searchHistory');
var searchBtn = $('#searchBtn');

// shows weather and adds city to search history
searchBtn.click(function () {
    // Clears 5 day forecast so multiple cities do not shown at the same time
    document.getElementById('forecastHeader').innerHTML = "";
    document.getElementById('forecast').innerHTML = "";
    var userSearch = document.querySelector("#userSearch").value;
    localStorage.setItem('userSearch', (userSearch));

    //adds to search history only if something correct is inputted
    if(userSearch){
        addSearchHistory();
        console.log(userSearch);        
    };
  // Saves to search history
    function addSearchHistory (){
      var li = $("<li>" + userSearch + "</li>");
      $('#searchHistory').append(li);
      localStorage.setItem('list', list.innerHTML);
    };

    requestWeather();
    
});

// Clears localStorage 
function clearData () {
    window.localStorage.clear();
    window.location.reload();
};

// finds and shows weather
function requestWeather(){
// API key for OpenWeatherMap
var apiKey = "dc97b4c352f0e32721b5d0d060c0d86e";


// Finds current weather information and locations
var weatherIcon = document.querySelector('#weatherIcon');
var cityName = document.querySelector('#cityName');
var currentTemp = document.querySelector('#currentTemp')
var humidity = document.querySelector('#humidity');
var wind = document.querySelector('#wind');
var uv = document.querySelector('#uv');

    // current weather  
var userSearch = $("#userSearch").val();
var urlToday = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearch + "&Appid=" + apiKey + "&units=imperial";
console.log(urlToday);
  
        $.ajax({
            url: urlToday,
            method: "GET"
        }).then(function(response){
            // shows current weather forecast and hides current city
            $('#searchPrompt').addClass('hidden');
            $('#searchPrompt').removeClass('shows');
            $('#cityshows').addClass('shows');
            $('#cityshows').removeClass('hidden');
            cityName.innerHTML = response.name;
            currentTemp.innerHTML = response.main.temp + "&deg;F";
            humidity.innerHTML = response.main.humidity + "%";
            wind.innerHTML = response.wind.speed + " MPH";
            var weather = 'https://openweathermap.org/img/w/'+ response.weather[0].icon + '.png';
            weatherIcon.src = weather;
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            let uvUrl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            $.ajax({
                url: uvUrl,
                method: "GET"
            }).then(function(response){
                uv.innerHTML = response.value;
                if(response.value <= 15){
                    uv.style.backgroundColor = "#d15e5e";
                };
                if(response.value <= 10){
                    uv.style.backgroundColor = "#e68549";
                };
                if(response.value <= 5){
                    uv.style.backgroundColor = "#a5db9c";
                };
            var forecastTitle = $("<h1 class='p-4' >5 Day Forecast</h1>")
            $('#forecastHeader').append(forecastTitle);
            }); 

        // 5 day forecast
        var urlForecast = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + apiKey + "&lat=" + lat +  "&lon=" + lon;
        // Find and show forecast
        $.ajax({
            url: urlForecast,
            method: "GET"
        }).then(function(response){
            $('#forecast').empty();
            for (var i = 1; i < response.list.length; i+=8) {;
                // Creates cards
                var forecastColumn = $("<div class='col-lg col-12 col-md-6'>");
                var forecastDiv = $("<div class='card forecastCard m-1 mb-4'>");
                var forecastCard = $("<div class='card-body pb-2'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='mb-0'>");
                var forecastHumid = $("<p class='mb-0'>");
                var forecastWind = $("<p class='mb-0'>");
                // Finds dates
                var forecastDateValue = moment(response.list[i].dt_txt).format("L")
                // Adds card to the page
                $('#forecast').append(forecastColumn);
                forecastColumn.append(forecastDiv);
                forecastDiv.append(forecastCard);
                // Finds values
                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", "Icon of " + response.list[i].weather[0].main)
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumid.text(response.list[i].main.humidity);
                forecastHumid.prepend("Humidity: ");
                forecastHumid.append("%"); 
                forecastWind.text(response.list[i].wind.speed);
                forecastWind.prepend("Wind: ");
                forecastWind.append(" MPH"); 
                // Adds value to the cards
                forecastCard.append(forecastDate);
                forecastCard.append(forecastIcon);
                forecastCard.append(forecastTemp);
                forecastCard.append(forecastHumid);
                forecastCard.append(forecastWind);
                forecastDate.text(forecastDateValue);
            }
        });
        // If city name is invalid the card won't change
        }).catch( function() {
            $('#searchPrompt').addClass('shows');
            $('#cityshows').removeClass('shows');
            $('#cityshows').addClass('hidden');
            console.log("Invalid city name");
          } );
};