window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener("load", function() {
    checkUser();
})

function checkUser(){
    var user = sessionStorage.getItem("user");
    if (user === "Manager") window.location.href = "manager/dashboard.html"
    else if(user === "Foreman") window.location.href = "foreman/dashboard.html"
    else if(user === "Employee") window.location.href = "employee/dashboard.html"
}

var name = document.getElementById('UserName')
var password = document.getElementById('Password')
const loginPeople = JSON.parse(localStorage.getItem('accounts'));
const employeeList = JSON.parse(localStorage.getItem('employees'));
sessionStorage.setItem("createAlert", JSON.stringify(""));
sessionStorage.setItem("editAlert", JSON.stringify(""));
sessionStorage.setItem("createAlert1", JSON.stringify(""));

function validate()
{
    
    sessionStorage.setItem("user", JSON.stringify(""));
    sessionStorage.setItem("userId", JSON.stringify(""));
    var username=document.getElementById("UserName").value;
    var password=document.getElementById("Password").value;


    for(i=0;i<loginPeople.length;i++){
        if(username == loginPeople[i].username && password == loginPeople[i].password){
            sessionStorage.setItem("userId", JSON.stringify(loginPeople[i].employeeId));

            if(loginPeople[i].employeeId === 'admin'){
                window.location.href="manager/dashboard.html";
                sessionStorage.setItem("user", "Manager");
            }
            else{
                //determine the designation of the user
                var thisUser = employeeList.filter((obj) => obj.id === loginPeople[i].employeeId);

                if(thisUser[0].designation === 'Foreman'){
                    window.location.href="foreman/dashboard.html";
                    sessionStorage.setItem("user", "Foreman");
                }
                else{
                    window.location.href="employee/dashboard.html";
                    sessionStorage.setItem("user", "Employee");
                }
            }
            return
        }
    }
}

document.getElementById("signIn").addEventListener("click", validate);
document.getElementById("UserName").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        validate();
    }
});
document.getElementById("Password").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        validate();
    }
});
