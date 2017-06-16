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

// var firstXDomain = function(d) { if(d.members<300 && d.members>0) return d.members }
// var firstXDomain = function(d) { return d.members }
// var firstYDomain = function(d) { return d.percent }

var firstXDomain = function(d) { return d.members }
var firstYDomain = function(d) { return d.percent }

var tokenXDomain = function(d) { if (d.members<=25) return d.members }

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














  //Threshhold annotation example
  const thresholdAnnotations = [
    // Only a single annotation in this example array
    {
      note: {
        title: "The 50% line",
        label: "Teams above this line have more female members than male"
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(100),
      y: y(0.5),
      // dx,dy are how FAR the annotation text is from the point x,y
      // (since svg measures the positions from top to bottom [or something], I made a new little routine to make the conversion everytime)
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
    .type(d3.annotationXYThreshold)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(thresholdAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .attr("id", "fiftyLine")
      .call(makeThresholdAnnotations) //This needs to call the object made above


  //Circle annotation examples
  // const circleAnnotations = [
  //   // Two annotations in this example array
  //   {
  //     note: {
  //       title: "Amazons Attack!",
  //       label: "All the Amazons from Wonder Woman comics are women --- and there are many of them."
  //     },
  //     // x,y are the point that the annotation points too
  //     // (by using the functions x() and y() this is done in graph units rather than pixels)
  //     x: x(155),
  //     y: y(0.975),
  //     // dx,dy are how FAR the annotation text is from the point x,y
  //     dx: dx(75),
  //     dy: dy(-0.01),
  //     subject: {
  //       radius: 25,         //Size of the the circling
  //       radiusPadding: 5    //A little gap between the annotation line and the circle
  //     }
  //   },
  //   {
  //     note: {
  //       title: "It's right in the name",
  //       label: "Not even the X-men pass 50%"
  //     },
  //     // x,y are the point that the annotation points too
  //     // (by using the functions x() and y() this is done in graph units rather than pixels)
  //     x: x(305),
  //     y: y(0.42),
  //     // dx,dy are how FAR the annotation text is from the point x,y
  //     dx: dx(50),
  //     dy: dy(0.3),
  //     subject: {
  //       radius: 50,
  //       radiusPadding: 5
  //     }
  //   }
  // ]
  // const makeCircleAnnotations = d3.annotation()
  //   .editMode(false)
  //   .type(d3.annotationCalloutCircle)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
  //   .annotations(circleAnnotations)
  // svg.append("g")
  //     .attr("class", "annotation-group")
  //     .call(makeCircleAnnotations)      //This needs to call the object made above


  //Rectangle annotation examples
  const rectangleAnnotations = [
    // This is an array of 2 annotations
    {
      note: {
        title: "100 percent",
        label: "These teams consist of only female characters"
      },
      // x,y are the upper left hand side of the box
      x: x(-10),
      y: y(1.05),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(75),
      dy: dy(-0.05),
      subject: {
        // width and height are the size of the box so use dx() and dy() to give difference from start
        width: dx(60),
        height: dy(-0.08)
      }
    }
    // {
    //   note: {
    //     title: "0%",
    //     label: "These teams are made of only men"
    //   },
    //   // x,y are the upper left hand side of the box
    //   x: x(-10),
    //   y: y(-0.05),
    //   // dx,dy are how FAR the ***annotation*** text is from the point x,y
    //   dx: dx(75),
    //   dy: dy(0.01),
    //   subject: {
    //     // width and height are the size of the box so use dx() and dy() to give difference from start
    //     width: dx(60),
    //     height: dy(0.1)
    //   }
    // }
  ]
  const makeRectangleAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutRect)      //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(rectangleAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .attr("id", "firstTeamAnno")
      .call(makeRectangleAnnotations)     //This needs to call the object made above


  // //Curvy annotation examples
  // const curvyAnnotations = [
  //   // This is an array of 4 annotations
  //   {
  //     note: {
  //       title: "In the Navy",
  //       label: "blah blah"
  //     },
  //     // x,y are the upper left hand side of the box
  //     x: x(40),
  //     y: y(0.05),
  //     // dx,dy are how FAR the ***annotation*** text is from the point x,y
  //     dx: dx(30),
  //     dy: dy(0.05)
  //     //No subject for curvy annotations
  //   },
  //   {
  //     note: {
  //       title: "NYPC",
  //       label: "blah blah"
  //     },
  //     // x,y are the upper left hand side of the box
  //     x: x(110),
  //     y: y(0.19),
  //     // dx,dy are how FAR the ***annotation*** text is from the point x,y
  //     dx: dx(50),
  //     dy: dy(0.2)
  //     //No subject for curvy annotations
  //   },
  //   {
  //     note: {
  //       title: "Women AWOL",
  //       label: "blah blah"
  //     },
  //     // x,y are the upper left hand side of the box
  //     x: x(225),
  //     y: y(0.1),
  //     // dx,dy are how FAR the ***annotation*** text is from the point x,y
  //     dx: dx(10),
  //     dy: dy(0.1)
  //     //No subject for curvy annotations
  //   },
  //   {
  //     note: {
  //       title: "et tu, fictional Corps??",
  //       label: "blah blah"
  //     },
  //     // x,y are the upper left hand side of the box
  //     x: x(365),
  //     y: y(0.25),
  //     // dx,dy are how FAR the ***annotation*** text is from the point x,y
  //     dx: dx(-25),
  //     dy: dy(-0.1)
  //     //No subject for curvy annotations
  //   }
  // ]
  // const makeCurvyAnnotations = d3.annotation()
  //   .editMode(false)
  //   .type(d3.annotationCalloutCurve)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
  //   .annotations(curvyAnnotations)
  // svg.append("g")
  //     .attr("class", "annotation-group")
  //     .call(makeCurvyAnnotations)     //This needs to call the object made above























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


  svg.selectAll(".dotTeams")
      .data(data)
    .enter().append("circle")
    // .filter(function(d) { return d.percent >= 0.5 })
      .attr("class", "dotTeams")
      .attr("r", 4)
      // .attr("r", function(d){return d.male*2})
      .attr("cx", function(d) { return x_jitter(d.members); })
      .attr("cy", function(d) { return y_jitter(d.percent); })
      .style("opacity", 0.6)
      .style("stroke-width", 0.5)
      .style("stroke", "white")
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
