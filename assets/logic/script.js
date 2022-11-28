// create variables
// local storage ready
// cities list on the aside function
// create -on click - function for get weather and forecast
// make the cities (history) clickable
// save to local storage 
// get current date dayjs, variables and function for main City
// variables and function for Forecast cards 


// Ready Function 
$(document).ready(function() {


// var APIKey = a2d0909749d771d93d99ada7417130a6; 
 
//  ---------Creating variables ----------
$("#mainCity").hide(); // hide mainCity block
$("#error").hide(); // hide error message
var searchBtn = $(".btn");
var cityName = $("#cityName");
var condition = $("#condition");
var tempeture = $("#tempeture");
var cWind = $("#cWind");
var humidity = $("#humidity");

// Read the local storage and set it to a variable	
let history = JSON.parse(window.localStorage.getItem("history")) || [];
  // console.log(history);

  // Create list with the input cities li
  function historyCity() {
  for (var i = 0; i < history.length; i++) {
    let cityHistory = $("<li>").text(history[i]);
    $("#cities-list").append(cityHistory);
  }
  }
 // run function
  historyCity(); 

// -------On click button function --------
searchBtn.on("click", function(event){
  $("#mainCity").show(300); // show the maincity box and add fade in time
  $("#welcome").hide(); // hide the welcome message 
  let inputBox = $("#cityInput").val();
  event.preventDefault(); // cleaning your action
  getWeather(inputBox); // get weather and pass in the input variable into the function
  createForecast(inputBox); // get forecast

  // ------Empty inputBox-----
  $("#cityInput").val("");

});

//  ----Cities list - clickable buttons------
$("#cities-list").on("click", "li", function() {
  $("#mainCity").show(300); // show mainCity box
  $("#welcome").hide();  // hide welcome message
  getWeather ($(this).text()); // this 
  createForecast($(this).text());
});


// -------Get weather function------
function getWeather (inputBox) {

//  API - weather info for main city - AJAX- get
  $.ajax({
    type: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" 
    + inputBox + "&appid=a2d0909749d771d93d99ada7417130a6&units=imperial", // my-key
    dataType: "JSON",
    success: (data) => {
      $("#error").hide();
    // console.log(data);

    // -----Saving to the local storage------
    if (history.indexOf(inputBox) === -1) { //not repeating city
    history.push(inputBox); //pushing the value to the array
    window.localStorage.setItem("history", JSON.stringify(history)); // sending data to the local storage 
    $("#cities-list").empty();  
    historyCity(history); 
    }

    // ------dayjs for current day (month/day/year)
    var currentTime = dayjs().format("(MM/DD/YYYY)");
    
    // New variable name-value 
    var nameValue = data.name;
    cityName.text(nameValue + " " + currentTime);
    
    // New variable condition
    var conditionValue = data.weather[0].main;
		console.log(conditionValue);
    condition.text(conditionValue);

    // New variable tempeture
		var tempValue = data.main.temp;
		tempeture.text(tempValue + "°F");
    let iconTemp = $("#icon").attr("src", "https://openweathermap.org/img/w/" + 
      data.weather[0].icon + ".png");

    // New var for humidity
    var humidityValue = data.main.humidity;
    humidity.text(humidityValue + "%");

    // New var for wind
    var windValue = data.wind.speed;
    cWind.text(windValue + "mph");
    },

    // alert message 
    error: function() {
      //alert("Can't find city please try again!");
      $("#error").show();
      $("#mainCity").hide();
      $("#fdForecast").hide();
    }
  });
}


// -------- 5 day forecast function---------------
function createForecast(inputBox) {
  $("#forecast").empty();
	$.ajax({
  type: "GET",
  url:"https://api.openweathermap.org/data/2.5/forecast?q=" 
  + inputBox + "&appid=a2d0909749d771d93d99ada7417130a6&units=imperial",
  dataType: "JSON",
  success: (data) => {
    $("#fdForecast").show();
 	
    // text 5 day forecast and the row
  $("#fdForecast").text("5 Day-Forecast");
  $("#forecast").append('<div class="row">');

  for (let i = 0; i < data.list.length; i++) {
  if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) { 

    // add cards, classes 
  let col = $("<div>").addClass("col");
  let card = $("<div>").addClass("card text-black");
  let body = $("<div>").addClass("card-body");

 // title, class and text for the forecast cards
  let title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

  // Weather Icon
  let img = $("<img>").attr("src", "https://openweathermap.org/img/w/" +
    data.list[i].weather[0].icon + ".png");

    // variables, class, and text
  let tempCard = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
  let windCard = $("<p>").addClass("card-text").text("Wind: " + data.list[i].wind.speed + "mph");
  let humidityCard = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
  
    // append cards data to the body, the card and the forecast box "col"
  col.append(card.append(body.append(title, img, tempCard, windCard, humidityCard)));
  $("#forecast .row").append(col);

    }
    }
  }
   
  });
  
}});
