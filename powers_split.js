(function() {

var margin = {top: 100, right: 50, bottom: 50, left: 10},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([10, height], 1);

var x = d3.scaleLinear()
    .range([width, 0]);

// Functions for offsetting annotations
function dy(t) {
  return y(t)-y(0);
}
function dx(t) {
  return x(t)-x(0);
}

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
    d.per_males = +d.per_males/100.0;
    d.per_females = +d.per_females/100.0;
    d.perdiffMF = +d.perdiffMF/100.0;
    d.per_fake = +d.per_fake/100.0;
  });

  function powersColor(t) {
  var cutoff=1.0;
  t=Math.abs(t)/cutoff;
  if(t>1.0) t=1.0;
  return d3.interpolateYlOrRd(t);
}

  x.domain([1.50,-1.50]);
  y.domain(data.map(function(d) { return d.category_wiki; }));










  //Threshhold annotation example
  // const thresholdAnnotations = [
  //   // Only a single annotation in this example array
  //   {
  //     note: {
  //       title: "The 50% line",
  //       label: "Only teams above this line have more women members than men"
  //     },
  //     // x,y are the point that the annotation points too
  //     // (by using the functions x() and y() this is done in graph units rather than pixels)
  //     x: x(100),
  //     y: y(0.5),
  //     // dx,dy are how FAR the annotation text is from the point x,y
  //     // (since svg measures the positions from top to bottom [or something], I made a new little routine to make the conversion everytime)
  //     dx: dx(0.15),
  //     dy: dy(0.05),
  //     subject: {
  //       x1: x(0),
  //       x2: x(400)
  //     }
  //   }
  // ]
  // const makeThresholdAnnotations = d3.annotation()
  //   .editMode(false)
  //   .type(d3.annotationXYThreshold)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
  //   .annotations(thresholdAnnotations)
  // svg.append("g")
  //     .attr("class", "annotation-group")
  //     .call(makeThresholdAnnotations) //This needs to call the object made above


  //Circle annotation examples
  const circleAnnotations_powers = [
    // Two annotations in this example array
    {
      note: {
        title: "How to read",
        label: "This is the percent difference between the percentages of male and female characters with this power, not the percent of males with the power"
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(0.47),         //Give x() the percent difference you want (in fractions [from 0 to 1] not percent [0 to 100])
      y: y('Objects'),    //Give y() the name of the power ie 'Divine', 'Elemental and environmental powers', 'Energy manipulation', 'Enhanced physical abilities', 'Enhanced skills', 'Mentality-based powers', 'Objects', 'Physics or reality manipulation', 'Shapeshifting', 'Supernatural physical abilities', 'Energy manipulation', 'Shapeshifting'
      // dx is how FAR the annotation text is from the point x (leave dy=0 for this graph)
      dx: dx(0.35),
      dy: 0,
      subject: {
        radius: 15,         //Size of the the circling
        radiusPadding: 0    //A little gap between the annotation line and the circle
      }
    }
  ]
  const makeCircleAnnotations_powers = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCircle)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(circleAnnotations_powers)
  svg.append("g")
      .attr("id", "read_anno")
      .attr("class", "annotation-group")
      .call(makeCircleAnnotations_powers)      //This needs to call the object made above











  //Rectangle annotation examples
  const rectangleAnnotations_powers = [
    // This is an array of 2 annotations
    {
      note: {
        title: "Emotional appeal",
        label: "Powers of the mind are possesed disproportionately by female characters"
      },
      // x,y are the upper left hand side of the box
      x: x(-2.10),
      y: y("Mentality-based powers")+20,
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(0.75),
      dy: 0,
    }
  ]
  const makeRectangleAnnotations_powers = d3.annotation()
    .editMode(false)
    .type(d3.annotationXYThreshold)      //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(rectangleAnnotations_powers)
  svg.append("g")
      .attr("id", "emotion_anno")
      .attr("class", "annotation-group")
      .call(makeRectangleAnnotations_powers)     //This needs to call the object made above
























































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
  .attr("class", "label")
  .text("<--- More female");

svg.append("text")
  .attr("class", "small")
  .attr("x", width-300)
  .attr("y", -30)
  .attr("class", "label")
  .text("More male --->");

svg.append("g")
  .attr("class", "x axis")
  .attr("id", "xAxis")
  .attr("transform", "translate(0, -50)")
  .call(d3.axisTop(x)
    .tickFormat( function(d){ return d3.format("0.0%")(Math.abs(d)); } ));

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
      // .attr("r", function(d){return Math.abs(d.total)/100})
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
          // .html("<span class='tk-atlas small'>" + d.power + "</span>" + "<br><hr>Percent difference: " + Math.round(d.perdiffMF).toFixed(1) + "%<br>Female: " + Math.round(d.per_females).toFixed(3) + "%<br>Male: " + Math.round(d.per_males).toFixed(3) + "%" );
          .html("<span class='tk-atlas small'>" + d.power + "</span>" + "<br><hr>Percent difference: " + Math.abs(d.perdiffMF*100).toFixed(1) + "%<br>Total Characters: " + d.total);
           d3.select('#tooltip').classed('hidden', false);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section.style("stroke", "white")
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true);
        });

  // d3.selectAll(".tick")
  //       .attr("class", "label");

  d3.selectAll(".tick").each(function(d,i){
    var tick = d3.select(this),
        text = tick.select('text'),
        bBox = text.node().getBBox();

    tick.insert('rect', ':first-child')
      .attr('x', bBox.x - 3)
      .attr('y', bBox.y - 3)
      .attr('height', bBox.height + 6)
      .attr('width', bBox.width + 6)
      .style('fill', "white");
      // .style('fill', "#182a37");
  });


});


function outlier_back(){

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

x.domain([1.50,-1.50]);
y.domain(data.map(function(d) { return d.category_wiki; }));


d3.select("#xAxis")
  .transition().duration(500)
  .call(d3.axisTop(x)
    .tickFormat( function(d){ return d3.format("0.0%")(Math.abs(d)); } ));


 d3.selectAll('.dot2') // move the circles
      .transition().duration(500)
      // .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.perdiffMF); })
      .attr("cy", function(d) { return y(d.category_wiki); })

});

$("#read_anno").delay(500).show(500);
$("#emotion_anno").delay(500).show(500);

} //end function outlier();


function outlier(){

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

x.domain([7.00,-7.00]).nice();


d3.select("#xAxis")
  .transition().duration(500)
  .call(d3.axisTop(x)
    .tickFormat( function(d){ return d3.format("0.0%")(Math.abs(d)); } ));

 d3.selectAll('.dot2') // move the circles
      .transition().duration(500)
      // .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.perdiffMF); })
      .attr("cy", function(d) { return y(d.category_wiki); })

});

$("#read_anno").delay(100).hide(500);
$("#emotion_anno").delay(100).hide(500);

} //end function outlier();








function powerR() {

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

 d3.selectAll('.dot2') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*2})
      .attr("r", function(d){return Math.abs(d.total)/80})

})

}

function normR() {

d3.csv("powerGender.csv", function(error, data) {
  if (error) throw error;

 d3.selectAll('.dot2') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*2})
      .attr("r", 10)
})

}





$( "#outliers" ).click(function() {
 outlier();
 $("#outliers_back").show();
 $( "#outliers").hide();

  $( "#outliers_back").click(function() {
    outlier_back();
    $( "#outliers_back").hide();
    $("#outliers").show();
    })
});

$("#powers_radius").click(function() {
  powerR();
})

$("#norm_radius").click(function() {
  normR();
})

















// init()
})()
