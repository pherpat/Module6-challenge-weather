
// Ready Function 
$(document).ready(function() {


// var APIKey = a2d0909749d771d93d99ada7417130a6;
 
//  ---------creating variables ----------
var searchBtn = $(".btn");
var cityName = $("#cityName");
var condition = $("#condition");
var tempeture = $("#tempeture");
var cWind = $("#cWind");
var humidity = $("#humidity");
var iconTemp = $("#icon");
let history = JSON.parse(window.localStorage.getItem("history")) || [];


// On click button function 
searchBtn.on("click", function(event){
  event.preventDefault();
  getWeather();
  createForecast();
  handleFormSubmit();

});

// -------get weather function------
function getWeather () {
  var inputBox = $("#cityInput").val();

//  API - weather info for main city 
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" 
    + inputBox + "&appid=a2d0909749d771d93d99ada7417130a6&units=imperial", // my-key
    dataType: "JSON",
    success: (data) => {
    console.log(data);

    // Saving to the local storage
    history.push(inputBox);
    window.localStorage.setItem("history", JSON.stringify(history));
     

    // dayjs for current time 
    var currentTime = dayjs().format("(MM/DD/YYYY)");
    // $("#currentDay").text(currentTime);

    // new variable name value 
    var nameValue = data.name;
    cityName.text(nameValue + " " + currentTime);
    
    // new variable condition
    var conditionValue = data.weather[0].main;
		console.log(conditionValue);
    condition.text(conditionValue);

    // new variable tempeture
		var tempValue = data.main.temp;
		tempeture.text(tempValue +"°F");
    let iconTemp = $("#icon").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

    var humidityValue = data.main.humidity;
    humidity.text(humidityValue + "%");

    var windValue = data.wind.speed;
    cWind.text(windValue + "mph");
    }

  });
}



// -------- 5 day forecast function---------------
function createForecast() {
	var inputBox = $("#cityInput").val();
	
	$.ajax({
  type: "GET",
  url:"https://api.openweathermap.org/data/2.5/forecast?q=" 
  + inputBox + "&appid=a2d0909749d771d93d99ada7417130a6&units=imperial",
  dataType: "JSON",
  success: (data) => {
		
  $("#forecast").append('<div class="row">');

  for (let i = 0; i < data.list.length; i++) {
  if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) { 

    // add class to the cards
  let col = $("<div>").addClass("col-md-2");
  let card = $("<div>").addClass("card text-black");
  let body = $("<div>").addClass("card-body");

  let title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

  let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" +
    data.list[i].weather[0].icon + ".png");

  let tempCard = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp_max + " °F");
  let windCard = $("<p>").addClass("card-text").text("Wind: " + data.list[i].wind.speed + "mph");
  let humidityCard = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
  

  col.append(card.append(body.append(title, img, tempCard, windCard, humidityCard)));
  $("#forecast .row").append(col);

    }
    }
  }
   
  });

 
}});
