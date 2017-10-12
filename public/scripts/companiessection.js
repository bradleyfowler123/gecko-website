var database = firebase.database();
var name, email, photoUrl, uid, emailVerified;
var allProjects = {};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
     document.getElementById("enterItem").setAttribute('style', 'display:flex');
     document.getElementById("signupBanner").setAttribute('style', 'display:none');
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid;
      document.getElementById("companyName").innerHTML = name;
      
      var itemsRef = firebase.database().ref('busers/'+uid+'/items');                   // ref to access the activities
      itemsRef.on('child_added', function(data) {
        getItemData(data.val());
      });

  } else {
     document.getElementById("enterItem").setAttribute('style', 'display:none');
     document.getElementById("signupBanner").setAttribute('style', 'display:flex');
      name = null;
      email = null;
      photoUrl = null;
      emailVerified = null;
      uid = null;
  }
});


function loginSignup() {
  var email = document.getElementById("signInEmailInputText").value;
  var password = document.getElementById("signInPassInputText").value;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(firebaseUser) {
      // success
      // check to see if they are a business user, if yes then get their uploaded items

   })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(error);
    // ...
  });
}

function signout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
}


// function to get an items data given it's ref;
function getItemData(ref) {
  firebase.database().ref('activitydata/placeData/' + ref).on('value', function(data) {
    allProjects[data.key] = [data.val().activity, data.val().image, data.val().url];
    var li = document.createElement('li');
    li.innerHTML = data.val().activity;
    var ul = document.getElementById("companyItems");
    ul.appendChild(li);
  });
}


				// function to write test data to firebase

function newItemSubmit() {
  var x = document.getElementById("frmNewItem");

  var emptyItem = false;
  for (var i = 0; i < x.length -1; i++) {
    if (x[i].value == "") {
      emptyItem = true;
    }
  }
  if (emptyItem) {alert("Please fill in all the boxes.");}
  else {
    var ref; var loc;
    if (x[0].value == "Activity") {
      loc = 'United Kingdom%%England%%Cambridgeshire%%Cambridge/activities';
      ref = firebase.database().ref('activitydata/placeData/' + loc).push();
      ref.set({
        activity: x[1].value,
        activityDescription: x[2].value,
        location : x[3].value,
        price: parseInt(x[4].value),
        image: x[5].value,
        url: x[6].value,
        familyfriendly: (x[7].value == "true"),
        indoor: (x[8].value == "true"),
        disabled: (x[9].value == "true"),
        parking: (x[10].value == "true"),
        pet: (x[11].value == "true"),
        toilet: (x[12].value == "true")
      });
    }
    else {
      Date.parse(x[2].value);
      loc = 'United Kingdom%%England%%Cambridgeshire%%Cambridge/events';
      ref = firebase.database().ref('activitydata/placeData/' + loc).push();
      ref.set({
        activity: x[1].value,
        date: formatDate(x[2].value),
        time: x[3].value,
        activityDescription: x[4].value,
        location : x[5].value,
        price: parseInt(x[6].value),
        image: x[7].value,
        url: x[8].value,
        familyfriendly: (x[9].value == "true"),
        indoor: (x[10].value == "true"),
        disabled: (x[11].value == "true"),
        parking: (x[12].value == "true"),
        pet: (x[13].value == "true"),
        toilet: (x[14].value == "true"),
        totalgoing: 0
      });
    }
        // record the upload to your items
    firebase.database().ref('busers/'+uid+'/items').push().set(loc + '/' + ref.key);

    alert(x[1].value + " Added.");
  }
}

function formatDate(input) {
  var parts = input.split("-")
  return parts[1] + "/" + parts[2] + "/" + parts[0];
}
        // function runs everytime type of item changes between activity and event inorder to toggle displaying the date and time form entry boxes
function typeChange() {
  var x = document.getElementById("typeSelect");
  var frm = document.getElementById("frmNewItem");
  if (x.value=="Event") {
    var divDate = document.createElement("div");
    var labelDate = document.createElement("label");
    var inputDate = document.createElement("input");
    divDate.setAttribute("class", "form-group");
    labelDate.setAttribute("for", "dateInputText");
    labelDate.innerHTML = "Date of Event";
    inputDate.setAttribute("type", "date");
    inputDate.setAttribute("class", "form-control");
    inputDate.setAttribute("id", "dateInputText");
    divDate.appendChild(labelDate);
    divDate.appendChild(inputDate);

    var divTime = document.createElement("div");
    var labelTime = document.createElement("label");
    var inputTime = document.createElement("input");
    divTime.setAttribute("class", "form-group");
    labelTime.setAttribute("for", "timeInputText");
    labelTime.innerHTML = "Time of Event";
    inputTime.setAttribute("type", "time");
    inputTime.setAttribute("class", "form-control");
    inputTime.setAttribute("id", "dateInputText");
    divTime.appendChild(labelTime);
    divTime.appendChild(inputTime);

    frm.insertBefore(divDate, frm.children[2]);
    frm.insertBefore(divTime, frm.children[3]);
  }
  else {
    frm.removeChild(frm.children[3]);
    frm.removeChild(frm.children[2]);
  }
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

var ulCompanyItems = document.getElementById('companyItems');
var divCompanyItem = document.getElementById('companyItem');
ulCompanyItems.onclick = function(event) {
    ulCompanyItems.setAttribute('style', 'display:none');
    divCompanyItem.setAttribute('style', 'display:inline-block');
    var target = getEventTarget(event);
    var title = document.getElementById("home").children[0];
    title.innerHTML = target.innerHTML;
};


$(".form-check-input").change(function(){ this.value = this.checked })