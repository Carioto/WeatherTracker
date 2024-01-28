var coorEndPoint = "https://api.openweathermap.org/geo/1.0/direct?q="
var rootEndPoint = "https://api.openweathermap.org/data/3.0/onecall?"
var apiKey = config.My_Key;
var searchBtn = document.querySelector("#goButton");
var searchCity = document.querySelector("#search_city");
var thisDay = dayjs();
var displayDate = document.querySelector("#currentDay");
var emptyEl = document.querySelector("#emptyfield");
var pickAcity = document.querySelector('#pickcity');


//add new city to list of previous cities
//maintain a previous cities list of 8 max
function addCityToPrev() {
    var prevList=JSON.parse(localStorage.getItem('jsonList')) || [];
    prevList.push(searchCity.value);
    if (prevList.length > 8){
        prevList.shift();
    };
    localStorage.setItem('jsonList', JSON.stringify(prevList))
}

function getCityData() {
// get coordinates using city name
    var coordUrl = coorEndPoint + searchCity.value
                + "&limit=1&appid=" + apiKey;
    fetch(coordUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
//If no data returns, inform user and return
        if (data.length === 0) {
         emptyEl.textContent="This city was not recognized";
         return;
        }else{
//use coordinates returned to fetch weather data
            var coordData=data;
            var lat = coordData[0].lat;
            var lon = coordData[0].lon;
        var weathUrl = rootEndPoint + "lat=" + lat
        + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial" 
        + "&appid=" + apiKey;
        fetch(weathUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){ 
//loop through 6 days and display data
          var weathdata=data;
          for (d=0; d<6; d++){
              e=d+1
            var temper=document.getElementById("temp"+e);
            var windy=document.getElementById("wind"+e);
            var humid=document.getElementById("hum"+e);
            windy.textContent=Math.round(weathdata.daily[d].wind_speed)+" mph";
            humid.textContent=weathdata.daily[d].humidity+"%";
            temper.textContent=Math.round(weathdata.daily[d].temp.day)+"°F";
        };
    })
//add dates, add current city to list, redisplay list
    insertDates();
    addCityToPrev();
    loadPrev();
    }})
}
//Add dates function
function insertDates() {
    var thisDay = dayjs();
    var oneDay = document.getElementById("date1");
    var twoDay = document.getElementById("date2");
    var threeDay = document.getElementById("date3");
    var fourDay = document.getElementById("date4");
    var fiveDay = document.getElementById("date5");
    var sixDay = document.getElementById("date6");
    oneDay.textContent = thisDay.format('MMMM DD');
    twoDay.textContent = thisDay.add(1, 'day').format('MMMM DD');
    threeDay.textContent = thisDay.add(2, 'day').format('MMMM DD');
    fourDay.textContent = thisDay.add(3, 'day').format('MMMM DD');
    fiveDay.textContent = thisDay.add(4, 'day').format('MMMM DD');
    sixDay.textContent = thisDay.add(5, 'day').format('MMMM DD');
}


// begin code
//after page loads display current date, time, 
//and previous cities
//Run interval for clock
$(document).ready(function () {
    displayDate.textContent = thisDay.format('MMMM DD, YYYY  hh:mma');
    var timeInterval = setInterval (function() {
        var thisDay = dayjs();
        displayDate.textContent = thisDay.format('MMMM DD, YYYY  hh:mma');
    }, 1000);
 loadPrev();
});

//Load previous cities searched list
function loadPrev(){
var prevList=JSON.parse(localStorage.getItem('jsonList')) || [];
for (i=7; i > -1; i-- ) {
    var citList = document.getElementById("cit"+i);
    citList.textContent = prevList[i];
}}

// When GO is clicked, add city to previous
// and get new city data
searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if (searchCity.value === ""){
        emptyEl.textContent="Field cannot be empty";
        return;
    }else{
    emptyEl.textContent="";
    getCityData();
}})
//When a previous city is clicked, display its data
pickAcity.addEventListener('click',buttonClick);

//Previous city select function
function buttonClick(event) {
    var pCitTemp = event.target.getAttribute('id');
    pCity = document.getElementById(pCitTemp);
    if (pCity) {
        searchCity.value = pCity.textContent;
        emptyEl.textContent="";
        getCityData();
    }
  };