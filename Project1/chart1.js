(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 1100 - margin.left - margin.right;

  var svg = d3.select("#chart1a")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal()
    .range(['#074F57','#077187', '#74A57F', '#9ECE9A', '#E4C5AF', '#DE6B48', '#E5B181', '#F4B9B2', '#DAEDBD', '#7DBBC3', '#6096BA'])

  var xPositionScale = d3.scalePoint()
    .domain(['Afghanistan','Pakistan','Haiti','Iraq','Ethiopia'])
    .range([0, width])
    .padding(0.5);

  var radius = 100;

  var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  var pie = d3.pie()
    .value(function(d) {
      return d.year_purpose_total;
    })
    .sort(null);

  var tooltip = d3.select('#chart1a')
   .append('div')
   .attr('class', 'tooltip');

   tooltip.append('div')
     .attr('class', 'categories');

  d3.queue()
    .defer(d3.csv, "data/topfive.csv")
    .await(ready)

  function ready(error, datapoints) {
    var nested = d3.nest()
      .key(function(d) {
          return d.recipient;
      })
      .entries(datapoints);

    var charts = svg.selectAll(".pie-charts")
      .data(nested)
      .enter().append("g")
      .attr("transform", function(d) {
        var yPos = 200
        var xPos = xPositionScale(d.key);
        return "translate(" + xPos + "," + yPos + ")"
      })

    charts.append("text")
      .attr("x", 0)
      .attr("y", 160)
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.key
      })

    charts.each(function(d) {

        var projectData = d.values;
        var g = d3.select(this);

        g.selectAll("path")
          .data(pie(projectData))
          .enter().append("path")
          .attr("d", arc)
          .attr("fill", function(d) {
            return colorScale(d.data.categories);
          })
          .on('mouseover', function(d) {
              tooltip.select('.categories').html(d.data.categories);
              tooltip.style('display', 'block');
           })
          .on('mouseout', function() {
              tooltip.style('display', 'none');
          });
      })
  }
})();
