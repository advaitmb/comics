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


  //Circle annotation examples
  const circleAnnotations_powers = [
    {
      note: {
        title: "How to read",
        label: "This is the percent difference between the percentages of male and female characters with this power, not the percent of males with the power"
      },
      x: x(0.47),         
      y: y('Objects'), 
      dx: dx(0.35),
      dy: 0,
      subject: {
        radius: 15,        
        radiusPadding: 0 
      }
    }
  ]
  const makeCircleAnnotations_powers = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCircle)  
    .annotations(circleAnnotations_powers)
  svg.append("g")
      .attr("id", "read_anno")
      .attr("class", "annotation-group")
      .call(makeCircleAnnotations_powers) 


  //Rectangle annotation examples
  const rectangleAnnotations_powers = [
    {
      note: {
        title: "Emotional appeal",
        label: "Powers of the mind are possesed disproportionately by female characters"
      },
      x: x(-2.10),
      y: y("Mentality-based powers")+20,
      dx: dx(0.75),
      dy: 0,
    }
  ]
  const makeRectangleAnnotations_powers = d3.annotation()
    .editMode(false)
    .type(d3.annotationXYThreshold)      
    .annotations(rectangleAnnotations_powers)
  svg.append("g")
      .attr("id", "emotion_anno")
      .attr("class", "annotation-group")
      .call(makeRectangleAnnotations_powers)


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
          .html("<span class='tk-atlas small'>" + d.power + "</span>" + "<br><hr>Percent difference: " + Math.abs(d.perdiffMF*100).toFixed(1) + "%<br>Total Characters: " + d.total);
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
      .style('fill', "white");
  });

});


//BUTTON FUNCTIONS

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
} //end function powerR();


  function normR() {
  d3.csv("powerGender.csv", function(error, data) {
    if (error) throw error;

  d3.selectAll('.dot2') // move the circles
    .transition().duration(500)
    .delay(function (d,i) { return i*2})
    .attr("r", 10)
  })
} //end function normR();


//BUTTONS

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
