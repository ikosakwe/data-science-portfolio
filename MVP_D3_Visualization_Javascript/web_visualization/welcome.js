///// LOAD WELCOME PAGE/////

var width = 1000;
var height = 660;


var thisCanvas = d3.select("#chart").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "svgCanvas")

  var margin = {
    top: 40,
    right: 225,
    bottom: 60,
    left: 30
  };

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;


// Set up a helper function to divide x and y axis
var x = d3.scaleLinear()
  .range([0, width])
  .domain([0, 1])

var y = d3.scaleLinear()
  .range([0, height])
  .domain([0, 1])

thisCanvas.append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "#FFFFF0");

thisCanvas
  .append("text")
  .attr("class", "welcome")
  .attr("x", x(0.05))
  .attr("y", y(0))
  .text("NBA MVP Predictor")
  .style("fill", "#FF4500")
  .attr("text-anchor", "start")
  .style("font-size", "94px")
  .attr("font-family", function (d, i) {
    return i < 5 ? "Arvo" : "Sancreek";
  })
  .style("font-weight", "bold")
  .transition()
  .duration(300)
  .attr("y", y(0.7))
  .transition()
  .duration(300)
  .attr("y", y(0.5))
  .transition()
  .duration(200)
  .attr("y", y(0.6))
  .transition()
  .duration(150)
  .attr("y", y(0.55))

thisCanvas
  .append("text")
  .attr("class", "welcome")
  .attr("x", x(0.07))
  .attr("y", y(0.7))

  .text("A fun tool for basketball fans")
  .style("fill", "#FF4500")

  .attr("text-anchor", "start")
  .style("font-size", "50px")
  .attr("font-family", function (d, i) {
    return i < 5 ? "Arvo" : "Sancreek";
  })
  .style("font-weight", "bold")
  .attr("opacity", 0)
  .transition()
  .delay(2000)
  .duration(1000)
  .attr("opacity", 1)

  .on("end", function () {
    d3.selectAll("text").transition()
      .delay(1000)
      .duration(400)
      .attr("opacity", 0)
    thisCanvas.append("text").attr("class", "welcome")
      .attr("x", x(0.05))
      .attr("y", y(0.55))

      .text("Explore What Makes an MVP ")
      .style("fill", "#FF4500")

      .attr("text-anchor", "start")
      .style("font-size", "65px")
      .attr("font-family", function (d, i) {
        return i < 5 ? "Arvo" : "Sancreek";
      })
      .style("font-weight", "bold")
      .attr("opacity", 0)
      .transition()
      .delay(2000)
      .duration(1000)
      .attr("opacity", 1)
      .on("end", function () {

        document.getElementById('button').style.display = "inline";
        d3.select(".button")
          .transition()
          .duration(100)
          .attr("background-color", "#FF4500")
      })

  })
