(function() {

    var chartDiv_names = document.getElementById("genNames_graph");
    var svg_names = d3.select(chartDiv_names).append("svg");

    function redraw_names() {

    document.querySelector( '#genNames_graph' ).innerHTML = '';


var margin = {top: 70, right: 60, bottom: 50, left: 50},
    width_names = chartDiv_names.clientWidth - margin.left - margin.right;
    height_names = 700 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([10, height_names], 1);

var x = d3.scaleLinear()
    .range([width_names, 0]);

// Functions for offsetting annotations
function dy(t) {
  return y(t)-y(0);
}
function dx(t) {
  return x(t)-x(0);
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg_names = d3.select("#genNames_graph").append("svg")
    .attr("width", width_names + margin.left + margin.right)
    .attr("height", height_names + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per/100.0;
    d.count = +d.count;
    d.per_fake = +d.per_fake/100.0;
  });

  function ascendingFemaleNames(data) {data.sort(function(x, y){
  if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
  else return -1
  });}

  ascendingFemaleNames(data);

  x.domain([0.30,-0.30]);
  y.domain(data.map(function(d) { return d.gen_cat; }));


//ANNOTATIONS 
  const circleAnnotations_girl = [
    {
      note: {
        title: "Girls, not women",
        label: "'Girl' is the third-most common gendered name for a female character. 'Boy' only shows up sixth for males."
      },
      x: x(-.13),         
      y: y('girl'),   
      dx: dx(-.07),
      dy: 0,
      subject: {
        radius: 2,        
        radiusPadding: 40 
      }
    }
  ]
  const makeCircleAnnotations_girl = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCircle)   
    .annotations(circleAnnotations_girl)
  svg_names.append("g")
      .attr("id", "girl_anno")
      .attr("class", "annotation-group")
      .attr("class", "tk-atlas")
      .attr("font-size", 12)
      .call(makeCircleAnnotations_girl)   


  const circleAnnotations_man = [
    {
      note: {
        title: "Men, not boys",
        label: "A full 30% of male characters with gendered names get 'man' in their name. That number is only 6% for 'woman'."
      },
      x: x(.30),        
      y: y('woman'), 
      dx: dx(-.02),
      dy: 50
    }
  ]
  const makeCircleAnnotations_man = d3.annotation()
    .editMode(false)
    .type(d3.annotationCallout)   
    .annotations(circleAnnotations_man)
  svg_names.append("g")
      .attr("id", "man_anno")
      .attr("class", "annotation-group")
      .attr("class", "tk-atlas")
      .attr("font-size", 12)
      .call(makeCircleAnnotations_man) 

// END ANNOTATIONS


  svg_names.append("g")
      .attr("class", "x axis")
      .attr("class", "tk-atlas")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, -50)")
      .call(d3.axisTop(x)
        .tickFormat( function(d){ return d3.format("0.0%")(Math.abs(d)); } )
        .ticks(5));


  // Make the lines between the dots

  var linesBetween = svg_names.selectAll("lines.between")
    .data(data)
    .enter()
    .append("line");

  linesBetween.attr("class", "between")
    .style("stroke-width", 0.5)
    .style("stroke", "black")
    .style("fill", "none")
    .attr("x1", function(d){return x(d.gen_per)})
    .attr("y1", function(d){return y(d.gen_cat)})
    .attr("x2", function(d){return x(d.per_fake)})
    .attr("y2", function(d){return y(d.gen_cat)})


  svg_names.selectAll(".genDot")
      .data(data)
    .enter().append("circle")
      .attr("class", "genDot")
      .attr("r", 10)
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); })
      .style("opacity", 1)
      .style("stroke", function(d){
        if (d.gen_name == "lord"){return "rgb(105,174,68)"}
          else {return "white"}
        })
      .style("stroke-width", function(d){
        if (d.gen_name == "lord") {return 2}
          else {return 0.5}
        })
      .style("fill", function(d){
        if (d.gen_name == "lord" ) {return "white"}
          else if (d.gender == 1) {return "rgb(39,123,191)"}
          else {return "rgb(243,185,47)"}
        })
      .on('mouseover', function (d) {
          var section = d3.select(this);
              section.style("opacity", 0.6)
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .html(Math.abs(d.gen_per*100).toFixed(1) + "%");
           d3.select('#tooltip').classed('hidden', false);
        })
      .on("click",  function(d){
          $("#textInsert").html("");
          $("#textInsert_names").html(d.char_list);
          $("#titleInsert").html(d.gen_name);
          d3.selectAll(".genDot").style("fill", function(d){
              if (d.gender == 1) {return "rgb(39,123,191)"}
              else {return "rgb(243,185,47)"}
          }).style("stroke", 'white').style("stroke-width", 0.5)
          d3.select(this).style("fill", 'white').style("stroke", "rgb(105,174,68)").style("stroke-width", 2);
        })
      .on('mouseout', function () {
          var section = d3.select(this);
              section.style("opacity", '1')
          d3.select('#tooltip').classed('hidden', true);
        });


  svg_names.selectAll(".dodo")
      .data(data)
    .enter().append("text")
      .attr("class", "dodo")
      .attr("class", "tk-atlas")
      .attr("font-size", 10)
      .attr("x", function(d) {
        if (d.gen_per <=0){return x(d.gen_per)-15}
          else {return x(d.gen_per)+15}
         })
      .attr("y", function(d) {
        if (d.gen_per <=0){return y(d.gen_cat)+4}
          else {return y(d.gen_cat)+4}
         })
      .attr('text-anchor', function(d) {
        if (d.gen_per <= 0) {return 'end'}
          else {return 'start'}
        })
      .style("fill", function(d) {
        if (d.dim == 1) {return "rgb(234,70,46)"}
          else {return "black"}
        })
      .text(function(d) { return d.gen_name;});

  var lineEnd = 0;

  svg_names.append("line")
  .attr("x1", function(){return x(lineEnd)})
  .attr("y1", -40)
  .attr("x2", function(){return x(lineEnd)})
  .attr("y2", height_names+50)
  .style("stroke-width", 0.3)
  .style("stroke", "black")
  .style("fill", "none");

});


