import * as d3 from 'd3'

function estateMean(name){
  return d3.interpolateRdYlBu(Math.random())
}
function cityMean(name){
  return d3.interpolateRdYlBu(Math.random())
}

function studentCategory(type){
  return ['ABCDEFGH'.split(''), [0,1,2,3,4,5,6,7]]
}

function studentData(type){
  return [
    [1, 100],
    [2, 120],
    [3, 150],
    [4, 80],
    [5.5, 100],
    [6, 110],
    [7, 120],
    [8, 150]
  ]
}
export default {
  estateMean, 
  cityMean,
  studentCategory,
  studentData
}