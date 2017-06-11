(function() {

var margin = {top: 20, right: 20, bottom: 50, left: 40},
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
        label: "Only teams above this line have more women members than men"
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(100),
      y: y(0.5),
      // dx,dy are how FAR the annotation text is from the point x,y
      // (since svg measures the positions from top to bottom [or something], I made a new little routine to make the conversion everytime)
      dx: dx(15),
      dy: dy(0.05),
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
      .call(makeThresholdAnnotations) //This needs to call the object made above


  //Circle annotation examples
  const circleAnnotations = [
    // Two annotations in this example array
    {
      note: {
        title: "Amazons Attack!",
        label: "All the Amazons from Wonder Woman comics are women --- and there are many of them."
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(155),
      y: y(0.975),
      // dx,dy are how FAR the annotation text is from the point x,y
      dx: dx(75),
      dy: dy(-0.01),
      subject: {
        radius: 25,         //Size of the the circling
        radiusPadding: 5    //A little gap between the annotation line and the circle
      }
    },
    {
      note: {
        title: "It's right in the name",
        label: "Not even the X-men pass 50%"
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(305),
      y: y(0.42),
      // dx,dy are how FAR the annotation text is from the point x,y
      dx: dx(50),
      dy: dy(0.3),
      subject: {
        radius: 50,
        radiusPadding: 5
      }
    }
  ]
  const makeCircleAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCircle)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(circleAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .call(makeCircleAnnotations)      //This needs to call the object made above


  //Rectangle annotation examples
  const rectangleAnnotations = [
    // This is an array of 2 annotations
    {
      note: {
        title: "100%",
        label: "These teams are made of only women"
      },
      // x,y are the upper left hand side of the box
      x: x(-10),
      y: y(1.05),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(75),
      dy: dy(-0.01),
      subject: {
        // width and height are the size of the box so use dx() and dy() to give difference from start
        width: dx(60),
        height: dy(-0.1)
      }
    },
    {
      note: {
        title: "0%",
        label: "These teams are made of only men"
      },
      // x,y are the upper left hand side of the box
      x: x(-10),
      y: y(-0.05),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(75),
      dy: dy(-0.01),
      subject: {
        // width and height are the size of the box so use dx() and dy() to give difference from start
        width: dx(60),
        height: dy(0.1)
      }
    }
  ]
  const makeRectangleAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutRect)      //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(rectangleAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .call(makeRectangleAnnotations)     //This needs to call the object made above


  //Curvy annotation examples
  const curvyAnnotations = [
    // This is an array of 4 annotations
    {
      note: {
        title: "In the Navy",
        label: "blah blah"
      },
      // x,y are the upper left hand side of the box
      x: x(40),
      y: y(0.05),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(30),
      dy: dy(0.05)
      //No subject for curvy annotations
    },
    {
      note: {
        title: "NYPC",
        label: "blah blah"
      },
      // x,y are the upper left hand side of the box
      x: x(110),
      y: y(0.19),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(50),
      dy: dy(0.2)
      //No subject for curvy annotations
    },
    {
      note: {
        title: "Women AWOL",
        label: "blah blah"
      },
      // x,y are the upper left hand side of the box
      x: x(225),
      y: y(0.1),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(10),
      dy: dy(0.1)
      //No subject for curvy annotations
    },
    {
      note: {
        title: "et tu, fictional Corps??",
        label: "blah blah"
      },
      // x,y are the upper left hand side of the box
      x: x(365),
      y: y(0.25),
      // dx,dy are how FAR the ***annotation*** text is from the point x,y
      dx: dx(-25),
      dy: dy(-0.1)
      //No subject for curvy annotations
    }
  ]
  const makeCurvyAnnotations = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCurve)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(curvyAnnotations)
  svg.append("g")
      .attr("class", "annotation-group")
      .call(makeCurvyAnnotations)     //This needs to call the object made above























  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


 svg.append("g")
      .attr("class", "y axis")
      .attr("id", "yAxis")
      .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0%")));



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