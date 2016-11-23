(function(){
    var width = 700;
    var height = 200;

    var svg = d3.select("#line")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

      // .attr("id", "line-graph")
      // .attr("xmlns", "http://www.w3.org/2000/svg");

    var x = d3.scaleTime().domain([0, 10]).range([0, 700]);
    var y = d3.scaleLinear().domain([0, 10]).range([10, 290]);
    var parseTime = d3.timeParse("%y");

    var line = d3.line()
      .interpolate("cardinal")
      .x(function(d) {return x(d.Year);}
      .y(function(d) {return y(d.Annual_norm);})



    d3.queue()
      .defer(d3.csv, "apparel.csv")
      .await(ready)

    function ready(error, data) {

    // format the data
    data.forEach(function(d) {
        d.Year = parseTime(d.Year);
    });

    x.domain(d3.extent(data,function(d){
      return d.Year;}));
    y.domain([0,1.5])

    var path = svg.append("path")
      .attr("d", line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", "2")
      .attr("fill", "none");

    var totalLength = path.node().getTotalLength();
    //
    // // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline);
    //
    // // Add the X Axis
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x));
    //
    // // Add the Y Axis
    // svg.append("g")
    //     .call(d3.axisLeft(y));


    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

    svg.on("click", function(){
      path
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", totalLength);
    })

  }
})();
