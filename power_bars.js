(function() {

    var m = {
        top: 50,
        right: 10,
        bottom: 450,
        left: 50
      },
      w = 800 - m.left - m.right,
      h = 2300 - m.top - m.bottom,
      pad = 0.15

    // Functions for offsetting annotations
      function dy(t) {
        return y(t)-y(0);
      }
      function dx(t) {
        return x(t)-x(0);
      }

    var y = d3.scaleBand().range([10, h]);

    var x = d3.scaleLinear().rangeRound([0, w]);
    var y0 = d3.scaleOrdinal();

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#powerSplit_graph").append("svg")
      .attr("width", w + m.right + m.left + 100)
      .attr("height", h + m.top + m.bottom)
      .append("g")
      .attr("transform",
        "translate(" + m.left + "," + m.top + ")");

    // var groupSpacing = 6;

    d3.csv("gender_bars.csv", function(error, data) {

      data.forEach(function(d) {
        d.diff = +d.diff;
      });

      var barHeight = h / (data.length);
      var padBetween = 40;

      y0.domain(data.map(function(d) {
        return d.category;
      }));


      y.domain(data.map(function(d) { return d.power; }));


var annotation_hair = [{
      note: {
        title: "Object-ified",
        label: "Though Wonder Woman has her lasso, and Stargirl has a cosmic staff, it's generally the male character that like their stuff. Think Thor and his hammer, or Iron Man and his suit.",
        wrap:180
      },
          y: y('Gadgets')+padBetween*1.5,
          x: x(.2),
          dy: dy(130),
          dx: dx(.1)    
    }
  ]

  var makeAnnotation_hair = d3.annotation()
    .editMode(false)
    .type(d3.annotationCallout)   
    .annotations(annotation_hair)
  svg.append("g")
      .attr("id", "man_anno")
      .attr("class", "annotation-group")
      .call(makeAnnotation_hair)   


  // const circleAnnotations_man = [
  //   {
  //     note: {
  //       title: "Men, not boys",
  //       label: "A full 30% of male characters with gendered names get 'man' in their name. That number is only 6% for 'woman'."
  //     },
  //     x: x(.30),        
  //     y: y0('woman'), 
  //     dx: dx(-.02),
  //     dy: 50
  //   }
  // ]
  // const makeCircleAnnotations_man = d3.annotation()
  //   .editMode(false)
  //   .type(d3.annotationCallout)   
  //   .annotations(circleAnnotations_man)
  // svg.append("g")
  //     .attr("id", "man_anno")
  //     .attr("class", "annotation-group")
  //     .call(makeCircleAnnotations_man) 

// END ANNOTATIONS


























      
      var y0Range = [0];
      var categoryD = d3.nest()
            .key(function(d) {
              return d.category;
            })
            .rollup(function(d) {
              var barSpace = ( (barHeight+pad) * d.length);
              y0Range.push(y0Range[y0Range.length - 1] + barSpace + padBetween);
              return d3.scaleBand()
                        .domain(d.map(function(c) {
                          return c.power
                        }))
                        .rangeRound([0, barSpace], pad);
              })
            .object(data);


      console.log(y0Range)
      y0.range(y0Range);
      // console.log(y0.range(y0Range))
      // console.log(categoryD)
      // console.log(categoryD["Objects"])
      // console.log(categoryD["Objects"]("yWord"))
      
      var d3Max = d3.max(data, function(d) { return d.diff });
      var d3Min = d3.min(data, function(d) { return d.diff });

      x.domain([-5,5]);

      svg.append("g")
        .attr("class", "x axis")
        // .attr("transform", "translate(0," + h + ")")
        .call(d3.axisTop(x))
        .selectAll("text")
        .style("text-anchor", "middle");

      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(customYAxis)
        // .append("text")
        // .attr("transform", "translate(0," + 200 + ")");

        function customYAxis(g) {
        g.call(d3.axisLeft(y0));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
        g.selectAll(".tick text").attr("x", 60).attr("dy", -4).style("text-align","center");
        }


      svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", function(d, i) {
          if(d.diff>=0) {return "black"}
          else return "green"; })
        .attr("x", function(d) { 
          if(d.diff>=0) {return x(0)}
          else return x(d.diff); })
        .attr("y", function(d) {
          return y0(d.category) + categoryD[d.category](d.power);
        })
        .attr("height", function(d) {
          return (1.0-pad)*barHeight;
        })
        .attr("width", function(d) { return x(Math.abs(d.diff))-x(0); })
        .on('mouseover', function (d) {
          var section = d3.select(this);
              section.style("opacity", 0.6)
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .text(Math.abs(d.diff).toFixed(2) + "%" );
           d3.select('#tooltip').classed('hidden', false);
        })
        .on('mouseout', function () {
          var section = d3.select(this);
              section.style("opacity", '1')
          d3.select('#tooltip').classed('hidden', true);
        });

      var ls = svg.selectAll(".labels")
        .data(data)
        .enter().append("g");
        
      ls.append("text")
        .text(function(d) {
          return (d.power);
          // return Math.abs(d.diff).toFixed(2);
        })
        .attr('text-anchor', function(d) {
        if (d.diff <= 0) {return 'end'}
          else {return 'start'}
        })
        .attr("x", function(d) {
        if (d.diff <= 0) {return x(d.diff)-5}
          else {return x(d.diff)+5}
        })
        .attr("y", function(d) {
          return y0(d.category) + categoryD[d.category](d.power) + 0.6*barHeight;

        })
        .attr("class", "label")
         .style("alignment-baseline", "middle")
        .attr("class", "label");

    });

// init()
})()
