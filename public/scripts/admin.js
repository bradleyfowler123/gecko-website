//var password = prompt("WARNING ENTERING ADMIN PAGE, PRESS THE BACK BUTTON!");
//if (password=="abc") {

				// setup firebase
var config = {
      apiKey: "AIzaSyDgeRLn8kZuABS_3xXpbXqrAobeyOwMJVo",
      authDomain: "myfe-7d95e.firebaseapp.com",
      databaseURL: "https://myfe-7d95e.firebaseio.com",
      storageBucket: "myfe-7d95e.appspot.com",
      messagingSenderId: "902517110848"
  };
    firebase.initializeApp(config);
var database = firebase.database();
	var currentDate = new Date();


				// setup global variables
var allProjects = {}																					// used to store all the projects
var ul = document.getElementById("projectsList");														// list containing all of the projects

				// get firebase projects events data
var eventsRef = firebase.database().ref('activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/events');										// ref to access the activities
eventsRef.on('child_added', function(data) {
	allProjects[data.key] = [data.val().activity, data.val().location, data.val().date, data.val().time];
	var date = data.val().date.split('/'); var time = data.val().time.split(':');
	var eventDate = new Date(date[2], date[0] -1, date[1], time[0], time[1]);
	if (eventDate < currentDate) { // remove it from firebase
		var eventDelRef = firebase.database().ref('activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/events/' + data.key);
		eventDelRef.remove();
	}
	else {
		addListItem(data.key);
	}
});
eventsRef.on('child_changed', function(data) {
  console.log('change');
	delete allProjects[data.key];																		// remove project from the javascript list variable
	ul.removeChild(document.getElementById(data.key));													// remove project from list displayed in html
  	allProjects[data.key] = [data.val().activity, data.val().location, data.val().date, data.val().time];										// add project from the javascript list variable
  	addListItem(data.key);																				// add project from list displayed in html
});
eventsRef.on('child_removed', function(data) {
  	delete allProjects[data.key];
    console.log(allProjects);
 //  ul.removeChild(document.getElementById(data.key));
});




				// function to populate projects list in the html
function addListItem(key) {
	var li = document.createElement("li");

	var para = document.createElement("p");
	var node = document.createTextNode(allProjects[key][0]);
	para.appendChild(node);
	li.appendChild(para);
	var para = document.createElement("p");
	var node = document.createTextNode(allProjects[key][1]);
	para.appendChild(node);
	li.appendChild(para);
	var para = document.createElement("p");
	var node = document.createTextNode(allProjects[key][2]);
	para.appendChild(node);
	li.appendChild(para);
	var para = document.createElement("p");
	var node = document.createTextNode(allProjects[key][3]);
	para.appendChild(node);
	li.appendChild(para);
	var para = document.createElement("p");
	var node = document.createTextNode(key);
	para.appendChild(node);
	li.appendChild(para);

	li.setAttribute("id", key);
	li.setAttribute("class", "col-sm-6");
	ul.appendChild(li);
}


				// function to write test data to firebase

function newItemSubmit() {
  var x = document.getElementById("uploadEventForm");

  var emptyItem = false;
  for (var i = 0; i < x.length -1; i++) {
    if (x[i].value == "") {
      emptyItem = true;
    }
  }
  if (emptyItem) {alert("Please fill in all the boxes.");}
  else {
    var dkey = firebase.database().ref('activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/events').push().key;
    var bkey = firebase.database().ref('busers/agora/items').push().key;
    var postData = {
      activity: x[0].value,
      date: formatDate(x[1].value),
      time: x[2].value,
      activityDescription: x[3].value,
      location : x[4].value,
      price: parseInt(x[5].value),
      image: x[6].value,
      url: x[7].value,
      familyfriendly: (x[8].value == "true"),
      indoor: (x[9].value == "true"),
      disabled: (x[10].value == "true"),
      parking: (x[11].value == "true"),
      pet: (x[12].value == "true"),
      toilet: (x[13].value == "true"),
      totalgoing: 0
      };

    var updates = {};
    updates['/activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/events/' + dkey] = postData;
    updates['/busers/agora/items/' + bkey] = 'United Kingdom%%England%%Cambridgeshire%%Cambridge/events/' + dkey;

    firebase.database().ref().update(updates);
    
    alert(x[0].value + " Added.");
  }
}

function formatDate(input) {
  var parts = input.split("-")
  return parts[1]+'/'+parts[0] +'/'+parts[2];
}
        // function runs everytime type of item changes between activity and event inorder to toggle displaying the date and time form entry boxes



$(".form-check-input").change(function(){ this.value = this.checked })
