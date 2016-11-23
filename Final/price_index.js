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

//this next part is stolen from http://stackoverflow.com/questions/39899970/how-do-i-draw-an-arrow-between-two-points-in-d3v4

var arrowRadius = 6,
arrowPointRadius = arrowRadius * 2,
arrowPointHeight = arrowRadius * 3,
baseHeight = 30;

// Arrow function
function CurvedArrow(context, index) {
  this._context = context;
  this._index = index;
}
CurvedArrow.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) {
      this._context.closePath();
    }
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y; // jshint ignore:line
    switch (this._point) {
      case 0:
        this._point = 1;
        this._p1x = x;
        this._p1y = y;
        break;
      case 1:
        this._point = 2; // jshint ignore:line
      default:
        var p1x = this._p1x,
          p1y = this._p1y,
          p2x = x,
          p2y = y,

          //Curve figures

          //             mp1
          //              |
          //              | height
          //              |
          // p1 ----------------------- p2
          //
          alpha = Math.floor((this._index - 1) / 2),
          direction = p1y < p2y ? -1 : 1,
          height = (baseHeight + alpha * 3 * arrowPointRadius) * direction,
          c1mx = (p2x + p1x) / 2,
          c1my = (p2y + p1y) / 2,
          m1b = (c1mx - p1x) / (p1y - c1my),
          den1 = Math.sqrt(1 + Math.pow(m1b, 2)),
          // Perpendicular point from the midpoint.
          mp1x = c1mx + height * (1 / den1),
          mp1y = c1my + height * (m1b / den1),

          // Arrow figures
          dx = p2x - mp1x,
          dy = p2y - mp1y,
          dr = Math.sqrt(dx * dx + dy * dy),
          // Normal unit vectors
          nx = dy / dr,
          wy = nx,
          wx = dx / dr,
          ny = -wx,
          ahx = wx * arrowPointHeight,
          ahy = wy * arrowPointHeight,
          awx = nx * arrowPointRadius,
          awy = ny * arrowPointRadius,
          phx = nx * arrowRadius,
          phy = ny * arrowRadius,

          // Start arrow offset.
          sdx = mp1x - p1x,
          sdy = mp1y - p1y,
          spr = Math.sqrt(sdy * sdy + sdx * sdx),
          snx = sdy / spr,
          sny = -sdx / spr,
          sphx = snx * arrowRadius,
          sphy = sny * arrowRadius,

          //             r5
          //r7         r6|\
          // ------------  \
          // ____________  /r4
          //r1         r2|/
          //             r3

          r1x = p1x - sphx,
          r1y = p1y - sphy,
          r2x = p2x - phx - ahx,
          r2y = p2y - phy - ahy,
          r3x = p2x - awx - ahx,
          r3y = p2y - awy - ahy,
          r4x = p2x,
          r4y = p2y,
          r5x = p2x + awx - ahx,
          r5y = p2y + awy - ahy,
          r6x = p2x + phx - ahx,
          r6y = p2y + phy - ahy,
          r7x = p1x + sphx,
          r7y = p1y + sphy,
          mpc1x = mp1x - phx,
          mpc1y = mp1y - phy,
          mpc2x = mp1x + phx,
          mpc2y = mp1y + phy;

        this._context.moveTo(r1x, r1y);
        this._context.quadraticCurveTo(mpc1x, mpc1y, r2x, r2y);
        this._context.lineTo(r3x, r3y);
        this._context.lineTo(r4x, r4y);
        this._context.lineTo(r5x, r5y);
        this._context.lineTo(r6x, r6y);
        this._context.quadraticCurveTo(mpc2x, mpc2y, r7x, r7y);
        this._context.closePath();

        break;
    }
  }
};

var w = 600,
  h = 220;
var t0 = Date.now();

var points = [{
  R: 100,
  r: 3,
  speed: 2,
  phi0: 190
}];
var path = d3.line()
  .curve(function(ctx) {
    return new CurvedArrow(ctx, 1);
  });

//end blatant stackoverflow thievery





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

    var arrow = d3.line()
      .curve(function(ctx){
        return new CurvedArrow(ctx,1)
      })

    var countries = topojson.feature(world, world.objects.countries).features;
    var centroids = countries.map(function(feature){
      //console.log(feature)
      return path.centroid(feature);
    });

      //console.log(typeof(centroids))

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
        .property("centroid", function(d){
          return path.centroid(d);
        })
        .on("mouseover", function(){
          d3.select(this)
            .attr("fill", "blue")
            //console.log(this.centroid)
        })
        .on("mouseout", function(){
          d3.select(this)
            .attr("fill", "gray")})
        .on("click", function(){
          d3.selectAll(".country")
            .attr("fill", "gray");
          d3.select(this)
            .attr("fill", "red");
          console.log(this.centroid)
          svg.append("circle")
            .attr("r", 2)
            .attr("fill", "green")
            .attr("cx", this.centroid[0])
            .attr("cy", this.centroid[1])
        });


    // svg.selectAll(".centroid")
    //   .data(centroids)
    //   .enter().append("circle")
    //   .attr("fill", "none")
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 0.5)
    //   .attr("r", 1)
    //   .attr("cx", function(d){return d[0]})
    //   .attr("cy", function(d){return d[1]})

    var usaCenter = d3.select("#United-States")
    //   .centroid()
    //
    //console.log(usaCenter)

    //console.log(centroids)

  }
})();
