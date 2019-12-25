import * as d3 from 'd3'
import data_model from './data_model'
let onLoad = true
const margin = ({top: 20, right: 30, bottom: 30, left: 40})

const data = data_model.studentData() 
const xData = data.map(cur=>cur[0])
const yData = data.map(cur=>cur[1])
const minX = Math.min(...xData)
const maxX = Math.max(...xData)

//INITIALIZE BASIC COMPONENTS
//chart
const svg = d3.select('#plot').append('svg')
//yaxis
const yaxis = svg.append('g')
  .attr("transform", `translate(${margin.left/2},0)`)
  .classed('axis', true)
//xaxis
const xaxis = svg.append('g')
  .classed('axis', true)
//data group
const g = svg.append('g')
//line
const drawLine = g.append('path')
  .classed('dataline', true)
//data nodes
let dataNodes = g.selectAll('circle')

//INITIALIZE SCALES
const yScale  = d3.scaleLinear()
  .domain([0, Math.max(...yData)])
  .nice()
const xScale = d3.scaleOrdinal()
  .domain(xData)

//initialize other stuff
const line = d3.line()

function resize() {
  const width = document.getElementById('plot').clientWidth;
  const height = width / 2;
  svg
    .attr('width', width)
    .attr('height', height);
  yScale.range([height-margin.bottom, margin.top])

  xScale.range(xData.map(cur => (cur-minX)*(width-margin.left-margin.right)/(maxX-minX)+margin.left))
  //yaxis
  yaxis
    .call(d3.axisLeft(yScale).tickSize(-(width-margin.left/2-margin.right)))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick text")
      .attr("x", 20)
      .attr("dy", -4))
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "2,2"))
  //xaxis
  xaxis
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .call(g => g.select(".domain").remove())
  line
    .x(d=>xScale(d[0]))
    .y(d=>yScale(d[1]))
  if (onLoad){
    onLoad = false
    drawLine.datum(data.map(cur=>[cur[0], 0]))
      .attr("d", line)
    dataNodes = dataNodes.data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(0))
      .attr('r', 3)
      .classed('datapoint-node', true);
      const t = d3.transition()
      .duration(1000)
    
    drawLine
      .transition(t)
      .attr("d", line(data));
    
    dataNodes
      .transition(t)
      .attr('cy', d => yScale(d[1]))  
  } else {
    drawLine
      .attr("d", line(data));
    dataNodes
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1])) 
  }
  
}

export default resize;
//Call our resize function if the window size is changed.

/* 
const xScale = d3.scaleOrdinal(
  xData,
  xData.map(cur => (cur-minX)*(width-margin.left-margin.right)/(maxX-minX)+margin.left)
)

const yScale  = d3.scaleLinear()
  .domain([0, Math.max(...yData)]).nice()
  .range([height-margin.bottom, margin.top])
//yaxis
svg.append('g')
  .attr("transform", `translate(${margin.left/2},0)`)
  .classed('axis', true)
  .call(d3.axisLeft(yScale).tickSize(-(width-margin.left/2-margin.right)))
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll(".tick text")
    .attr("x", 20)
    .attr("dy", -4))
  .call(g => g.selectAll(".tick:not(:first-of-type) line")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-dasharray", "2,2"))
//xaxis
svg.append('g')
  .classed('axis', true)
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xScale))
  .call(g => g.select(".domain").remove())


const line = d3.line()
  .x(d=>xScale(d[0]))
  .y(d=>yScale(d[1]))

const g = svg.append('g')

const drawLine = g.append('path')
drawLine.datum(data.map(cur=>[cur[0], 0]))
  .classed('dataline', true)
  .attr("d", line)

g.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d[0]))
  .attr('cy', d => yScale(0))
  .attr('r', 3)
  .classed('datapoint-node', true);

const t = d3.transition()
  .duration(1000)

drawLine
  .transition(t)
  .attr("d", line(data));

g.selectAll('circle')
  .transition(t)
  .attr('cy', d => yScale(d[1]))

 */