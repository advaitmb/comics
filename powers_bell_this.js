(function() {

var margin = {top: 100, right: 50, bottom: 50, left: 10},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 1);

var x = d3.scale.linear()
    .range([width, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickSize("width");

var svg = d3.select("#powerSplit_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var firstXDomain = function(d) { return d.per_females }
// var firstYDomain = function(d) { return d.per_males }

// var zoomXDomain = function(d) { if(d.per_females<5) return d.per_females }
// var zoomYDomain = function(d) { if(d.per_males<5) return d.per_males }

// var splitXDomain = [0,11]
// var splitXDomain = [-90,90]

var catColors = function(d) { return color(d.category_wiki); }


d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.per_males = +d.per_males;
    d.per_females = +d.per_females;
    d.perdiffMF = +d.perdiffMF;
    d.per_fake = +d.per_fake;
  });


  x.domain([90,-90]).nice();
  y.domain(data.map(function(d) { return d.category_wiki; }));


var lineEnd = 0;

svg.append("line")
  .attr("x1", function(){return x(lineEnd)})
  .attr("y1", -40)
  .attr("x2", function(){return x(lineEnd)})
  .attr("y2", height+50)
  .style("stroke-width", 0.3)
  .style("stroke", "black")
  .style("fill", "none")


svg.append("text")
  .attr("x", 0)
  .attr("y", -10)
  .text("More female");

svg.append("text")
  .attr("x", width-70)
  .attr("y", -10)
  .text("More male");

 

  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, -50)")
      .call(xAxis);
    // .append("text")
    //   .attr("class", "label")
    //   .attr("x", width)
    //   .attr("y", -6)
    //   .style("text-anchor", "end");

  svg.append("g")
      .attr("class", "powerYAxis")
      .call(customYAxis)
    // .append("text")
    //   .attr("class", "label")
    //   .attr("y", 6)
    //   .attr("dy", ".71em")
    //   .style("text-anchor", "end")
    //   .text("")


function customYAxis(g) {
  g.call(yAxis);
  g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
  g.selectAll(".tick text").attr("x", 325).attr("dy", -15);
}


  svg.selectAll(".dot2")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot2")
      .attr("r", 10)
      // .attr("r", function(d){return Math.abs(d.perdiffMF)/4})
      .attr("cx", function(d) { return x(d.perdiffMF); })
      .attr("cy", function(d) { return y(d.category_wiki); })
      .style("opacity", 0.5)
      .style("stroke-width", 0.5)
      .style("fill", catColors)
      // .style("fill", function(d){
      //   if (d.gender == 1) {return "blue"}
      //     else {return "orange"}
      // })
      // .style("fill", "grey")

      .on('mouseover', function (d) {
          var section = d3.select(this);
          section.style("opacity", 1)
                 .style("stroke-width", 1.5);
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .html(d.power + "<br>% diff: " + Math.round(d.perdiffMF).toFixed(1) + "%");
           d3.select('#tooltip').classed('hidden', false);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section.style("opacity", 0.5)
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true); 
        });


 //  svg.selectAll(".dodo")
 //  .data(data)
 // .enter().append("text")
 //  .attr("class", "dodo")
 //  .attr("font-size", 12)
 //  .attr("x", function(d) { 
 //    if (d.gen_per <=0){return x(d.perdiffMF)-15}
 //      else {return x(d.perdiffMF)+15}
 //       })
 //  .attr("y", function(d) { 
 //    if (d.gen_per <=0){return y(d.category_wiki)+4}
 //      else {return y(d.category_wiki)+4}
 //       })
 //  .attr('text-anchor', function(d) {
 //    if (d.perdiffMF <= 0) {return 'end'}
 //      else {return 'start'}
 //    })
 //  .text(function(d) { return d.category_wiki;});


d3.selectAll(".tick").each(function(d,i){
  var tick = d3.select(this),
      text = tick.select('text'),
      bBox = text.node().getBBox();

  tick.insert('rect', ':first-child')
    .attr('x', bBox.x - 3)
    .attr('y', bBox.y - 3)
    .attr('height', bBox.height + 6)
    .attr('width', bBox.width + 6)
    .style('fill', "yellow");      
});


      // Make the dotted lines between the dots

      // var linesBetween = svg.selectAll("lines.between")
      //   .data(data)
      //   .enter()
      //   .append("line");

      // linesBetween.attr("class", "between")
      //   .style("stroke-width", 0.2)
      //   .style("stroke", "black")
      //   .style("fill", "none")
      //   .attr("x1", function(d){return x(d.perdiffMF)})
      //   .attr("y1", function(d){return y(d.category_wiki)})
      //   .attr("x2", function(d){return x(d.per_fake)})
      //   .attr("y2", function(d){return y(d.category_wiki)})

});

init()
})()