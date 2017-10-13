// nb baseline changes in different decades so make a note of this somewhere

var data = [{
    year: 1990,
    value: 21,
    baseline: "of 1990 emissions",
    countries: 20,
    type: "Peaked"
},{
    year: 2000,
    value: 20,
    baseline: "of 2000 emissions",
    countries: 34,
    type: "Peaked"
},{
    year: 2010,
    value: 36,
    baseline: "of 2010 emissions",
    countries: 46,
    type: "Peaked"
},{
    year: 2020,
    value: 40,
    baseline: "of 2010 emissions",
    countries: 51,
    type: "Will peak"
},{
    year: 2030,
    value: 60,
    baseline: "of 2010 emissions",
    countries: 58,
    type: "Will peak"
    
},
{
    year: 2040,
    value: 0,
    baseline: "",
    countries: 0,
    type: "Unknown"

}
]

// set width and height constants

var margin = {top: 30, right: 80, bottom: 30, left: 30},
    width = 1400 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom;

// set the ranges

var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define scales

var xScale = d3.scaleLinear()
.domain([1990, 2050]) // input
.range([0, width]); // output

var yScale = d3.scaleLinear()
.domain([0, 100]) // input 
.range([height, 0]); // output 

var fillColor = d3.scaleOrdinal()
.domain(['Peaked', 'Will peak', 'Unknown'])
.range(['#ade2ea', '#999999', '#f3f3f3']);

// define the line
var line = d3.line()
.x(function(d) { return xScale(d.year) + margin.left; })
.y(function(d) { return yScale(d.value) + margin.top; })
.curve(d3.curveStepAfter);     //apply stepping to the line


// append svg and tooltip

var svg = d3.select("#step-chart").append("svg")
.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
.attr("preserveAspectRatio", "xMidYMid meet")
.append("g");

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

// call the x axis in a group tag

svg.append("g")
.attr("class", "x axis")
.attr("transform", 'translate(' + margin.left + ',' + (margin.top + height) + ')')
.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// call the y axis in a group tag
svg.append("g")
.attr("class", "y axis")
.attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')
.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// add bar chart

//get the width of each bar 
var barWidth = width / data.length;

svg.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return xScale(d.year) + margin.left; })
.attr("width", barWidth)
.attr("y", function(d) { return yScale(d.value) + margin.top; })
.attr("height", function(d) { return height - yScale(d.value); })
.style("fill", function(d) { return fillColor(d.type)})
.on("mousemove", function(d){
    tooltip
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 70 + "px")
      .style("display", "inline-block")
      .html((d.value) + "% <br>" + (d.baseline));
})
.on("mouseout", function(d){ tooltip.style("display", "none")});

// Append the path, bind the data, and call the line generator 
svg.append("path")
.datum(data) // Binds data to the line 
.attr("class", "line") // Assign a class for styling 
.attr("d", line)
.attr("fill", "none"); // calls the line generator 



