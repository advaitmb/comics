(function() {

var margin = {top: 60, right: 20, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

// Functions for offsetting annotations
function dy(t) {
  return y(t)-y(0);
}
function dx(t) {
  return x(t)-x(0);
}

// Jitter functions
function y_jitter(t) {
  noiseAmp=0.02;
  jitted=t+(0.5-Math.random())*noiseAmp;
  if( jitted<0.0 ) jitted=0.0;
  else if( jitted>1.0 ) jitted=1.0;
  return y(jitted)
}
function x_jitter(t) {
  noiseAmp=2.0;
  jitted=t+(0.5-Math.random())*noiseAmp;
  if( jitted<0.0 ) jitted=0.0;
  else if( jitted>400.0 ) jitted=400.0;
  return x(jitted)
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#teams_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var firstXDomain = function(d) { return d.members }
var firstYDomain = function(d) { return d.percent }

var tokenXDomain = function(d) { if (d.members<=25) return d.members }

var fiftyXDomain = function(d) { if (d.members<160) return d.members }
var fiftyYDomain = function(d) { if (d.percent >= 0.5) return d.percent }

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

// ANNOTATIONS
  const thresholdAnnotations = [
    {
      note: {
        title: "The 50% line",
        label: "Teams above this line have more female members than male"
      },
      x: x(100),
      y: y(0.5),
      dx: dx(220),
      dy: dy(0),
      subject: {
        x1: x(0),
        x2: x(400)
      }
    }
  ]
  const makeThresholdAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationXYThreshold)   
    .annotations(thresholdAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .attr("id", "fiftyLine")
      .call(makeThresholdAnnotations) 


  const rectangleAnnotations = [
    {
      note: {
        title: "100 percent",
        label: "These teams consist of only female characters"
      },
      x: x(-10),
      y: y(1.05),
      dx: dx(75),
      dy: dy(-0.05),
      subject: {
        width: dx(60),
        height: dy(-0.08)
      }
    }
  ]
  const makeRectangleAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutRect)     
    .annotations(rectangleAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .attr("id", "firstTeamAnno")
      .call(makeRectangleAnnotations) 
// END ANNOTATIONS

  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis_team")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("text")  
      .attr("class", "tk-atlas") 
      .attr("class", "small")           
      .attr("transform", "translate(400," + (height+35) + ")")
      .style("text-anchor", "middle")
      .text("Team members");


 svg.append("g")
      .attr("class", "y axis")
      .attr("id", "yAxis_team")
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0%")));

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("class", "tk-atlas") 
      .attr("class", "small") 
      .attr("y", -50 )
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percent female");      


  svg.selectAll(".dotTeams")
      .data(data)
    .enter().append("circle")
      .attr("class", "dotTeams")
      .attr("r", 4)
      .attr("cx", function(d) { return x_jitter(d.members); })
      .attr("cy", function(d) { return y_jitter(d.percent); })
      .style("opacity", 0.6)
      .style("stroke-width", 0.5)
      .style("stroke", "white")
      .style("fill", "grey")
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


//BUTTON FUNCTIONS

function allTeams(firstXDomain, firstYDomain){

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

    $("#fiftyLine").show();

  d3.select("#noOfTeams")
  .transition().duration(1000)
  .text("2862")

  d3.select("#perOfTeams")
    .transition().duration(1000)
    .text("100%")

  $("#onePercent").hide();


  d3.select("#yAxis_team")
      .transition().duration(1000)
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0%")));

  d3.select("#xAxis_team")
      .transition().duration(1000)
      .call(d3.axisBottom(x));

  d3.selectAll('.dotTeams') // move the circles
      // .delay(function (d,i) { return i})
      .attr("r", 4)
      .transition().duration(10)
      .attr("cx", function(d) { return x_jitter(d.members); })
      .attr("cy", function(d) { return y_jitter(d.percent); })
      .style("opacity", 0.6)
      .style("stroke-width", 0.5)
      .style("stroke", "white")
      .style("fill", "grey")
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
          section.style("opacity", 0.6)
                 .style("stroke-width", 0.5);
          d3.select('#tooltip').classed('hidden', true);
        });

});
} //end function allTeams()


