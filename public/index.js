document.getElementsByClassName('navbar-dropdown')[0].addEventListener("click", dropDown);

function dropDown(event){
  document.getElementById("class-dropdown").classList.toggle("show");
}

window.onclick = function(event){
  if(!event.target.matches('.navbar-dropdown')){
    var dropdowns = document.getElementsByClassName('dropdown-content');
    for(var i=0; i<dropdowns.length; i++){
      if(dropdowns[i].classList.contains('show')){
        dropdowns[i].classList.remove('show');
      }
    }
  }
}

function clearDropDown(){
    var dropDown = document.getElementById('class-dropdown');
    while(dropDown.firstChild){
        dropDown.removeChild(dropDown.firstChild);
    }
}

