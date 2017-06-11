(function() {

var margin = {top: 100, right: 50, bottom: 50, left: 10},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([0, height], 1);

var x = d3.scaleLinear()
    .range([width, 0]);


var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#powerSplit_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var catColors = function(d) { return color(d.category_wiki); }


d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.per_males = +d.per_males;
    d.per_females = +d.per_females;
    d.perdiffMF = +d.perdiffMF;
    d.per_fake = +d.per_fake;
  });

  function powersColor(t) {
  var cutoff=100.0;
  t=Math.abs(t)/cutoff;
  if(t>1.0) t=1.0;
  return d3.interpolateYlOrRd(t);
}


  x.domain([150,-150]);
  y.domain(data.map(function(d) { return d.category_wiki; }));


// var lineEnd = 0;

// svg.append("line")
//   .attr("x1", function(){return x(lineEnd)})
//   .attr("y1", -40)
//   .attr("x2", function(){return x(lineEnd)})
//   .attr("y2", height+50)
//   .style("stroke-width", 0.3)
//   .style("stroke", "black")
//   .style("fill", "none")

svg.append("text")
  .attr("class", "small")
  .attr("x", 200)
  .attr("y", -30)
  .text("<--- More female");

svg.append("text")
  .attr("class", "small")
  .attr("x", width-300)
  .attr("y", -30)
  .text("More male --->");

svg.append("g")
  .attr("class", "x axis")
  .attr("id", "xAxis")
  .attr("transform", "translate(0, -50)")
  .call(d3.axisTop(x));

svg.append("g")
  .attr("class", "powerYAxis")
  .call(customYAxis)

function customYAxis(g) {
  g.call(d3.axisLeft(y));
  g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
  g.selectAll(".tick text").attr("x", 405).attr("dy", -35);
}


  svg.selectAll(".dot2")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot2")
      .attr("r", 10)
      // .attr("r", function(d){return Math.abs(d.perdiffMF)/4})
      .attr("cx", function(d) { return x(d.perdiffMF); })
      .attr("cy", function(d) { return y(d.category_wiki); })
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 0.5)
      .style("fill", function(d) { return powersColor(d.perdiffMF); })
      .on('mouseover', function (d) {
          var section = d3.select(this);
          section.style("stroke", "black")
                 .style("stroke-width", 1.5);
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .html(d.power + "<br>% diff: " + Math.round(d.perdiffMF).toFixed(1) + "%<br>Female: " + d.per_females + "%<br>Male: " + d.per_males + "%" );
           d3.select('#tooltip').classed('hidden', false);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section.style("stroke", "white")
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true); 
        });


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


});




function outlier(){

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

x.domain([700,-700]).nice();

d3.select("#xAxis")
  .transition().duration(500)
  .call(d3.axisTop(x))

 d3.selectAll('circle') // move the circles
      .transition().duration(500)
      // .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.perdiffMF); })
      .attr("cy", function(d) { return y(d.category_wiki); })

});

} //end function outlier();



$( "#outliers" ).click(function() {
 outlier();
});


























// init()
})()
