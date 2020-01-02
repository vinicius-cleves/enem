import * as d3 from 'd3'
import enem from './data_model'
//Variables that control display
let schoolType = '2.0';
let testType = 0; 
let selectedEstate;
let selectedCity;

const best = d3.select('#ranking-best');
const worst = d3.select('#ranking-worst');


const draw = () => {
  const rank = enem.rankedCities(schoolType, testType);
  const selectedPos = selectedCity ? rank.findIndex((cur=>( 
    (cur.city==selectedCity.properties.name) && 
    (cur.state==selectedCity.properties.uf) 
  ))) : -1;
  let bestData, worstData;
  if((selectedPos <= 5) || (selectedPos == -1)){
    bestData = rank.slice(0,5).map((cur, idx)=>({data:cur, pos:idx+1}))
  } else {
    bestData = [
      ...rank.slice(0,4).map((cur, idx)=>({
        data:cur, 
        pos:idx+1
      })), 
      {
        data:rank[selectedPos], 
        pos:selectedPos+1
      }].sort((a,b)=>a.pos-b.pos)
  }
  if((selectedPos > (rank.length-6)) || (selectedPos == -1)){
    worstData = rank.slice(-5,rank.length).map((cur, idx)=>({data:cur, pos:rank.length-4+idx}))
  } else {
    worstData = [
      {
        data: rank[selectedPos], 
        pos:selectedPos+1
      }, 
      ...rank.slice(-4,rank.length).map((cur, idx)=>({
        data:cur, 
        pos:rank.length-4+idx
      }))].sort((a,b)=>a.pos-b.pos)
  }
  //TODO: find a way to update instead of rerendering everything
  best.selectAll('tr').remove()
  best.selectAll('tr').data(bestData)
    .join(
      enter=>enter.append('tr')
        .classed('active', d=>(d.pos==(selectedPos+1)))
        .call(tr=>tr.append('td')
          .classed('position', true)
          .text((d)=>(`${d.pos}°`))
        )
        .call(tr=>tr.append('td')
          .classed('city', true)
          .text((d)=>(`${d.data.city} - ${d.data.state}`))
        )
        .call(tr=>tr.append('td')
          .classed('value', true)
          .text((d)=>d.data.value[schoolType][testType])
        ),
      update=>update,
      exit=>exit.remove()
    )
  worst.selectAll('tr').remove()
  worst.selectAll('tr').data(worstData)
    .join(
      enter=>enter.append('tr')
        .classed('active', d=>(d.pos==(selectedPos+1)))
        .call(tr=>tr.append('td')
          .classed('position', true)
          .text((d)=>(`${d.pos}°`))
        )
        .call(tr=>tr.append('td')
          .classed('city', true)
          .text((d)=>(`${d.data.city} - ${d.data.state}`))
        )
        .call(tr=>tr.append('td')
          .classed('value', true)
          .text((d)=>d.data.value[schoolType][testType])
        ),
      update=>update,
      exit=>exit.remove()
    )
  

}

let updateUpstreamHandler;
export function registerForUpstreamUpdate(handler){
  updateUpstreamHandler = handler;
} 
function updateUpstream(u){
  updateUpstreamHandler(u);
}

function update(props={}){
  if(props.hasOwnProperty('schoolType'))  { schoolType = props.schoolType; }
  if(props.hasOwnProperty('testType'))    { testType = props.testType; }
  if(props.hasOwnProperty('selectedEstate')) { selectedEstate = props.selectedEstate; }
  if(props.hasOwnProperty('selectedCity')) { selectedCity = props.selectedCity; }
  draw()
}

export default update;