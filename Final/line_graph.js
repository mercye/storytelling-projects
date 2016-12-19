// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 20, bottom: 30, left: 50},
//     width = 700 - margin.left - margin.right,
//     height = 200 - margin.top - margin.bottom;

// parse the date / time
// var parseTime = d3.timeParse("%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
  .curve(d3.curveCatmullRom)
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Annual); });

var svg = d3.select("#line_graph")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 400")
  .append("g")
  .classed("svg-content-reponsive", true);

// Get the data
d3.csv("apparel.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    //format year
      d.Year  = +d.Year_n;
      d.Annual = +d.Annual;
  })

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([90, 140]);

  // Add the valueline path
  var path = svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "blue");

  var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

  // X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
