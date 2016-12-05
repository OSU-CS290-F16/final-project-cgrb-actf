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
    var json_file = FileHelper.readStringFromFileAtPath("/class_list.json");
    var class_list = JSON.parse(json_file);
    for(var i=0; i<class_list['name'].length; i++){
        var newLink = document.createElement('a');
        newLink.setAttribute('href', 'https://jupyter.cgrb.oregonstate.edu/classes/'+class_list['name'][i]);
        newLink.textContent=class_list['readable'][i];
        dropDown.appendChild(newLink);
    }
}

/* Sends the request to add a new class to the server */
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
	
	// Get the values from the form.
	var instructorId = document.getElementById('instructor-id').value;
	var instructorFirst = document.getElementById('instructor-first').value;
	var instructorLast = document.getElementById('instructor-last').value;
	var email = document.getElementById('email').value;
	var classCode = document.getElementById('class-code').value;
	var className = document.getElementById('class-name').value;
	var description = document.getElementById('description').value;
	
	var error = '';
	
	// Data validation
	if(!instructorId) {
		error += 'Please enter your user id.\n';
	}
	if(!instructorFirst) {
		error += 'Please enter your first name.\n';
	}
	if(!instructorLast) {
		error += 'Please enter your last name.\n';
	}
	if(!email) {
		error += 'Please enter your email.\n';
	}
	if(!classCode) {
		error += 'Please enter a class code.\n';
	}
	if(!className) {
		error += 'Please enter a class name.\n';
	}
	if(!description) {
		error += 'Please enter a class description.\n';
	}	
	
	// If all the forms were not filled out correctly, make an alert and stop the process
	if(error) {
		alert('The following errors were detected:\n' + error);
	}
	else {
		var postRequest = new XMLHttpRequest();
		postRequest.open('POST', '/classes/create/add');
		postRequest.setRequestHeader('Content-Type', 'application/json');

		// Callback when the data has been sent.
		// Updates the page with the results.
		postRequest.addEventListener('load', function (event) {
			var error;
			if (event.target.status !== 200) {
				error = event.target.response;
			}			
			
			res = JSON.parse(this.response);
			console.log(JSON.parse(this.response));
			
			createConfirmation = document.querySelector('.create-confirmation');
			
			if (res.error) {
				createConfirmation.innerHTML = '<div style="color:red;text-align:center">Creation failed</div>';
			}	
			else {
				createConfirmation.innerHTML = '<div style="color:green;text-align:center">Creation succeeded</div>';
			}
			
			createConfirmation.innerHTML +=
				'<code>' + 
				res.stdout.replace('\n', '<br>') +
				'</code>';
				
			createConfirmation.style.display = 'block';
		
		});

		postRequest.send(JSON.stringify({
			instructorId: instructorId,
			instructorFirst: instructorFirst,
			instructorLast: instructorLast,
			email: email,
			classCode: classCode,
			className: className,
			description: description
		}));
	}
}


populateDropDown();

window.addEventListener('DOMContentLoaded', function (event) {
	// Add new class button
	document.querySelector('.add-class-button').addEventListener('click', addClass);
});
