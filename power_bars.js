(function() {

    var m = {
        top: 70,
        right: 60,
        bottom: 500,
        left: 50
      },
      w = 900 - m.left - m.right,
      h = 1600 - m.top - m.bottom,
      pad = 0.2

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


    d3.csv("gender_bars_sig_less.csv", function(error, data) {

      data.forEach(function(d) {
        d.diff = +d.diff;
        d.per_males = +d.per_males;
        d.per_females = +d.per_females;
      });

      var barHeight = h / (data.length);
      var padBetween = 60;

      y0.domain(data.map(function(d) {
        return d.category;
      }));


      y.domain(data.map(function(d) { return d.power; }));


const annotation_object = [{
      note: {
        title: "Object—-ified",
        label: "Though Wonder Woman has her lasso, and Stargirl has a cosmic staff, it's generally the male characters that like their stuff. Think Thor and his hammer, or Iron Man and his suit.",
        wrap:210
      },
          y: y('Gadgets')+padBetween-15,
          
    }
  ]

const makeAnnotation_object = d3.annotation()
    .editMode(false)
    .type(d3.annotationCallout)   
    .annotations(annotation_object)
  svg.append("g")
      .attr("id", "object_anno")
      .attr("class", "annotation-group")
      .attr("class", "tk-atlas")
      .attr("font-size", 12)
      .call(makeAnnotation_object)   



const annotation_mind = [{
      note: {
        title: "Mind your powers",
        label: "There is a clear trend here: Female characters are more often given non-physical, thought-induced abilities.",
        wrap:210
      },
          y: y('Empathy')+padBetween*5,
          
    }
  ]

const makeAnnotation_mind = d3.annotation()
    .editMode(false)
    .type(d3.annotationCallout)   
    .annotations(annotation_mind)
  svg.append("g")
      .attr("id", "mind_anno")
      .attr("class", "annotation-group")
      .attr("class", "tk-atlas")
      .attr("font-size", 12)
      .call(makeAnnotation_mind)   





      
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

      
      var d3Max = d3.max(data, function(d) { return d.diff });
      var d3Min = d3.min(data, function(d) { return d.diff });

      x.domain([-8,8]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("class", "tk-atlas")
        .attr("transform", "translate(0, -50)")
        .call(d3.axisTop(x)
           .tickFormat( function(d){ return (Math.abs(d)); } ))
        .selectAll("text")
        .style("text-anchor", "middle");

      svg.append("g")
        .attr("class", "y axis")
        .attr("class", "tk-atlas")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + x(0) + ",0)")
        .call(customYAxis)

        function customYAxis(g) {
        g.call(d3.axisLeft(y0));
        g.select(".domain").remove();
        g.selectAll(".tick line").attr("stroke", "#777").attr("opacity", "0");
        g.selectAll(".tick text").attr("dy", -8).attr("class", "label");
        }


      svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "power_bar")
        .style("fill", function(d, i) {
          if(d.diff>=0) {return "rgb(39,123,191)"}
          else return "rgb(243,185,47)"; })
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
          .html("<span class='bTooltip'>Difference: " + Math.abs(d.diff).toFixed(2) + "</span><br><hr> Percent of males: " + Math.abs(d.per_males).toFixed(2) + "%<br/>Percent of females: " + Math.abs(d.per_females).toFixed(2) + "%");
           d3.select('#tooltip').classed('hidden', false);
        })
        .on("click",  function(d){
          $("#textInsert").html(d.definition)
          $("#titleInsert").html(d.power);
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
         .style("vertical-align", "center")
         .attr("class", "power_bar_bars")
         .attr("class", "tk-atlas")
         .style("fill", function(d){
            if (d.sig == "y" ) {return "black"}
              else {return "#696969"}
            })
         .attr("font-size", 10);


    });

// init()
})()
