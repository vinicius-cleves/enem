import map, {signUpForUpstreamUpdate} from './map'
import plot from './plot'

function bindTestTypeButtons(){
  for(let i = 0; i<7; i++){
    document.getElementById('TestType'+i).addEventListener('click', ()=>{
      update({testType:i});   
    });
  }
}
bindTestTypeButtons()
function bindSchoolTypeButtons(){
  for(let i = 1; i<5; i++){
    document.getElementById('SchoolType'+i).addEventListener('click', ()=>{
      update({schoolType:''+i+'.0'});   
    });
  }
}
bindSchoolTypeButtons()


function update(u){
  map(u);
  plot(u);
}

signUpForUpstreamUpdate(update)

window.onresize = ()=>{
  update()
};
