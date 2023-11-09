var margin = { top: 0, left: 0, right: 0, bottom: 0 },
    height = 1000,
    width = 900;

var svg = d3.select("#map")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("id", "svg_id");

var prjctn = d3.geoNaturalEarth1()
    .translate([width / 2, height / 2])
    .scale(5000)
    .center([-2, 55])
var path = d3.geoPath().projection(prjctn);

var citySlider = document.getElementById("citySlider");
var sliderValue = document.getElementById("sliderValue");

// Function to update the slider value display
citySlider.oninput = function () {
    sliderValue.textContent = this.value;
    svg.selectAll(".towns").remove();
    svg.selectAll(".city_name").remove();
    loadtownsandCities();

};


// Creating MAP of UK
d3.json('./global.json', function (error, data) {
    console.log(data);

    svg.selectAll(".country")
        .data(data.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .append('title')
        .text("Great Britain");
});





// Loading and displaying cities
function loadtownsandCities() {
    // UK cities data feed loading
    d3.json('http://34.38.72.236/Circles/Towns/500', function (error, data) {
        if (error) throw error;

        // random generator for shuffling data
        shuffle(data);

        // Taking shuffled data based on the slider value
        var selectedData = data.slice(0, citySlider.value);

        // Creating circles for the selected cities
        var cities = svg.selectAll('circle')
            .data(selectedData)
            .enter()
            .append('circle')
            .attr("class", "towns")
            .attr("transform", function (d) {
                return "translate(" + -20 / 2 + "," + -20 / 2 + ")";
            })
            .attr("xlink:href", function (d) {
                                
            })
            .attr("r", 5)
            .attr("cx", function (d) {
                var coords = prjctn([d.lng, d.lat]);
                return coords[0];
            })
            .attr("cy", function (d) {
                var coords = prjctn([d.lng, d.lat]);
                return coords[1];
            })
            .append('title') // Add a title element for the tooltip
            .text(function (d) {
                return "City: " + d.Town + "\nPopulation: " + d.Population + "\nLatitude: " + d.lat + "\nLongitude: " + d.lng + "\nCounty: " + d.County;
            });

        // Create labels for the selected cities
        svg.selectAll('.city_name')
            .data(selectedData)
            .enter()
            .append('text')
            .attr('class', 'city_name')
            .attr("x", function (d) {
                var coords = prjctn([d.lng, d.lat, d.Town]);
                return coords[0];
            })
            .attr("y", function (d) {
                var coords = prjctn([d.lng, d.lat, d.Town]);
                return coords[1];
            })
            .text(function (d) {
                return d.Town;
            })
            .attr('dx', '2')
                .attr('dy', '-6');
    });
}

// shuffle an array randomly
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Load and display cities when the page loads
loadtownsandCities();

// Add an event listener to the "Reload" button
document.getElementById("reloadButton").addEventListener("click", function () {
    // Clear existing cities and reload a new set
    svg.selectAll(".towns").remove();
    svg.selectAll(".city_name").remove();
    loadtownsandCities();
});