function tokenWomen(firstXDomain, firstYDomain) {

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

  d3.select("#yAxis_team")
      .transition().duration(1000)
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0%")));

  d3.select("#xAxis_team")
      .transition().duration(1000)
      .call(d3.axisBottom(x));

  //Hide the dots that we aren't interested in
  d3.selectAll('.dotTeams') // move the circles
       .filter(function(d) { return d.female > 1 })
       .transition().duration(1)
       .attr("cx", function(d) { return x(-5); })
       .attr("cy", function(d) { return y(-0.2); })
       .attr("r", 0.0)
       .style("opacity", 0.0);

  //Show the dots that we are interested in
  d3.selectAll('.dotTeams') // move the circles
      .filter(function(d) { return d.female == 1 })
      .transition().duration(1000)
      .delay(function (d,i) { return i})
      .attr("cx", function(d) { return x_jitter(d.members); })
      .attr("cy", function(d) { return y_jitter(d.percent); })
      .attr("r", 4)
      .style("opacity", 0.6)
      .style("fill", function(d){
        if (d.female>d.male && d.male != 0){return "rgb(234,70,46)"}
          else {return "grey"}
      });

  $("#firstTeamAnno").hide();
  $("#fiftyLine").hide();

  d3.select("#noOfTeams")
    .transition().duration(1000)
    .text("762")

  d3.select("#perOfTeams")
    .transition().duration(1000)
    .text("26.6%")

  $("#onePercent").hide()
});
} //end function tokenWomen()


function fiftyWomen(thisXDomain, thisYDomain) {

  d3.csv("teams.csv", function(error, data) {
    if (error) throw error;

     data.forEach(function(d) {
      d.percent = +d.percent;
      d.members = +d.members;
      d.female = +d.female;
      d.male = +d.male;
    });

    x.domain(d3.extent(data, thisXDomain)).nice();
    y.domain(d3.extent(data, thisYDomain)).nice();

    d3.select("#yAxis_team")
      .transition().duration(1000)
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0%")));

    d3.select("#xAxis_team")
      .transition().duration(1000)
      .call(d3.axisBottom(x));

    //Hide the dots that we aren't interested in
    d3.selectAll('.dotTeams') // move the circles
       .filter(function(d) { return d.percent <= 0.5 })
       .transition().duration(1)
       .attr("cx", function(d) { return x(-40); })
       .attr("cy", function(d) { return y(0.4); })
       .attr("r", 0.0)
       .style("opacity", 0.01);

    //Show the dots that we are interested in
    d3.selectAll('.dotTeams') // move the circles
      .filter(function(d) { return d.percent > 0.5 })
      .transition().duration(1000)
      .delay(function (d,i) { return i})
      .attr("cx", function(d) { return x_jitter(d.members); })
      .attr("cy", function(d) { return y_jitter(d.percent); })
      .attr("r", 4)
      .style("opacity", 0.6)
      .style("fill", function(d){
        if (d.female>d.male && d.male != 0){return "rgb(234,70,46)"}
          else {return "grey"}
      });

    $("#firstTeamAnno").hide();
    $("#fiftyLine").hide();

    d3.select("#noOfTeams")
    .transition().duration(1000)
    .text("342")

    d3.select("#perOfTeams")
    .transition().duration(1000)
    .text("12%")

    $("#onePercent").show();
    $("#onePercent").html("Of these 12% of teams that have more women than men, 33% have ONLY female characters.<br>This means that <span style='background-color:rgb(234,70,46);color:white;'>only 8% of all teams in the DC and Marvel universes are both mixed-gender<br> and have more women than men.</span>");

  });
} //end function fiftyWomen()


// ALL THE BUTTONS

$("#fiftyPercent").click(function() {
  fiftyWomen(fiftyXDomain, fiftyYDomain);
})

$("#allTeams").click(function() {
 allTeams(firstXDomain, firstYDomain);
})

$("#tokenWoman").click(function() {
  tokenWomen(tokenXDomain, firstYDomain);
})

$("#onlyWomen").click(function() {

})


// init()
})()
