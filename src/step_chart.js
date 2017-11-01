// nb baseline changes in different decades so make a note of this somewhere

var data = [{
    year: 1985,
    label: 1990,
    value: 0.102,
    countries: 18,
    type: "Peaked"
},{
    year: 1995,
    label: 2000,
    value: 0.146,
    countries: 33,
    type: "Peaked"
},{
    year: 2005,
    label: 2010,
    value: 0.364,
    countries: 49,
    type: "Peaked"
},{
    year: 2015,
    label: 2020,
    value: 0.404,
    countries: 52,
    type: "Will peak"
},{
    year: 2025,
    label: 2030,
    value: 0.598,
    countries: 57,
    type: "Will peak"
}]

var data2 =[
    {
        year: 1985,
        value: 0.102,
    },{
        year: 1995,
        value: 0.102,
    },{
        year: 1995,
        value: 0.146,
    },{
        year: 2005,
        value: 0.146,
    },
    {
        year: 2005,
        value: 0.364,
    },
    {
        year: 2015,
        value: 0.364,
    },{
        year: 2015,
        value: 0.404,
    },
    {
        year: 2025,
        value: 0.404,
    },
    {
        year: 2025,
        value: 0.598,
    },
    {
        year: 2035,
        value: 0.598,
    }


]

// set width and height constants

var margin = {top: 40, right: 80, bottom: 50, left: 50},
    width = 1400 - margin.left - margin.right,
    height = 340 - margin.top - margin.bottom;

// set the ranges

var x = d3.scaleBand().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define scales

var xScale = d3.scaleLinear()
.domain([1985, 2045]) // input
.range([0, width]); // output

var yScale = d3.scaleLinear()
.domain([0, 1]) // input 
.range([height, 0]); // output 

var fillColor = d3.scaleOrdinal()
.domain(['Peaked', 'Will peak', 'Unknown'])
.range(['#ade2ea', '#999999', '#f3f3f3']);

// define the line
var line = d3.line()
.x(function(d) { return xScale(d.year) + margin.left; })
.y(function(d) { return yScale(d.value) + margin.top; });
//.curve(d3.curveStepAfter);     //apply stepping to the line


// append svg and tooltip

var svg = d3.select("#step-chart").append("svg")
.attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
.attr("preserveAspectRatio", "xMidYMid meet")
.append("g");

var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("display", "none");

// call the x axis in a group tag

svg.append("g")
.attr("class", "x-axis")
.attr("transform", 'translate(' + margin.left + ',' + (margin.top + height) + ')')
.call(d3.axisBottom(xScale)
    .ticks(6)
    .tickFormat(d3.format("d"))); // Create an axis component with d3.axisBottom

// call the y axis in a group tag
svg.append("g")
.attr("class", "y-axis")
.attr("transform", 'translate(' + margin.left + ',' + margin.top + ')')
.call(d3.axisLeft(yScale) // Create an axis component with d3.axisLeft
    .ticks(4, "%")); 

// add bar chart

//get the width of each bar 
var barWidth = width / (data.length + 1);

// limit tooltip to one decimal place

var formatDecimal = d3.format(".1f");

svg.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", function(d) { return xScale(d.year) + margin.left; })
.attr("width", barWidth)
.attr("y", function(d) { return yScale(d.value) + margin.top; })
.attr("height", function(d) { return height - yScale(d.value); })
.style("fill", function(d) { return fillColor(d.type)})
.on("mousemove", showDetail)
.on("mouseout", hideDetail);

// Append the path, bind the data, and call the line generator 
svg.append("path")
.datum(data2) // Binds data to the line 
.attr("class", "line") // Assign a class for styling 
.attr("d", line)
.attr("fill", "none"); // calls the line generator 


// add x axis label

svg.append("g")
    .attr("class", "label")
    .append("text")
    .attr("x", (width + 50))
    .attr("y", (height*1.3))
    .style("text-anchor", "end")
    .text("Year");


svg.append("g")
    .attr("class", "label")
    .append("text")
    .attr("x", (-30))
    .attr("y", (height/3.1))
    .style("text-anchor", "end")
    .text("Emissions covered**")
    .attr("transform", "rotate(-90)");

// bit of a hacky way of introducing a line break, but probably ok since the dimensions aren't going to change

// svg.append("g")
//     .attr("class", "label")
//     .append("text")
//     .attr("x", (0))
//     .attr("y", (height/2.6))
//     .style("text-anchor", "end")
//     .text("have peaked or committed to peak")
//     .attr("transform", "rotate(-90)");


/*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */

   // tooltip for mouseover functionality

   var tooltip = floatingTooltip('gates_tooltip', 200);
   
   
     function showDetail(d) {
       // change outline to indicate hover state.
       d3.select(this)
       .attr('stroke', 'black')
       .attr('opacity', 0.7);
   
       var content = '<h3>By ' +
                       d.label +
                     '</h3>' +
                     '<span class="name">Emissions covered**: </span><span class="value">' +
                     (formatDecimal((d.value)*100)) +
                     '%</span><br/>' +
                     '<span class="name">Countries peaked: </span><span class="value">' +
                     d.countries +
                     '</span>';
   
       tooltip.showTooltip(content, d3.event);
     }
   
     /*
      * Hides tooltip and resets styling on mouse mouseOut
      */
     function hideDetail(d) {
       // reset outline
       d3.select(this)
         .attr('stroke', '0px');
   
       tooltip.hideTooltip();
     }

// Animate annotation

var t = d3.transition()
.delay(3500)
.duration(700)
.ease(d3.easeLinear)
.on("start", function(d){ console.log("transiton start") })
.on("end", transitionEnd);

var annotationData = [
    {
        year: 2030,
        value: 0.647
    },
    {
        year: 2030,
        value: 0.78
    },
    {
        year: 2025,
        value: 0.78
    }
]

var annotation = svg.selectAll(".annotation-path")
                    .data([annotationData]);

annotation.enter().append("path")
.classed("annotation-path", true)
.merge(annotation)
.attr("d", line)
.attr("fill", "none")
.attr("stroke-dasharray", function(d){ return this.getTotalLength() })
.attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

svg.selectAll(".annotation-path")
    .transition(t)
    .attr("stroke-dashoffset", 0);

function transitionEnd () {
    svg.selectAll(".annotation-path")
    .style("stroke-dasharray", ("4, 4"));

    // add text

    svg.append("g")
    .attr("class", "annotation-text")
    .append("text")
    .attr("x", (width/2.2))
    .attr("y", (70))
    .style("text-anchor", "start")
    .text("A further 9 countries responsible");

    svg.append("g")
    .attr("class", "annotation-text")
    .append("text")
    .attr("x", (width/2.2))
    .attr("y", (100))
    .style("text-anchor", "start")
    .text("for 28% of global emissions**");

    svg.append("g")
    .attr("class", "annotation-text")
    .append("text")
    .attr("x", (width/2.2))
    .attr("y", (130))
    .style("text-anchor", "start")
    .text("have committed to peak");

} 




