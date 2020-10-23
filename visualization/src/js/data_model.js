import * as d3 from 'd3'
import {city, state, limits} from '../../../processing/exports/byschool.json'
import {
  city as icity, 
  country as icountry, 
  dictionary, 
  income_bins, 
  state as istate,
  limits as ilimits
} from '../../../processing/exports/byincome.json'

const cityArray = Object.entries(city).reduce((acc, [stateName, _state])=>{
  return Object.entries(_state).reduce((_acc, [cityName, _city])=>{
    _acc.push({
      city: cityName, 
      state: stateName, 
      value: _city
    })
    return _acc;
  }, acc)
}, [])

function get_income_bins(){
  const bins = [0, ...income_bins];
  const bins_border = bins.slice(0,-1).map((c,i)=>[c, bins[i+1]]);
  const bins_center = bins_border.map(cur=>(cur[0]+cur[1])/2);
  bins_center[16] = bins_border[16][0];
  return {
    bins_border,
    bins_center
  };
}

function getDataForIncomeChart(schoolType='2.0', testType=2, level='country', state='', city=''){
  const accessor =  (level == 'country')  ?  icountry :
                    (level == 'state')    ? istate[state] :
                    (level == 'city')     ? icity[state][city] : undefined;
  if(!accessor){
    return {
      data:[],
      limits: (testType == 4) ? [0,1000] : ilimits[level] 
    };
  }
  return {
    data: 'ABCDEFGHIJKLMNOPQ'.split('').map(
      c=>{
        try{
          return [c, accessor[schoolType][c][testType]];
        } catch(e){
          return null;
        }
      }
    ).filter(cur=>cur && cur[1]),
    limits: (testType == 4) ? [0,1000] : ilimits[level]
  };
  
}

function estateMean(s, schoolType='2.0', testType=5){
  const lim = (testType == 4) ? limits.redacao : limits.general;
  if(state[s] && state[s][schoolType]){
    return state[s][schoolType][testType];
  }
  return null;
  
  
}
function cityMean(s, c, schoolType='2.0', testType=5){
  const lim = (testType == 4) ? limits.redacao : limits.general;
  if (city[s] &&
      city[s][c] &&
      city[s][c][schoolType]) 
  {
    return city[s][c][schoolType][testType];
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

function rankedCities(schoolType='2.0', testType=5){
  return cityArray.filter(cur=>!!cur.value[schoolType]).sort((a,b)=>(
    b.value[schoolType][testType] - a.value[schoolType][testType]
  ))
}


export default {
  rankedCities,
  getLimits,
  estateMean, 
  cityMean,
  studentCategory,
  studentData,
  get_income_bins,
  getDataForIncomeChart
}