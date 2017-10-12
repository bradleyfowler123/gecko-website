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


				// setup global variables
var allProjects = {}																					// used to store all the projects
var ul = document.getElementById("projectsList");														// list containing all of the projects


				// get firebase projects activity data
var activitiesRef = firebase.database().ref('activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/activities');										// ref to access the activities
activitiesRef.on('child_added', function(data) {
	allProjects[data.key] = [data.val().activity, data.val().image, data.val().url];
	addListItem(data.key);
});
activitiesRef.on('child_changed', function(data) {
	delete allProjects[data.key];																		// remove project from the javascript list variable
	ul.removeChild(document.getElementById(data.key));													// remove project from list displayed in html
  	allProjects[data.key] = [data.val().activity, data.val().image, data.val().url];										// add project from the javascript list variable
  	addListItem(data.key);																				// add project from list displayed in html
});
activitiesRef.on('child_removed', function(data) {
  	delete allProjects[data.key];
  	ul.removeChild(document.getElementById(data.key));
});
				// get firebase projects events data
var eventsRef = firebase.database().ref('activitydata/placeData/United Kingdom%%England%%Cambridgeshire%%Cambridge/events');										// ref to access the activities
eventsRef.orderByChild("date").on('child_added', function(data) {
	allProjects[data.key] = [data.val().activity, data.val().image, data.val().url];
	addListItem(data.key);
});
eventsRef.on('child_changed', function(data) {
	delete allProjects[data.key];																		// remove project from the javascript list variable
	ul.removeChild(document.getElementById(data.key));													// remove project from list displayed in html
  	allProjects[data.key] = [data.val().activity, data.val().image, data.val().url];										// add project from the javascript list variable
  	addListItem(data.key);																				// add project from list displayed in html
});
eventsRef.on('child_removed', function(data) {
  	delete allProjects[data.key];
  	ul.removeChild(document.getElementById(data.key));
});




				// function to populate projects list in the html
function addListItem(key) {
	var li = document.createElement("li");

	var para = document.createElement("h3");
	var node = document.createTextNode(allProjects[key][0]);
	para.appendChild(node);
	li.appendChild(para);
	var div = document.createElement("div");
	var img = document.createElement("img");
	img.setAttribute("src", allProjects[key][1])
	var a = document.createElement("a");
	a.setAttribute("href", allProjects[key][2]);
	a.appendChild(img);
	div.appendChild(a);
	li.appendChild(div);

	li.setAttribute("id", key);
	li.setAttribute("class", "col-sm-3");
	ul.appendChild(li);
}


				// handle town name
var changeCityButton = document.querySelector('#button_change_area');
var cityLabel = document.querySelector('section .container h3');
changeCityButton.onclick = function() {
  var name = prompt("Enter your town's name");
  cityLabel.innerHTML = name;
}
