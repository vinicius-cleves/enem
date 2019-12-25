import * as d3 from 'd3'
import * as topojson from "topojson-client";
import enem from './data_model'
//import Municipios from '../dados/mapas/gis-dataset-brasil/municipio/geojson/municipio.json'
import Municipios_topojson from '../assets/maps/gis-dataset-brasil/municipio/topojson/municipio.json'
import Brasil_topojson from '../assets/maps/gis-dataset-brasil/uf/topojson/uf.json'
//Variables that control display
let schoolType = '2.0';
let testType = 6; 

const svg = d3.select('#map')
const width = svg.attr('width')
const height = svg.attr('height')
const munIdFunc = (d) => d.properties.NOME+d.properties.UF
const Brasil = topojson.feature(Brasil_topojson, Brasil_topojson.objects.uf)

const projection = d3.geoMercator()
  .translate([0, 0])
  .scale(1);

const path = d3.geoPath(projection);

//finish set up projection
const bbox = path.bounds( Brasil )

const s = 20 * .95 / Math.max((bbox[1][0] - bbox[0][0]) / width, (bbox[1][1] - bbox[0][1]) / height);
const t = [(width - s * (bbox[1][0] + bbox[0][0])) / 2, (height - s * (bbox[1][1] + bbox[0][1])) / 2];

// Update the projection    
projection
  .scale(s)
  .translate(t);

//begin to draw
const colorscale = d3.scaleSequential(d3.interpolateRdYlBu)
  .domain(enem.getLimits(testType));

const background = svg.append("rect")
  .classed('map-background', true)
  .attr("width", width)
  .attr("height", height)
  .on("click", reset);
    
const {scale, translate} = getScale(Brasil)
const mapG = svg.append("g")
  .style("stroke-width", "1.5px")
  .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
 
//Bind data and create one path per GeoJSON feature
const states = mapG.selectAll("path")
  .data(Brasil.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr('id', (datapoint)=>datapoint.id)
  .classed("estate", true)
  .style('fill', (d)=>{
    const val = enem.estateMean(d.id, schoolType, testType);
    return val ? colorscale(val) : '#fff';
  })
  .on('click', (datapoint)=>selectEstate(datapoint));

const mun = mapG.append('g')

mapG.append("path")
  .datum( topojson.mesh(Brasil_topojson, Brasil_topojson.objects.uf, (a, b)=>a!==b) )      
  .attr('fill', 'none')
  .attr("stroke", "black")
  .attr("stroke-linejoin", "round")
  .attr("d", path);
console.log('teste', d3.interpolateYlGn)

// add legend
const legendheight = height*0.6;
const legendwidth = 60;
const margin = { top: 20, bottom: 20, left: 5, right: 30 };

const legend = d3.select('#legend-map');


var canvas = legend
    .style("height", legendheight + "px")
    .style("width", legendwidth + "px")
    .style("position", "relative")
    .append("canvas")
    .attr("height", legendheight - margin.top - margin.bottom)
    .attr("width", 1)
    .style("height", (legendheight - margin.top - margin.bottom) + "px")
    .style("width", (legendwidth - margin.left - margin.right) + "px")
    .style("border", "1px solid #000")
    .style("position", "absolute")
    .style("top", (margin.top) + "px")
    .style("left", (margin.left) + "px")
    .node();

var ctx = canvas.getContext("2d");

var legend_svg = legend
    .append("svg")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", "0px")
    .style("top", "0px")
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
    

function updateColourScale(testType) {
  colorscale.domain(enem.getLimits(testType)).nice()

  const legendscale = d3.scaleLinear()
  .domain(colorscale.domain())
  .range([1, legendheight - margin.top - margin.bottom]);
  
  // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
  var image = ctx.createImageData(1, legendheight);
  d3.range(legendheight).forEach(function(i) {
    var c = d3.rgb(colorscale(legendscale.invert(i)));
    image.data[4*i] = c.r;
    image.data[4*i + 1] = c.g;
    image.data[4*i + 2] = c.b;
    image.data[4*i + 3] = 255;
  });
  ctx.putImageData(image, 0, 0);

  legend_svg
    .call(d3.axisRight(legendscale));
}



function getMunicipios(stateId){
  return topojson.feature(Municipios_topojson, 
    { ...Municipios_topojson.objects.Munic,
      geometries: Municipios_topojson.objects.Munic.geometries.filter(cur=>cur.properties.uf === stateId)
    }
  )
}

function selectEstate(d){
  const selectedEstate = d.id
  
  const {scale, translate} = getScale(d)

  const t = mapG.transition()
    .duration(750)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

  const join = mun.selectAll('path')
    .data(getMunicipios(selectedEstate).features, munIdFunc)
  
  join.exit()
    .transition(t)
    .attr('opacity', '0')
    .remove()

  join.enter()
    .append('path')
    .attr("d", path)
    .attr('id', (d)=>d.properties.NOME)
    .on('click', (d)=>console.log(d.id))
    .style("fill", (d)=>{
      const val = enem.cityMean(d.properties.uf, d.properties.name, schoolType, testType);
      return val ? colorscale(val) : '#fff'
    })
    .attr('opacity', '0')
    .transition(t)
    .attr('opacity', '1');
      

  background.classed('clickable', true)
}


function getScale(d){
  var bounds = path.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = .9 / Math.max(dx / width, dy / height),
    translate = [width / 2 - scale * x, height / 2 - scale * y];
  return {scale, translate}
}

function reset(){
  console.log('b;a')
  const t = d3.transition().duration(750);
  mun.selectAll('path')
  .data([], munIdFunc)
  .exit()
  .transition(t)
  .attr('opacity', '0')
  .remove()

  const {scale, translate} = getScale(Brasil)
  mapG.transition(t)
    .style("stroke-width", "1.5px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  
  background.classed('clickable', false)
  
}

export function repaint(schoolType_, testType_){
  if(schoolType_) {
    schoolType = schoolType_;
  }
  if (testType_) {
    testType = testType_
  };
  mun.selectAll('path')
    .style("fill", (d)=>enem.cityMean(d.properties.uf, d.properties.name, schoolType, testType))
  states
    .style('fill', (d)=>enem.estateMean(d.id, schoolType, testType))
  updateColourScale(testType)
}


