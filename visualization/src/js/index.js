import map, {repaint} from './map'
import plot from './plot'

function bindTestTypeButtons(){
  for(let i = 0; i<7; i++){
    document.getElementById('TestType'+i).addEventListener('click', ()=>{
      repaint(null, i);   
    });
  }
}
bindTestTypeButtons()
function bindSchoolTypeButtons(){
  for(let i = 1; i<5; i++){
    document.getElementById('SchoolType'+i).addEventListener('click', ()=>{
      repaint(''+i+'.0', null);   
    });
  }
}
bindSchoolTypeButtons()

window.onresize = ()=>{
  map();
  plot();
};