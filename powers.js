(function() {

var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var firstXDomain = function(d) { return d.per_females }
var firstYDomain = function(d) { return d.per_males }

var zoomXDomain = function(d) { if(d.per_females<5) return d.per_females }
var zoomYDomain = function(d) { if(d.per_males<5) return d.per_males }

var splitXDomain = [0,11]
var splitYDomain = [-90,90]
var splitYDomainZoom = [-600,600]

var catColors = function(d) { return color(d.category_wiki); }


d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  data.sort(function(x, y){
   return Math.abs(d3.ascending(x.perdiffMF, y.perdiffMF));
  });

  data.forEach(function(d) {
    d.per_males = +d.per_males;
    d.per_females = +d.per_females;
    d.perdiffMF = +d.perdiffMF
  });

  x.domain(d3.extent(data, firstXDomain)).nice();
  y.domain(d3.extent(data, firstYDomain)).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Percent of females");

  svg.append("g")
      .attr("class", "y axis")
      .attr("id", "yAxis")
      .style("opacity", 1)
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percent of males")

  svg.selectAll(".powerDot")
      .data(data)
    .enter().append("circle")
      .attr("class", "powerDot")
      .attr("r", 10)
      // .attr("r", function(d){return Math.abs(d.perdiffMF)/4})
      .attr("cx", function(d) { return x(d.per_females); })
      .attr("cy", function(d) { return y(d.per_males); })
      .style("opacity", 0.8)
      .style("stroke-width", 0.5)
      .style("fill", catColors)
      // .style("fill", "grey")

      .on('mouseover', function (d) {
          var section = d3.select(this);
          section.style("opacity", 0.5)
                 .style("stroke-width", 1.5);
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .html(d.power + "<br>" + Math.round(d.per_females).toFixed(1) + "% of female<br>" + Math.round(d.per_males).toFixed(1) + "% of males"  );
           d3.select('#tooltip').classed('hidden', false);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section.style("opacity", 0.8)
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true);
        });


      //   svg.selectAll(".foo")
      //   .data(data)
      //  .enter().append("text")
      //   .attr("class", "foo")
      //   .attr("font-size", 12)
      //   .attr("x", function(d) {
      //     if (d.per_females >= 7) {return x(d.per_females)}
      //   })
      //   .attr("y", function(d) {
      //       if (d.per_males >= 7) {return x(d.per_males)}
      //     })
      //   .attr('text-anchor', 'start')
      //   .text(function(d) { return d.power});

});












// Functions for scrolling steps


// Function to splitPowers
function splitPowers(){

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 1);


d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.category_wiki; }));
  y.domain(splitYDomain).nice();

d3.select("#yAxis")
  .transition().duration(1000)
  .call(yAxis)


  d3.select("#xAxis")
    .transition().duration(1000)
    .attr("transform", "translate(" + y(100) + ",215)")
    .style("opacity", 0)
    .call(xAxis)


  d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*10})
      .attr("cx", function(d){return x(d.category_wiki); })
      .attr("cy", function(d) { return y(d.perdiffMF); })

});

} //end splitPowers()


// Function to zoom out on powers
function zoomPowers(){

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 1);


d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.category_wiki; }));
  y.domain(splitYDomainZoom).nice();

d3.select("#yAxis")
  .transition().duration(1000)
  .call(yAxis)


  d3.select("#xAxis")
    .transition().duration(1000)
    // .attr("transform", "translate(" + y(100) + ",215)")
    .style("opacity", 0)
    .call(xAxis)


  d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*10})
      .attr("cx", function(d){return x(d.category_wiki); })
      .attr("cy", function(d) { return y(d.perdiffMF); })

});

} //end splitPowers()






// Function to update the axes
function updateDomain(thisXDomain, thisYDomain){

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, thisXDomain)).nice();
  y.domain(d3.extent(data, thisYDomain)).nice();


  d3.select("#xAxis")
    .transition().duration(1000)
    .attr("transform", "translate(0," + height + ")")
    .style("opacity", 1)
    .call(xAxis)

  d3.select("#yAxis")
    .transition().duration(1000)
    .call(yAxis)

  d3.selectAll('.powerDot') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*3})
      .attr("cx", function(d) { return x(d.per_females); })
      .attr("cy", function(d) { return y(d.per_males); })

});

} //end updateDomain function


// Function to update the bubbles sizes
function updateR(){

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

  d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*3})
      .attr("r", function(d){return Math.abs(d.perdiffMF)/4})

});

} //end updateR function



$( "#zoomPowers" ).click(function() {
 updateDomain(zoomXDomain, zoomYDomain)
});





init()
})()
