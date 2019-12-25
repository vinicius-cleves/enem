import * as d3 from 'd3'
import data_model from './data_model'
//Variables that control display
let schoolType = '2.0';
let testType = 6; 
let selectedEstate;
let selectedCity;
//
let onLoad = true
const margin = ({top: 20, right: 30, bottom: 30, left: 40})
const { bins_border, bins_center} = data_model.get_income_bins()
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
//let dataNodes = g.selectAll('circle')

//INITIALIZE SCALES
const yScale  = d3.scaleLinear()

const mapScale = d3.scaleLinear()
  .domain([Math.min(...bins_center), Math.max(...bins_center)])

const xScale = d3.scaleOrdinal()
  .domain('ABCDEFGHIJKLMNOPQ'.split(''))

//initialize other stuff
const line = d3.line()

//print legend
document.getElementById('plot-legend').innerHTML = 'Faixas de renda por pessoa na familia (em reais):<br>'+ 
'A: Sem rendimento&nbsp;&nbsp;&nbsp;&nbsp;'+
'BCDEFGHIJKLMNOP'.split('').map((c,i)=>c+': '+Math.round(bins_border[i+1][0])+' - '+Math.round(bins_border[i+1][0])).join('&nbsp;&nbsp;&nbsp;&nbsp;')+
'Q: '+Math.round(bins_border[16][0])+'+';
function draw() {
  const width = document.getElementById('plot').clientWidth;
  document.getElementById('plot-reference').innerHTML = 
    (selectedCity ? (selectedCity.properties.name + ', ') : '') +
    (selectedEstate ? selectedEstate.id : 'Brasil');
  const height = width / 2;
  const {data, limits} = data_model.getDataForIncomeChart(
    schoolType, 
    testType, 
    selectedCity ? 'city' : selectedEstate ? 'state' : 'country',
    selectedEstate ? selectedEstate.id : null,
    selectedCity ? selectedCity.properties.name : null
    ) 
  const yData = data.map(cur=>cur[1])
  const [minY, maxY] = limits 
  svg
    .attr('width', width)
    .attr('height', height);
  yScale
  .domain([minY, maxY]).nice()
  .range([height-margin.bottom, margin.top])
  
  mapScale.range([margin.left, width-margin.right])
  
  xScale.range(bins_center.map(cur => mapScale(cur)))
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
  const t = d3.transition()
    .duration(1000)
  if (onLoad){
    onLoad = false
    
    drawLine.datum(data.map(cur=>[cur[0], minY]))
      .attr("d", line)
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(minY))
      .attr('r', 3)
      .classed('datapoint-node', true)
      .transition(t)
      .attr('cy', d => yScale(d[1]));
    
    drawLine
      .transition(t)
      .attr("d", line(data));
     
  } else {
    drawLine
      .transition(t)
      .attr("d", line(data));
    g.selectAll('circle')
      .data(data, d=>d[0])
      .join(
        enter=>enter.append('circle')
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScale(d[1]))
        .attr('r', 3)
        .classed('datapoint-node', true),
        update=>update,
        exit=>exit.remove()
      )
      .transition(t)
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1])) 
  }
  
}

function update(props={}){
  if(props.hasOwnProperty('schoolType'))  { schoolType = props.schoolType; }
  if(props.hasOwnProperty('testType'))    { testType = props.testType; }
  if(props.hasOwnProperty('selectedEstate')) { selectedEstate = props.selectedEstate; }
  if(props.hasOwnProperty('selectedCity')) { selectedCity = props.selectedCity; }
  draw()
}

export default update;
