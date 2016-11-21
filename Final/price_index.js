(function() {
  var height = 400,
      width = 700;

  var svg = d3.select("#USA_vs_others")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");

  // var radiusScale = d3.scaleSqrt()
  //   .domain([0, 10])
  //   .range([0.1, 5])

  d3.queue()
    .defer(d3.json, "world.topojson")
    //.defer(d3.csv, "all_month.csv")
    .await(ready)

  function ready(error, world) {

    var projection = d3.geoMercator()
      .translate([width/2, height/2])
      .scale([100]);

    var path = d3.geoPath()
      .projection(projection);

    var countries = topojson.feature(world, world.objects.countries).features;

      svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d){
          return d.properties.name.replace(" ", "-");
        })
        .attr("stroke", "black")
        .attr("stroke-width", 0.3)
        .attr("opacity", 0.5)
        .attr("fill", "gray")
        .on("mouseover", function(){
          d3.select(this)
            .attr("opacity", 0.6)
            console.log(this.id)})
        .on("mouseout", function(){
          d3.select(this)
            .attr("opacity", 0.5)})

    var usaCenter = d3.select("#United-States")
      .centroid()

    console.log(usaCenter)

    //console.log(data)

  }
})();
