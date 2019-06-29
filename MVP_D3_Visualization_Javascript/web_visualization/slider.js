 const renderHorizontalSlider = (color, x, y, min, max, step, format = '', thisCanvas, margin, text,eval_data, updateProb,socket, normalize) => {

   var slider = d3
   .sliderHorizontal()
     .min(min)
     .max(max)
     .step(step)
     .handle(
       d3
       .symbol()
       .type(d3.symbolCircle)
       .size(200)()
     )
     .width(250)
     .default(max / 2)
     .displayValue(true)
     .ticks(0)
     .tickFormat(d3.format(format))
     .fill(color)
     .on('onchange', num => {
       if (text === "Minutes Per Game") {
         eval_data["MPG"] = normalize("MPG",num)
       }
       if (text === "Field Goal%") {
         eval_data["FG."] = normalize("FG.",num)

       }
       if (text === "Free-Throw%") {
         eval_data["FT."] = normalize("FT.",num)
       }
       if (text === "Free Throw Rate") {
         eval_data["FTr"] = normalize("FTr",num)
       }
       if (text === "Games Played") {
         eval_data["G"] = normalize("G",num)
       }
       updateProb(eval_data,socket)
     });

   thisCanvas
     .append('g')
     .attr('transform', `translate(${margin.left * x},${margin.top * y})`)
     .call(slider);

   thisCanvas
     .append('g')
     .attr("class", "slidertitle-container")
     .append("rect")
     .attr("width", 80)
     .attr("height", 20)
     .attr("fill", "#fff")
     .attr('transform', `translate(${margin.left * x},${margin.top * y-40})`)

   thisCanvas
     .append('g')
     .attr("class", "slidertitle-text")
     .append("text")
     .attr("fill", "#696969")
     .style("font-size", "12px")
     .attr('transform', `translate(${margin.left * x},${margin.top * y-25})`)
     .text(text)
 }

 const renderVerticalSlider = (color, x, y, thisCanvas, margin, text1, text2,eval_data, updateProb,socket, normalize, denormalize) => {

   var slider = d3
     .sliderVertical()
     .min(0)
     .max(82)
     .step(1)

     .height(200)
     .default(41)
     .displayValue(true)
     .ticks(0)
     .fill(color)
     .on('onchange', num => {
       if (text1.includes("Last")) {
        owp = num / 82
         num = denormalize("WP",eval_data["WP"]) - owp
         eval_data["CWP"] = normalize("CWP",num)
       }
       if (text1.includes("This")) {
         nwp = num / 82
         delta = nwp - denormalize("WP",eval_data["WP"])
         eval_data["WP"] = normalize("WP",nwp)
         eval_data["CWP"] = normalize("CWP",delta + denormalize("CWP",eval_data["CWP"]))
       }
       updateProb(eval_data,socket)
     });

   thisCanvas
     .append('g')
     .attr('transform', `translate(${margin.left * x},${margin.top * y})`)
     .call(slider);

   thisCanvas
     .append('g')
     .attr("class", "slidertitle-container")
     .append("rect")
     .attr("width", 55)
     .attr("height", 40)
     .attr("fill", "#fff")
     .attr('transform', `translate(${margin.left * x-30},${margin.top * y+210})`)

   thisCanvas
     .append('g')
     .attr("class", "slidertitle-text")
     .append("text")
     .attr("fill", "#696969")
     .style("font-size", "12px")
     .attr('transform', `translate(${margin.left * x-30},${margin.top * y+230})`)
     .text(text1)
   thisCanvas
     .append('g')
     .attr("class", "slidertitle-text")
     .append("text")
     .attr("fill", "#696969")
     .attr('transform', `translate(${margin.left * x-25},${margin.top * y+230})`)
     .style("font-size", "12px")
     .attr('dy', '1em')
     .text(text2)

    }
