// set the dimensions and margins of the graph
var margin = {top:120, right:120, bottom:130, left:150},
    width = 700 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// parse the date / time
// var parseTime = d3.timeParse("%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
  .curve(d3.curveCatmullRom)
    .x(function(d) { return x(d.Time); })
    .y(function(d) { return y(d.Balance); });

var svg = d3.select("#line_graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("exports_imports_china.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    //format year
      d.Time  = +d.Time;
      d.Balance = +d.Balance;
  })

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([115, 130]);

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
