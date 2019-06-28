
const socket =
  io('http://localhost:8001');
socket.on('connect', () => {
});
renderPredictor = function () {
  d3.select("svg").remove()
  document.getElementById('button').style.display = "none";

  // respectively max and min values in the dataset --  to normalize points
  const maxmin = {
    'G': [85, 31],
    'MPG': [43.7, 2.4],
    'RB': [18.7, 0.2],
    'PPG': [37.1, 0.6],
    'BLK': [5.0, 0],
    'AST': [14.5, 0],
    'STL': [3.7, 0],
    'FG.': [0.72, 0.19],
    'FT.': [1, 0],
    'FTr': [1.2, 0],
    'WP': [0.89, 0.11],
    'CWP': [0.51, -0.51]
  }
  normalize = (field, value) => {
    bounds = maxmin[field]
    return (value - bounds[1]) / (bounds[0] - bounds[1])
  }
  denormalize = (field, value) => {
    bounds = maxmin[field]
    return (bounds[0] - bounds[1]) * value + bounds[1]
  }

  let eval_data = {
    'G': normalize("G",41),
    'MPG': normalize("MPG",24),
    'RB': normalize("RB",10),
    'PPG': normalize("PPG",20),
    'BLK': normalize("BLK",1),
    'AST': normalize("AST",5),
    'STL': normalize("STL",2),
    'FG.': normalize("FG.",0.5),
    'FT.': normalize("FT.",0.5),
    'FTr': normalize("FTr",0.5),
    'WP': normalize('WP',0.5),
    'CWP': normalize('CWP',0),
    '1': 1,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    'C': 0,
    'PF': 0,
    'PG': 1,
    'SF': 0,
    'SG': 0
  }
  let positions = ["C", "PF", "PG", "SF", "SG"]
  var width = 1000;
  var height = 660;



  // Create a SVG canvas
  var thisCanvas = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svgCanvas")

  thisCanvas.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#FFFFF0");


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

  var eras = ["1979-1985", "1986-1991", "1992-1997", "1998-2003", "2004-2009", "2009-2016"]
  // render probability title
  thisCanvas
    .append("text")
    .attr("class", "probsheader")
    .attr("x", x(0.55))
    .attr("y", y(0.15))
    .text("MVP Probability")
    .attr("font-family", function (d, i) {
      return i < 5 ? "Arvo" : "Sancreek";
    })
    .style("fill", "#FF4500")
    .attr("text-anchor", "start")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("font", "Geneva")
  // render probability value
  thisCanvas
    .append("text")
    .attr("class", "probsvalue")
    .attr("x", x(0.45))
    .attr("y", y(0.35))
    .attr("font-family", function (d, i) {
      return i < 5 ? "Arvo" : "Sancreek";
    })
    .text("0.00%")
    .style("fill", "#FF4500")
    .attr("text-anchor", "start")
    .style("font-size", "110px")
    .style("font-weight", "bold")
    .on("mouseover", function () {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("y", y(0.34))
        .transition()
        .duration(200)
        .attr("y", y(0.35))
        .transition()
        .duration(200)
        .attr("y", y(0.34))
        .transition()
        .duration(200)
        .attr("y", y(0.35))
    })

  updateProb = function (eval_data, socket) {
    socket.emit("test_data", eval_data)
    socket.on("prob", (prob) => d3.select(".probsvalue").text(prob))
  }
// handle select position
  $(document).ready(function () {
    $("input[type='radio']").click(function () {
      var radioValue = $("input[name='platform']:checked").val();
      if (radioValue) {
        console.log("Your are a - " + radioValue);
        positions.forEach((el) => {
          if (el === radioValue) {
            eval_data[el] = 1
          } else {
            eval_data[el] = 0
          }
        })
        updateProb(eval_data, socket)
      }
      $("option").css({
        "display": "none"
      })
    });

  });

  document.getElementById('app-cover').style.display = "inline";
  renderHorizontalSlider(color = "#FF4500", 2, 2.5, 0, 1, 0.01, ".0%", thisCanvas, margin, "Field Goal%", eval_data, updateProb, socket, normalize)
  renderHorizontalSlider(color = "#FF4500", 2, 4.5, 0, 1, 0.01, ".0%", thisCanvas, margin, "Free-Throw%", eval_data, updateProb, socket, normalize)

  renderHorizontalSlider(color = "#FF4500", 23, 1.5, 0, 1, 0.01, ".0%", thisCanvas, margin,
    "Free Throw Rate", eval_data, updateProb, socket,normalize)
  renderHorizontalSlider(color = "#FF4500", 23, 3.5, 0, 82, 1, "", thisCanvas, margin, "Games Played", eval_data, updateProb, socket, normalize)
  renderHorizontalSlider(color = "#FF4500", 23, 5.5, 0, 48, 1, "", thisCanvas, margin,
    "Minutes Per Game", eval_data, updateProb, socket, normalize)


  renderVerticalSlider(color = "#FF4500", 30, 7.5, thisCanvas, margin, "Wins Last", "Season", eval_data, updateProb, socket, normalize, denormalize)
  renderVerticalSlider(color = "#FF4500", 27, 7.5, thisCanvas, margin, "Wins This", "Season", eval_data, updateProb, socket, normalize, denormalize)


  var radarChartOptions = {
    w: 250,
    h: 300,
    margin: {
      top: 250,
      right: 225,
      bottom: 60,
      left: 375
    },
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: '.0f'
  };

  RadarChart(thisCanvas, radarChartOptions, eval_data, updateProb, socket, normalize)

  let eraButtons = thisCanvas.append("g").attr("class", "erabuttons");

// render buttons to select eras
  eraButtons
    .selectAll(".erabuttons")
    .data(eras)
    .enter()
    .append("rect")
    .attr("class", (d, i) => "erabutton" + i)
    .attr("x", (d, i) => x(0.25) + i * 100)
    .attr("y", y(1.07))
    .attr("rx", 1)
    .attr("ry", 15)
    .attr("width", 100)
    .attr("height", 40)
    .attr("fill", "#fff")
    .attr("stroke", "black")
    .on("mouseover", function (d, i) {
      d3.select(this)
        .attr("fill", "#FF4500")
      d3.select(".eratext" + i).attr("fill", "#fff")
    })
    .on("click", function (d, i) {
      d3.select(".activeeratxt").classed("activeeratxt", false)
      d3.select(".activeerabtn").classed("activeerabtn", false)

      d3.select(".eratext" + i)
        .classed("activeeratxt", true)
      d3.select(".erabutton" + i).classed("activeerabtn", true)
      eras.forEach((el, j) => {
        if (el === d) {
          eval_data[j + 1] = 1
        } else {
          eval_data[j + 1] = 0
        }
      })
      console.log(eval_data);

      updateProb(eval_data, socket)
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .attr("fill", "#fff")
      d3.select(".eratext" + i).attr("fill", "black")
    })
  eraButtons
    .selectAll(".erabuttons")
    .data(eras)
    .enter()
    .append("text")
    .attr("class", (d, i) => "eratext" + i)
    .attr("x", (d, i) => x(0.265) + i * 100)
    .attr("y", y(1.12))
    .text((d) => d)
    .on("mouseover", function (d, i) {
      d3.select(this)
        .attr("fill", "#fff")

      d3.select(".erabutton" + i).attr("fill", "#FF4500")
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .attr("fill", "black")
      d3.select(".erabutton" + i).attr("fill", "#fff")
    })
    .on("click", function (d, i) {
      d3.select(".activeeratxt").classed("activeeratxt", false)
      d3.select(".activeerabtn").classed("activeerabtn", false)

      d3.select(this)
        .classed("activeeratxt", true)
      d3.select(".erabutton" + i).classed("activeerabtn", true)
      eras.forEach((el, j) => {
        if (el === eras[i]) {
          eval_data[j + 1] = 1
        } else {
          eval_data[j + 1] = 0
        }
      })
      console.log(eval_data);

      updateProb(eval_data, socket)
    })
}
