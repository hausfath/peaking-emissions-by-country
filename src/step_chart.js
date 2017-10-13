// nb baseline changes in different decades so make a note of this somewhere

var data = [{
    year: 1980,
    value: 21,
    baseline: "of 1990 emissions",
    countries: 20
},{
    year: 1990,
    value: 21,
    baseline: "of 1990 emissions",
    countries: 20
},{
    year: 2000,
    value: 20,
    baseline: "of 2000 emissions",
    countries: 34
},{
    year: 2010,
    value: 36,
    baseline: "of 2010 emissions",
    countries: 46
},{
    year: 2020,
    value: 40,
    baseline: "of 2010 emissions",
    countries: 51
},{
    year: 2030,
    value: 60,
    baseline: "of 2010 emissions",
    countries: 58
}
]

// set width and height constants

width = 1550;

height = 500;

// set the ranges

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define scales

var xScale = d3.scaleLinear()
.domain([1980, 2040]) // input
.range([0, width]); // output

var yScale = d3.scaleLinear()
.domain([0, 100]) // input 
.range([height, 0]); // output 

// define the line
var line = d3.line()
.x(function(d) { return xScale(d.year); })
.y(function(d) { return yScale(d.value); })
.curve(d3.curveStepBefore);     //apply stepping to the line

var area = d3.area()
.x(function(d) { return xScale(d.year); })
.y1(function(d) { return yScale(d.value); })
.curve(d3.curveStepBefore);


area.y0(y(0));


// append svg and tooltip

var svg = d3.select("#step-chart").append("svg")
.attr("viewBox", "0 0 " + (width) + " " + (height))
.attr("preserveAspectRatio", "xMidYMid meet")
.append("g");

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

// call the x axis in a group tag

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// call the y axis in a group tag
svg.append("g")
.attr("class", "y axis")
.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// add the area before line

svg.append("path")
.datum(data) // Binds data to the line 
.attr("class", "area") // Assign a class for styling 
.attr("d", area); // calls the line generator 

// Append the path, bind the data, and call the line generator 
svg.append("path")
.datum(data) // Binds data to the line 
.attr("class", "line") // Assign a class for styling 
.attr("d", line)
.attr("fill", "none")
.on("mousemove", function(d){
    tooltip
      .style("left", d3.event.pageX - 50 + "px")
      .style("top", d3.event.pageY - 70 + "px")
      .style("display", "inline-block")
      .html((d.value) + "<br>" + (d.baseline));
})
.on("mouseout", function(d){ tooltip.style("display", "none");});; // calls the line generator 

// Appends a circle for each datapoint 
svg.selectAll(".dot")
.data(data)
.enter().append("circle") // Uses the enter().append() method
.attr("class", "dot") // Assign a class for styling
.attr("cx", function(d) { return xScale(d.year) })
.attr("cy", function(d) { return yScale(d.value) })
.attr("r", 5);
