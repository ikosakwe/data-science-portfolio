const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const cos = Math.cos;
const maxValues = [50, 30, 10, 10, 30]
const HALF_PI = Math.PI / 2;
const angleSlice = Math.PI * 2 / 5;
var data = [{
  name: 'Actual Spending',
  axes: [{
      axis: 'POINTS',
      value: 20,
      angle: 0,
      max: maxValues[0]
    },
    {
      axis: 'REBOUNDS',
      value: 10,
      angle: angleSlice,
      max: maxValues[1]
    },
    {
      axis: 'BLOCKS',
      value: 1,
      angle: angleSlice * 2,
      max: maxValues[2]
    },
    {
      axis: 'STEALS',
      value: 2,
      angle: angleSlice * 3,
      max: maxValues[3]
    },
    {
      axis: 'ASSISTS',
      value: 5,
      angle: angleSlice * 4,
      max: maxValues[4]
    }
  ]
}];

const RadarChart = function RadarChart(parent_selector, options, eval_data, updateProb, socket, normalize) {
  //Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
  const wrap = (text, width) => {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 0.5, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  } //wrap

  const cfg = {
    w: 600, //Width of the circle
    h: 600, //Height of the circle
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }, //The margins of the SVG
    levels: 3, //How many levels or inner circles should there be drawn
    maxValue: 0, //What is the value that the biggest circle will represent
    labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, //The opacity of the area of the blob
    dotRadius: 4, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10), //Color function,
    format: '.2%',
    unit: '',
    legend: false
  };

  //Put all of the options into a variable called cfg
  if ('undefined' !== typeof options) {
    for (var i in options) {
      if ('undefined' !== typeof options[i]) {
        cfg[i] = options[i];
      }
    } //for i
  } //if


  const allAxis = ["POINTS", "REBOUNDS", "BLOCKS", "STEALS", "ASSISTS"] //Names of each axis
  total = allAxis.length, //The number of different axes
    radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
    Format = d3.format(cfg.format) //The width in radians of each "slice"

  //Scale for the radius
  const rScale = (val) => d3.scaleLinear().range([0, radius]).domain([0, val]);

  // handle dragging of radar points
  function dragstarted() {
    d3.select(this).raise().classed("activeradar", true);
  }

  function dragged(d) {
    value = d.value + max(d3.event.dx / 3, d3.event.dy / 3)
    if (d.axis === "POINTS") {
      value = d.value - d3.event.dy / 3
      eval_data["PPG"] = normalize("PPG", value)

    }
    if (d.axis === "BLOCKS") {
      value = d.value + max(d3.event.dx / 10, d3.event.dy / 15)
      if (d3.event.dx < 0 || d3.event.dy < 0) {
        value = d.value + min(d3.event.dx / 10, d3.event.dy / 15)
      }

      eval_data["BLK"] = normalize("BLK", value)
    }
    if (d.axis === "STEALS") {
      value = d.value + min(-d3.event.dx / 10, d3.event.dy / 15)
      if (d3.event.dx < 0 || d3.event.dy > 0) {
        value = d.value + max(-d3.event.dx / 10, d3.event.dy / 15)
      }
      eval_data["STL"] = normalize("STL", value)
    }
    if (d.axis === "REBOUNDS") {
      value = d.value + d3.event.dx / 3
      norm = value / d.max
      eval_data["RB"] = normalize("RB", value)
    }

    if (d.axis === "ASSISTS") {
      value = d.value - d3.event.dx / 4
      norm = value / d.max
      eval_data["AST"] = normalize("AST", value)
    }
    updateProb(eval_data, socket)

    // prevent dragging outside chart
    if (value < 0) {
      value = 0
    }
    if (value > d.max) {
      value = d.max
    }
    d.value = value

    // move radar points
    d3.select(this)
      .attr("cx", rScale(d.max)(d.value) * cos(d.angle - HALF_PI))
      .attr("cy", rScale(d.max)(d.value) * sin(d.angle - HALF_PI));
    // redraw radar points
    d3.select(`.${d.axis}radarCircle`)
      .attr("cx", rScale(d.max)(d.value) * cos(d.angle - HALF_PI))
      .attr("cy", rScale(d.max)(d.value) * sin(d.angle - HALF_PI))
    tooltip
      .attr('x', this.cx.baseVal.value - 10)
      .attr('y', this.cy.baseVal.value - 10)
      .transition()
      .style('display', 'block')
      .text(Format(d.value) + cfg.unit);

    d3.select(".radarStroke").remove()
    d3.select(".radarArea").remove()
    d3.select(".arrow").remove()
    // redraw blobs
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", d => radarLine(d.axes))
      .style("fill", (d, i) => "#8FBC8F")
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function (d, i) {
        //Dim all blobs
        parent_selector.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1);
        //Bring back the hovered over blob
        d3.select(this)
          .transition().duration(200)
          .style("fill-opacity", 0.7);
      })
      .on('mouseout', () => {
        //Bring back all blobs
        parent_selector.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });


    // redraw the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        return radarLine(d.axes);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", (d, i) => "#8FBC8F")
      .style("fill", "none")
      .style("filter", "url(#glow)");

  }

  function dragended() {

    d3.select(this).classed("activeradar", false);
  }
  //Append a g element
  let g = parent_selector.append("g")
    .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

  /////////////////////////////////////////////////////////
  ////////// Glow filter for some extra pizzazz ///////////
  /////////////////////////////////////////////////////////

  //Filter for the outside glow
  let filter = g.append('defs').append('filter').attr('id', 'glow'),
    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
    feMerge = filter.append('feMerge'),
    feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
    feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  let axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", d => radius / cfg.levels * d)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  //Text indicating at what % each level is
  allAxis.forEach((val, index) => {
    axisGrid.selectAll(`.${val}axisLabel`)
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", d => -d * radius / cfg.levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text(d => Format(maxValues[index] * d / cfg.levels) + cfg.unit)
      .attr("transform", function (d) {
        return "rotate(" + (360 / total * index) + ")"
      })

  })

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis.append("line")
    // .class(`line`)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(maxValues[i])(maxValues[i] * 1) * cos(angleSlice * i - HALF_PI))
    .attr("y2", (d, i) => rScale(maxValues[i])(maxValues[i] * 1) * sin(angleSlice * i - HALF_PI))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  //Append the labels at each axis
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", (d, i) => rScale(maxValues[i])(maxValues[i] * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
    .attr("y", (d, i) => rScale(maxValues[i])(maxValues[i] * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
    .text(d => d)
    .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  const radarLine = d3.radialLine()
    .curve(d3.curveLinearClosed)
    .radius((d, i) => {
      return rScale(maxValues[i])(min(d.value, maxValues[i]))
    })
    .angle((d, i) => d.angle);

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed)
  }

  //Create a wrapper for the blobs
  let blobWrapper = g.selectAll(".radarWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", `radarArea`)
    .attr("d", d => radarLine(d.axes))
    .style("fill", (d, i) => "#8FBC8F")
    .style("fill-opacity", cfg.opacityArea)
    .on('mouseover', function (d, i) {
      //Dim all blobs
      parent_selector.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);
      //Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    })
    .on('mouseout', () => {
      //Bring back all blobs
      parent_selector.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  //Create the outlines
  blobWrapper.append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d.axes);
    })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", (d, i) => "#8FBC8F")
    .style("fill", "none")
    .style("filter", "url(#glow)");


  //Append the circles
  blobWrapper.selectAll(".radarCircle")
    .data(d => d.axes)
    .enter()
    .append("circle")
    .attr("class", (d) => `${d.axis}radarCircle`)
    .attr("r", cfg.dotRadius)
    .attr("cx", (d, i) => rScale(d.max)(d.value) * cos(d.angle - HALF_PI))
    .attr("cy", (d, i) => rScale(d.max)(d.value) * sin(d.angle - HALF_PI))
    .style("fill", (d) => "#A9A9A9")
    .style("fill-opacity", 0.8)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))


  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  /////////////////////////////////////////////////////////

  //Wrapper for the invisible circles on top
  const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper")

  const arrow =g.append("line")
    .attr("class", "arrow")
    .attr("x2", 50)
    .attr("y2", -10)
    .attr("x1", 150)
    .attr("y1", 50)
    .attr("stroke", "red")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)")
    .attr("fill-opacity", 0.4);
    g
  .append("text")
    .attr("class", "arrow")
    .attr('x', 170 )
    .attr('y', 70)
    .style("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("dx", "1em")
    .attr("fill", "#FF4500")
    .text("Click & Drag")
  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
    .data(d => d.axes)
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", (d, i) => rScale(d.max)(d.value) * cos(d.angle - HALF_PI))
    .attr("cy", (d, i) => rScale(d.max)(d.value) * sin(d.angle - HALF_PI))
    .style("fill", "none")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .style("pointer-events", "all")
    .on("mouseover", function (d, i) {
      tooltip
        .attr('x', this.cx.baseVal.value - 10)
        .attr('y', this.cy.baseVal.value - 10)
        .transition()
        .style('display', 'block')
        .text(Format(d.value) + cfg.unit);
    })
    .on("mouseout", function () {
      tooltip.transition()
        .style('display', 'none').text('');
    });


  const tooltip = g.append("text")
    .attr("class", "tooltip")
    .attr('x', 0)
    .attr('y', 0)
    .style("font-size", "12px")
    .style('display', 'none')
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em");


}
