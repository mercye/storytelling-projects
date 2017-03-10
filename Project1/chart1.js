(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 400 - margin.top - margin.bottom,
    width = 1200 - margin.left - margin.right;

  // var svg1 = d3.select("svg");

  var svg = d3.select("#chart1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var colorScale = d3.scaleOrdinal()
    .range(['#074F57','#077187', '#74A57F', '#9ECE9A', '#E4C5AF', '#DE6B48', '#E5B181', '#F4B9B2', '#DAEDBD', '#7DBBC3', '#6096BA'])

    // var ordinal = d3.scaleOrdinal()
    //   .domain(['Education','Health','Water','Civil Society', 'Trans/Comm', 'Energy', 'Banking/Business', 'Agriculture/Env', 'Food', 'Emergeny Disaster Relief', 'Administrative'])
    //   .range(['#074F57','#077187', '#74A57F', '#9ECE9A', '#E4C5AF', '#DE6B48', '#E5B181', '#F4B9B2', '#DAEDBD', '#7DBBC3', '#6096BA'])

  var xPositionScale = d3.scalePoint()
    .domain(['Afghanistan','Pakistan','Haiti','Iraq','Ethiopia'])
    .range([0, width])
    .padding(0.5);

    // var legendOrdinal = d3.legendColor()
    //   //d3 symbol creates a path-string, for example
    //   //"M0,-8.059274488676564L9.306048591020996,
    //   //8.059274488676564 -9.306048591020996,8.059274488676564Z"
    //   .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
    //   .shapePadding(10)
    //   .scale(ordinal);


  var radius = 100;

  var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

  var pie = d3.pie()
    .value(function(d) {
      return d.year_purpose_total;
    })
    .sort(null);

  d3.queue()
    .defer(d3.csv, "data/topfive.csv")
    .await(ready)

  function ready(error, datapoints) {
    var nested = d3.nest()
      .key(function(d) {
        return d.recipient;
      })
      .entries(datapoints);

    // svg1.append("g")
    //     .attr("class", "legendOrdinal")
    //     .attr("transform", "translate(20,20)");
    //
    // svg1.select(".legendOrdinal")
    //   .call(legendOrdinal);

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
      })
  }
})();
