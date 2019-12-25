import * as d3 from 'd3'
import {city, state, limits} from '../../../processing/exports/byschool.json'
console.log(state)
function estateMean(s, schoolType='2.0', option=5){
  const lim = (option == 4) ? limits.redacao : limits.general;
  if(state[s] && state[s][schoolType]){
    return state[s][schoolType][6];
  }
  return null;
  
  
}
function cityMean(s, c, schoolType='2.0', option=5){
  const lim = (option == 4) ? limits.redacao : limits.general;
  if (city[s] &&
      city[s][c] &&
      city[s][c][schoolType]) 
  {
    return city[s][c][schoolType][option];
  }
  return null;
  //d3.interpolateRdYlBu(Math.random())
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

function getLimits(testType){
  return (testType == 4) ? limits.redacao : limits.general;
}
export default {
  getLimits,
  estateMean, 
  cityMean,
  studentCategory,
  studentData
}