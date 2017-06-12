(function() {

var margin = {top: 100, right: 50, bottom: 50, left: 40},
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([0, height], 1);

var x = d3.scaleLinear()
    .range([width, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("top");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

var svg = d3.select("#genNames_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });

  function ascendingFemaleNames(data) {data.sort(function(x, y){
  if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
  else return -1
});}

ascendingFemaleNames(data);


  x.domain([30,-30]);
  y.domain(data.map(function(d) { return d.gen_cat; }));


  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, -50)")
      .call(d3.axisTop(x));

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("id", "xAxis")
  //     .attr("transform", "translate(0, -50)")
  //     .call(xAxis)
    // .append("text")
    //   .attr("class", "label")
    //   .attr("x", width)
    //   .attr("y", 20)
    //   .style("text-anchor", "end")
    //   .text("male");

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .attr("id", "yAxis_genName")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("class", "label")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("categories")

  svg.selectAll(".genDot")
      .data(data)
    .enter().append("circle")
      .attr("class", "genDot")
      .attr("r", 10)
      // .attr("r", function(d){return Math.abs(d.perdiffMF)/4})
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); })
      .style("opacity", 1)
      .style("stroke", function(d){
        if (d.gen_name == "lady"){return "black"}
          else {return "white"}
        })
      .style("stroke-width", function(d){
        if (d.gen_name == "lady") {return 4}
          else {return 0.5}
        })
      .style("fill", function(d){
        if (d.gender == 1) {return "blue"}
          else {return "orange"}
      })
      .on('mouseover', function (d) {
          var section = d3.select(this);
          section.style("stroke-width", 1.5);
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .text( Math.round(d.gen_per).toFixed(2) + "%" );
           d3.select('#tooltip').classed('hidden', false);
          })
      .on("click",  function(d){
          $("#genNames").html(d.char_list);
          $("#genTitle").html(d.gen_name);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section
                .style("stroke", function(d){
                  if (d.gen_name == "lady"){return "black"}
                  else {return "white"}
               })
                .style("stroke-width", function(d){
                  if (d.gen_name == "lady") {return 4}
                    else {return 0.5}
              })
          d3.select('#tooltip').classed('hidden', true);
        });


  svg.selectAll(".dodo")
  .data(data)
 .enter().append("text")
  .attr("class", "dodo")
  .attr("font-size", 12)
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



var lineEnd = 0;

svg.append("line")
.attr("x1", function(){return x(lineEnd)})
.attr("y1", -40)
.attr("x2", function(){return x(lineEnd)})
.attr("y2", height+50)
.style("stroke-width", 0.3)
.style("stroke", "black")
.style("fill", "none");


      // Make the dotted lines between the dots

      var linesBetween = svg.selectAll("lines.between")
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


});





function maleOrder(){

d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });


function descendingMaleNames(data) {data.sort(function(x, y){
  if(x.gender==1 && y.gender==1) return d3.descending(x.gen_per,y.gen_per)
  else return 1
});}

descendingMaleNames(data);

  x.domain([30,-30]);
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
  .delay(function (d,i) { return i*10})
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
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });


function ascendingFemaleNames(data) {data.sort(function(x, y){
  if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
  else return -1
});}

ascendingFemaleNames(data);

  x.domain([30,-30]);
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
  .delay(function (d,i) { return i*10})
  .attr("x1", function(d){return x(d.gen_per)})
  .attr("y1", function(d){return y(d.gen_cat)})
  .attr("x2", function(d){return x(d.per_fake)})
  .attr("y2", function(d){return y(d.gen_cat)})

});


}; //end femaleOrder();


$( "#descendingFemale" ).click(function() {
 femaleOrder();
});

$( "#descendingMale" ).click(function() {
 maleOrder();
});









// init()
})()
