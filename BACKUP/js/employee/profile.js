window.addEventListener("load", function() {
   authenticateUser();
   window.setTimeout(() => {
       document.querySelector(".loader").classList.add("d-none");
       document.body.classList.replace("overflow-hidden", "overflow-auto");
   }, 300)
})

function authenticateUser(){
   var user = sessionStorage.getItem("user");

   if(user === "") window.location.href="../../html/login.html"
   else if(user === "Foreman") window.location.href="../../html/foreman/dashboard.html"
   else if(user === "Manager") window.location.href="../../html/manager/dashboard.html"
}

let id = JSON.parse(sessionStorage.getItem("userId"));
//console.log(id); //to check the result of id...

let thisUser = employeeList.filter((obj) => obj.id == id); //get the object that matches the project id; filter() returns an array
//console.log(thisUser[0].firstName); //to check if the filter is functioning


document.getElementById("displayName").innerHTML=thisUser[0].firstName+ ", " + thisUser[0].lastName; //displays the NAME at employee.html
document.getElementById("displayContact").innerHTML=thisUser[0].contact; //displays the CONTACT at employee.html
document.getElementById("displayAddress").innerHTML=thisUser[0].address;
document.getElementById("displayDesig").innerHTML=thisUser[0].designation;
document.getElementById("displaySkills").innerHTML=thisUser[0].skills;