$( "#descendingFemale" ).click(function() {
 femaleOrder();
 $("#man_anno").delay(500).show(500);
 $("#girl_anno").delay(500).show(500);
});

$( "#descendingMale" ).click(function() {
 maleOrder();
 $("#man_anno").delay(500).hide(500);
 $("#girl_anno").delay(500).hide(500);
});

//BUTTON FUNCTIONS

function maleOrder(){

d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per/100.0;
    d.count = +d.count;
    d.per_fake = +d.per_fake/100.0;
  });

  function descendingMaleNames(data) {data.sort(function(x, y){
    if(x.gender==1 && y.gender==1) return d3.descending(x.gen_per,y.gen_per)
    else return 1
  });}

  descendingMaleNames(data);

  y.domain(data.map(function(d) { return d.gen_cat; }));

  d3.selectAll('.genDot') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); });

  d3.selectAll('.dodo')
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("x", function(d) {
        if (d.gen_per <=0){return x(d.gen_per)-15}
        else {return x(d.gen_per)+15}
       })
      .attr("y", function(d) {
        if (d.gen_per <=0){return y(d.gen_cat)+4}
        else {return y(d.gen_cat)+4}
       })
      .attr('text-anchor', function(d) {
        if (d.gen_per <= 0) {return 'end'}
        else {return 'start'}
        })
      .text(function(d) { return d.gen_name;});
    


  d3.selectAll(".between")
    .data(data)
    .transition().duration(500)
    // .delay(function (d,i) { return i*10})
    .attr("x1", function(d){return x(d.gen_per)})
    .attr("y1", function(d){return y(d.gen_cat)})
    .attr("x2", function(d){return x(d.per_fake)})
    .attr("y2", function(d){return y(d.gen_cat)})

  });

}; //end maleOrder();


function femaleOrder(){

d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per/100.0;
    d.count = +d.count;
    d.per_fake = +d.per_fake/100.0;
  });


  function ascendingFemaleNames(data) {data.sort(function(x, y){
    if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
    else return -1
  });}

  ascendingFemaleNames(data);

  y.domain(data.map(function(d) { return d.gen_cat; }));

 d3.selectAll('.genDot') // move the circles
    .transition().duration(500)
    .delay(function (d,i) { return i*10})
    .attr("cx", function(d) { return x(d.gen_per); })
    .attr("cy", function(d) { return y(d.gen_cat); });

 d3.selectAll('.dodo')
    .transition().duration(500)
    .delay(function (d,i) { return i*10})
    .attr("x", function(d) {
      if (d.gen_per <=0){return x(d.gen_per)-15}
      else {return x(d.gen_per)+15}
    })
    .attr("y", function(d) {
      if (d.gen_per <=0){return y(d.gen_cat)+4}
      else {return y(d.gen_cat)+4}
    })
    .attr('text-anchor', function(d) {
      if (d.gen_per <= 0) {return 'end'}
      else {return 'start'}
    })
    .text(function(d) { return d.gen_name;});


  d3.selectAll(".between")
    .data(data)
    .transition().duration(500)
    // .delay(function (d,i) { return i*10})
    .attr("x1", function(d){return x(d.gen_per)})
    .attr("y1", function(d){return y(d.gen_cat)})
    .attr("x2", function(d){return x(d.per_fake)})
    .attr("y2", function(d){return y(d.gen_cat)})

  });

}; //end femaleOrder();

} // end redraw function

 redraw_names();

 window.addEventListener("resize", redraw_names);


})()
