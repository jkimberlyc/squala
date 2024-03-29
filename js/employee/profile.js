window.addEventListener("load", function() {
   authenticateUser();
   window.setTimeout(() => {
       document.querySelector(".loader").classList.add("d-none");
       document.body.classList.replace("overflow-hidden", "overflow-auto");
   }, 300)
})

function authenticateUser(){
   var user = sessionStorage.getItem("user");

   if(user === null) window.location.href="../../html/login.html"
   else if(user === "Foreman") window.location.href="../../html/foreman/dashboard.html"
   else if(user === "Manager") window.location.href="../../html/manager/dashboard.html"
}

let id = JSON.parse(sessionStorage.getItem("userId"));
//console.log(id); //to check the result of id...

let thisUser = employeeList.filter((obj) => obj.id == id); //get the object that matches the project id; filter() returns an array
//console.log(thisUser[0].firstName); //to check if the filter is functioning

let thisProject = projectList.filter(p => p.id === thisUser[0].projectId);

let skills = () => {
   let s = thisUser[0].skills
   let skillString;
   for(i in s){
      if(i != s.length-1) skillString += s[i] + ", ";
      else skillString += s[i];
   }
   return s;
}

let thisAccount = accountList.filter(u => u.employeeId === id)

let password = () => {
   let p = thisAccount[0].password;
   let pwString = "";

   for(let i=0; i<p.length; i++){
      pwString += "*";
   }

   return pwString;
}


let showPassword = () => {
   document.getElementById("displayPassword").innerHTML=thisAccount[0].password + "<button class='btn btn-sm btn-outline-danger ms-3' onclick='hidePassword()'>Hide</button>";
}

let hidePassword = () => {
   document.getElementById("displayPassword").innerHTML=password() + "<button class='btn btn-sm btn-outline-danger ms-3' onclick='showPassword()'>Show</button>";
}

document.getElementById("displayName").innerHTML=thisUser[0].firstName+ ", " + thisUser[0].lastName; //displays the NAME at employee.html
document.getElementById("displayContact").innerHTML=thisUser[0].contact; //displays the CONTACT at employee.html
document.getElementById("displayProject").innerHTML = thisProject[0].projectName;
document.getElementById("displayAddress").innerHTML=thisUser[0].address;
document.getElementById("displayDesignation").innerHTML=thisUser[0].designation;
document.getElementById("displaySkills").innerHTML=skills();
document.getElementById("displayUsername").innerHTML=thisAccount[0].username
document.getElementById("displayPassword").innerHTML=password() + "<button class='btn btn-sm btn-outline-danger ms-3' onclick='showPassword()'>Show</button>";


document.getElementById("usernameModal").addEventListener("shown.bs.modal", () => {
   let username = document.getElementById("inputUsername");
   username.value = thisAccount[0].username;
   username.focus();
})

document.getElementById("saveUsername").addEventListener("click", () => {
   let username = document.getElementById("inputUsername");

   if(!confirm("Save changes?")) {
      return false;
   }else{
      let index = accountList.findIndex(a => a.id == thisAccount[0].id);
      let newList = accountList;
      newList[index].username = username.value;
      localStorage.setItem("accounts", JSON.stringify(newList));
   }
})

document.getElementById("passwordModal").addEventListener("shown.bs.modal", () => {
   let oldPassword = document.getElementById("oldPassword");
   let newPassword = document.getElementById("newPassword");
   let confirmPassword = document.getElementById("confirmPassword");
   oldPassword.value = thisAccount[0].password;
   newPassword.value = "";
   confirmPassword.value = "";
   newPassword.focus();
})

document.getElementById("savePassword").addEventListener("click", () => {
   let oldPassword = document.getElementById("oldPassword");
   let newPassword = document.getElementById("newPassword");
   let confirmPassword = document.getElementById("confirmPassword");

   if(!confirm("Save changes?")) {
      return false;
   }else{
      if(!(oldPassword.value == thisAccount[0].password)){
         alert("Please enter your correct current password.")
         return false;
      }else{
         if(newPassword.value != confirmPassword.value){
            alert("Mismatched passwords")
            return false;
         }else{
            let index = accountList.findIndex(a => a.id == thisAccount[0].id);
            let newList = accountList;
            newList[index].password = newPassword.value;
            localStorage.setItem("accounts", JSON.stringify(newList));
         }
         
      }
      
   }
})
