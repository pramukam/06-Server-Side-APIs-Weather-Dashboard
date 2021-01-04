var cities = JSON.parse(localStorage.getItem("cities"))||[];
    
cities.forEach(element => {
     console.log(element)

     var newP = $("<p>");
        newP.addClass('border checking')
        newP.text(element);
        $('#cityH').append(newP) 
     
 });

// User click the search button

 $('button').click(function () {
    
 var cityName=$('#cityName').val().toUpperCase();
 var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid=70b3e24b2d908843ccaa60ae9e97e68f";
 
 
 $.ajax({
     url:queryURL,
     method:'GET'
 }).then(function (response) {
    if (cities.indexOf(cityName)===-1) {
        console.log(response.city.name);
        // cities.push(response.city.name)
     cities.push(cityName)
     localStorage.setItem("cities", JSON.stringify(cities));
     
     var newP = $("<p>");
        newP.addClass('border checking')
        // newP.text(response.city.name); 
        newP.text(cityName);
        $('#cityH').append(newP)  
    } 
    
    
  currentWeather(cityName);
  fiveDayForcast(cityName);

  $("#cityName").val('');
  
 })
})

// To display current weather

function currentWeather(cityName) {
    
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=70b3e24b2d908843ccaa60ae9e97e68f"

    console.log(queryURL);

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function (response) {
        console.log(response)
        $("#currentWeatherD").empty()

        var infoDiv = $('<div>');
            infoDiv.attr('id','currentInfoDiv')
            infoDiv.addClass('border mb-3 p-3')
            $("#currentWeatherD").append(infoDiv)
        var newH4city = $('<h4>')
            newH4city.text(response.name+"   "+ "("+moment.unix(response.dt).format("MM/DD/YYYY")+")")
            $(infoDiv).append(newH4city)

        var newImg = $('<img>');
            newImg.attr('src',"http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png").addClass('img-fluid')
            $(newH4city).append(newImg);

        var newH4 = $('<p>');
            newH4.text("Temperature: "+response.main.temp+" ℉")
            $(infoDiv).append(newH4)

        var newH4 = $('<p>');
            newH4.text("Humidity: "+response.main.humidity+"%")
            $(infoDiv).append(newH4)

        var newH4 = $('<p>');
            newH4.text("Wind Speed: "+response.wind.speed+" MPH")
            $(infoDiv).append(newH4)

        
    })

}

// To display five day forcast

function fiveDayForcast(cityName) {
    

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid=70b3e24b2d908843ccaa60ae9e97e68f"

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function (response) {
        var lat = response.coord.lat
        console.log(lat);
        var lon = response.coord.lon
        console.log(lon);

        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=current,minutely,hourly,alerts&units=imperial&appid=70b3e24b2d908843ccaa60ae9e97e68f"
    console.log("....................................")
    console.log(queryURL2);
    
    $.ajax({
        url:queryURL2,
        method:"GET"
    }).then(function (response2) {

        var forcastDisDiv = $('<div>');
            $('#currentWeatherD').append(forcastDisDiv);
            forcastDisDiv.addClass('row forcastDisp')
            
        var fiveDay = $('<h4>');
            fiveDay.text('5-Day Forcast:');
            forcastDisDiv.append(fiveDay);


        for ( i = 1; i < 6; i++) {
            console.log(response2.daily[i].dt)
        console.log(moment.unix(response2.daily[i].dt).format("MM/DD/YYYY"))
        
        var iconImg = response2.daily[i].weather[0].icon;
        console.log(iconImg);
        
        
        var newDiv = $('<div>');
            newDiv.addClass('col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6 card text-white bg-primary mx-2 mb-2')
            
        var newH6 = $('<h6>');
            newH6.text(moment.unix(response2.daily[i].dt).format("MM/DD/YYYY"));
        var newImg = $('<img>');
            newImg.attr('src',"http://openweathermap.org/img/wn/"+iconImg+"@2x.png").addClass('img-fluid')    
        var newP = $('<p>'); 
            newP.text("Temp: "+response2.daily[i].temp.day + " °F");
        var newP1 = $('<p>');
            newP1.text("Humidity: "+response2.daily[i].humidity+"%")  
            
            $(newDiv).append(newH6,newImg,newP,newP1)
            $(forcastDisDiv).append(newDiv)

            
        }

        

    // UVI index

        var newUvi = $('<p>');
            newUvi.text("UV Index: "+response2.daily[0].uvi)
            newUvi.attr("style","width:110px;color:white")
            $('#currentInfoDiv').append(newUvi)

            console.log(typeof(response2.daily[0].uvi))
            
            if (response2.daily[0].uvi < 3) {
                newUvi.addClass("bg-success");
            } else if (response2.daily[0].uvi < 7) {
                newUvi.addClass("bg-warning");
            } else {
                newUvi.addClass("bg-danger");
            }
    })

    })
    
}

// user click on a search history city

$("#cityH").on("click", "p", function () {
    console.log($(this).text())

    currentWeather($(this).text());
    fiveDayForcast($(this).text());
    
});
