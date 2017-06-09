(function() {

var margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#teams_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var firstXDomain = function(d) { if(d.members<300 && d.members>0) return d.members }
// var firstXDomain = function(d) { return d.members }
// var firstYDomain = function(d) { return d.percent }

var firstXDomain = function(d) { return d.members }
var firstYDomain = function(d) { return d.percent }

var fiftyXDomain = function(d) { if (d.members<160) return d.members }
var fiftyYDomain = function(d) { if (d.percent >= 0.5) return d.percent }

// var fiftyXDomain = function(d) { if(d.per_females<5) return d.per_females }
// var fiftyYDomain = function(d) { if(d.per_males<5) return d.per_males }

// var splitXDomain = [0,11]
// var splitYDomain = [-90,90]

// var catColors = function(d) { return color(d.category_wiki); }


d3.csv("teams.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.percent = +d.percent;
    d.members = +d.members;
    d.female = +d.female;
    d.male = +d.male;
  });

  x.domain(d3.extent(data, firstXDomain)).nice();
  y.domain(d3.extent(data, firstYDomain)).nice();


  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

 svg.append("g")
      .attr("class", "y axis")
      .attr("id", "teamYAxis")
      .call(d3.axisLeft(y));



  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("id", "teamXAxis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //   .append("text")
  //     .attr("class", "label")
  //     .attr("x", width)
  //     .attr("y", -6)
  //     .style("text-anchor", "end")
  //     .text("# Members");

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .attr("id", "teamYAxis")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("class", "label")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("% female")


// Text for displaying number of teams

// svg.append("text")
//   .text("Number of teams")
//   .attr({
//     x: "70%",
//     y: 40,
//     "font-size": 15,
//     "fill": "red",
//     "text-anchor": "middle",
//     id: "teamNumberText"
//   })

// svg.append("text")
//   .text("2300")
//   .attr({
//     x: "70%",
//     y:  70,
//     "font-size": 30,
//     "text-anchor": "middle",
//     id: "teamNumber"
//   })


//   svg.append("text")
//   .text("Percent of teams")
//   .attr({
//     x: "70%",
//     y: 100,
//     "font-size": 15,
//     "fill": "red",
//     "text-anchor": "middle",
//     id: "teamPercentText"
//   })

// svg.append("text")
//   .text("100%")
//   .attr({
//     x: "70%",
//     y:  130,
//     "font-size": 30,
//     "text-anchor": "middle",
//     id: "teamPercentNumber"
//   })




  svg.selectAll(".dotTeams")
      .data(data)
    .enter().append("circle")
    // .filter(function(d) { return d.percent >= 0.5 })
      .attr("class", "dotTeams")
      .attr("r", 5)
      // .attr("r", function(d){return d.male*2})
      .attr("cx", function(d) { return x(d.members); })
      .attr("cy", function(d) { return y(d.percent); })
      .style("opacity", 0.6)
      .style("stroke-width", 0.5)
      .style("fill", "grey")
      // .style("fill", function(d) {
      //   if(d.percent >= 0.5){return "red"}
      //     else {return "grey"}
      //    })
      .on('mouseover', function (d) {
          var section = d3.select(this);
          section.style("opacity", 0.5)
                 .style("stroke-width", 1.5);
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .text(d.name);
           d3.select('#tooltip').classed('hidden', false);
          })
      .on('mouseout', function () {
          var section = d3.select(this);
          section.style("opacity", 0.8)
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true);
        });
});



function fiftyWomen(thisXDomain, thisYDomain) {

  d3.csv("teams.csv", function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, thisXDomain)).nice();
    y.domain(d3.extent(data, thisYDomain)).nice();

    d3.select("#teamYAxis")
      .transition().duration(1000)
      .call(d3.axisLeft(y));

    d3.select("#teamXAxis")
      .transition().duration(1000)
      .call(d3.axisBottom(x));

    d3.selectAll('.dotTeams') // move the circles
       .filter(function(d) { return d.percent < 0.5 })
       .transition().duration(1)
       .style("opacity", 0);

    d3.selectAll('.dotTeams') // move the circles
      .filter(function(d) { return d.percent >= 0.5 })
      .transition().duration(1000)
      .delay(function (d,i) { return i})
      .attr("cx", function(d){return x(d.members); })
      .attr("cy", function(d){return y(d.percent); })
      .style("fill", function(d){
        if (d.female>d.male && d.male != 0){return "yellow"}
          else {return "grey"}
      });


d3.select("#teamNumber")
.transition().duration(1000)
.text("255")

d3.select("#teamPercentNumber")
.transition().duration(1000)
.text("8.9%")

$("#onePercent").html("Of these 8.9% of teams, 90% have ONLY female characters.<br>This means that <span style='background-color:yellow'>only 10% of these teams are both mixed-gender<br> and have more women than men.</span> That's only 1% of all teams in the DC and Marvel universes.");

  });

} //end function fiftyWomen()



// ALL THE BUTTONS

$("#fiftyPercent").click(function() {
  fiftyWomen(fiftyXDomain, fiftyYDomain);
})


// init()
})()
