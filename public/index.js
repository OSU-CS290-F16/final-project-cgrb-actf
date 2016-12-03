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
function FileHelper()
{}
{
    FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom)
        {
                var request = new XMLHttpRequest();
                request.open("GET", pathOfFileToReadFrom, false);
                request.send(null);
                var returnValue = request.responseText;

                return returnValue;
        }
}


function clearDropDown(){
    var dropDown = document.getElementById('class-dropdown');
    while(dropDown.firstChild){
        dropDown.removeChild(dropDown.firstChild);
    }
}

function populateDropDown(classList){
    clearDropDown();
    var dropDown = document.getElementById('class-dropdown');
    var json_file = FileHelper.readStringFromFileAtPath("class_list.json");
    var class_list = JSON.parse(json_file);
    for(var i=0; i<class_list['name'].length; i++){
        var newLink = document.createElement('a');
        newLink.setAttribute('href', 'https://jupyter.cgrb.oregonstate.edu/classes/'+class_list['name'][i]);
        newLink.textContent=class_list['readable'][i];
        dropDown.appendChild(newLink);
    }
}

function addClass() {
	/*
		Read the following form ids:
			instructor-id
			instructor-first
			instructor-last
			email
			class-code
			class-name
			description
	*/
	var instructorId = document.getElementById('instructor-id').value;
	var instructorFirst = document.getElementById('instructor-first').value;
	var instructorLast = document.getElementById('instructor-last').value;
	var email = document.getElementById('email').value;
	var classCode = document.getElementById('class-code').value;
	var className = document.getElementById('class-name').value;
	var description = document.getElementById('description').value;
}


populateDropDown();

window.addEventListener('DOMContentLoaded', function (event) {
	// Add new class button
	document.querySelector('.add-class-button').addEventListener('click', addClass);
});
