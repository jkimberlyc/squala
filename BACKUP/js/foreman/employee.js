window.addEventListener("load", function() {
    authenticateUser();
    window.setTimeout(() => {
        document.querySelector(".loader").classList.add("d-none");
        document.body.classList.replace("overflow-hidden", "overflow-auto");
    }, 300)
})

function authenticateUser(){
    var user = sessionStorage.getItem("user");

    if(user === "Manager") window.location.href="../../html/manager/dashboard.html"
    else if(user === "Employee") window.location.href="../../html/employee/dashboard.html"
}

const employeeTable = document.getElementById("displayEmployee");
const submitBtn = document.getElementById("submitBtn");
var employeeIDModal;

checkForAlerts()

function showAllEmployees() {
    updateSelectFilter();

    for(i in employeeList){
        var employee = document.createElement("tr");
        var name = document.createElement("td");
        var address = document.createElement("td");
        var contact = document.createElement("td");
        var project = document.createElement("td");
        var designation = document.createElement("td");
        var skills = document.createElement("td");
        var action = document.createElement("td");
        
        name.innerHTML = `<a role="button" data-bs-toggle="tooltip" title="Username: | Password:">${employeeList[i].firstName} ${employeeList[i].lastName}</a>`;
        address.innerHTML = employeeList[i].address;
        contact.innerHTML = employeeList[i].contact;
        designation.innerHTML = employeeList[i].designation
        
        //we are only provided with project ID so we must go to the projects table 
        //and find the element that matches the provided ID
        var projectID = employeeList[i].projectId;
        var thisProject = projectList.filter((obj) => obj.id == projectID);
        project.innerHTML = thisProject[0].projectName;

        //display each element of skills array
        var skillsArray = employeeList[i].skills;
        var skillString = "";
        for(j in skillsArray){
            (j!=skillsArray.length-1) ? (skillString += skillsArray[j] + ", ") : (skillString += skillsArray[j]); //include a comma except on the last element
        }
        skills.innerHTML = skillString;

        //add edit and dismiss button with bootstrap modal activation
        action.innerHTML = "<div class='btn-group w-100' role='group' aria-label='Employee Action'> <button type='button' class='btn btn-outline-info btn-sm px-0 btn-edit' data-bs-toggle='modal' data-bs-target='#employeeModal'><i class='bx bxs-edit align-middle'></i> Edit</button><button type='buton' class='btn btn-outline-danger btn-sm px-0 btn-dismiss'><i class='bx bx-user-x align-middle'></i> Dismiss</button></div>"

        //provide additional data attribute for responsive viewing purposes
        name.setAttribute("data-label", "Name");
        address.setAttribute("data-label", "Address");
        contact.setAttribute("data-label", "Contact Number");
        project.setAttribute("data-label", "Project");
        designation.setAttribute("data-label", "Designation");
        skills.setAttribute("data-label", "Skills");

        //lastly, give the tr element an ID of the employee
        employee.id = employeeList[i].id;

        employeeTable.appendChild(employee);
        employee.appendChild(name);
        employee.appendChild(address);
        employee.appendChild(contact);
        employee.appendChild(project);
        employee.appendChild(designation);
        employee.appendChild(skills);
        employee.appendChild(action);
    }
}
showAllEmployees();

const editBtns = document.querySelectorAll(".btn-edit");
const dismissBtns = document.querySelectorAll(".btn-dismiss");
const skillsCheck = document.querySelectorAll(".btn-check");

function checkForAlerts() {
    create = JSON.parse(sessionStorage.getItem("createAlert"));
    edit = JSON.parse(sessionStorage.getItem("editAlert"));

    if(create) showAlert(".create-alert")
    else hideAlert(".create-alert");

    if(edit) showAlert(".edit-alert");
    else hideAlert(".edit-alert");
}

function clearAlertVal() {
    sessionStorage.setItem("createAlert", JSON.stringify(""));
    sessionStorage.setItem("editAlert", JSON.stringify(""));
}

function showAlert(className) {
    var alertMsg = document.querySelector(className);
    alertMsg.classList.replace("d-none", "d-block")
}

function hideAlert(className) {
    var alertMsg = document.querySelector(className);
    alertMsg.classList.replace("d-block", "d-none");
}

for(let i=0; i<editBtns.length; i++){
    editBtns[i].addEventListener("click", () => {
        //reset alerts
        clearAlertVal();

        var modalTitle = document.querySelector(".modal-title");
        modalTitle.innerHTML = "<i class='bx bxs-edit align-middle fs-3'></i><span class='align-middle'> Edit Profile</span>"
        var submit = document.getElementById("submitBtn");
        submit.innerHTML = "Save Changes";

        //disable Save Changes button
        submitBtn.disabled = true;

        //reset skills checkboxes
        for(skill of skillsCheck){
            skill.checked = false;
        }
        
        var employeeID = event.target.closest("tr").id; //get the employee id located in each tr

        //store employeeId in the sessionStorage for submitting profile changes later
        employeeIDModal = employeeID;
        
        //locate the employee in the employees table with the provided id
        var thisEmployee = employeeList.filter((obj) => obj.id == employeeID);
        
        //populate modal fields with existing record of employee
        var fName = document.getElementById("inputFirstName");
        var lName = document.getElementById("inputLastName");
        var address = document.getElementById("inputAddress");
        var contact = document.getElementById("inputContact");
        var project = document.getElementById("inputProject");
        var designation = document.getElementById("inputDesignation");

        fName.value = thisEmployee[0].firstName;
        lName.value = thisEmployee[0].lastName;
        address.value = thisEmployee[0].address;
        contact.value = thisEmployee[0].contact;

        updateSelectProject();
        checkDesignationSelect();

        var projectID = thisEmployee[0].projectId;
        var thisProject = projectList.filter((obj) => obj.id == projectID);

        //select assign project
        for(let i=0; i<project.options.length; i++){
            if(project.options[i].value.includes(thisProject[0].projectName)){
            project.options[i].selected = true;
          }
        }

        //select the employee designation based on the record
        for(let i=0; i<designation.options.length; i++){
            if(designation.options[i].value.includes(thisEmployee[0].designation)){
            designation.options[i].selected = true;
          }
        }

        //check the checkboxes that match with employee's skills
        var skills = thisEmployee[0].skills;
        for(let i=0; i<skillsCheck.length; i++){
            for(let j=0; j<skills.length; j++){
                if(skillsCheck[i].id == skills[j]) skillsCheck[i].checked = true;
            }
        }
    })
}

var valid = true;
//enable Save Changes button when any of the fields/checkboxes in the edit form is changed
document.getElementById("editForm").addEventListener("change", (e) => {
    var project = document.getElementById("inputProject").value;
    var thisProject = projectList.filter((obj) => obj.projectName == project);
    var options = designationSelect.options;

    checkDesignationSelect();

    if((designationSelect.value=="Foreman") && (e.target == designationSelect || e.target == projectSelect)){ //listen for designation dropdown only
        if(thisProject[0].projectForeman != ""){
            alert("You cannot assign more than one foreman in a project!");
            valid = false;
            // for(i in options){
            //     if(options[i].value == designationDefaultVal){
            //         designationSelect[i].selected = true;
            //     }
            // }
        }
        else{
            valid = true;
        }
    }
    else if((designationSelect.value=="Skilled") && (e.target == designationSelect || e.target == projectSelect)) {
        valid = true;
    }else submitBtn.disabled = false;

    if(valid) submitBtn.disabled = false;
    else submitBtn.disabled = true;

})

document.getElementById("editForm").addEventListener("keyup", () => {
    if(valid) submitBtn.disabled = false;
    else submitBtn.disabled = true;
})

//update localStorage when Save Changes is clicked
submitBtn.addEventListener("click", () => {
    if(employeeIDModal == "") createEmployee();
    else{
        var employeeID = employeeIDModal;

        //index of the employee object in the employees table
        var index = employeeList.findIndex(employee => employee.id == employeeID); 

        var thisEmployee = employeeList.filter((obj) => obj.id == employeeID);

        //for the new project value, we have to get its ID from the projects table using the provided project name and store its ID instead
        var thisProject = projectList.filter((obj) => obj.projectName == document.getElementById("inputProject").value);

        if(thisProject[0].id == thisEmployee[0].projectId){ //if same project
            if((document.getElementById("inputDesignation").value == "Foreman") && (thisEmployee[0].designation == "Skilled")){ 
                //if skilled is assigned as foreman in same project
                addForeman(thisProject[0].id, employeeID);
            } else if ((document.getElementById("inputDesignation").value == "Skilled") && (thisEmployee[0].designation == "Foreman")){ 
                //from foreman to skilled
                removeForeman(thisProject[0].id);
            }
        } else { //if not same project
            if((document.getElementById("inputDesignation").value == "Foreman") && (thisEmployee[0].designation == "Skilled")) {
                //from skilled to foreman in another project
                addForeman(thisProject[0].id, employeeID);
                addWorker(thisProject[0].id, employeeID);
                removeWorker(thisEmployee[0].projectId, employeeID);
            }
            else if((document.getElementById("inputDesignation").value == "Skilled") && (thisEmployee[0].designation == "Foreman")){  
                //from foreman to skilled in another project  
                removeForeman(thisEmployee[0].projectId);
                removeWorker(thisEmployee[0].projectId, employeeID);
                addWorker(thisProject[0].id, employeeID);
            }
            else if((document.getElementById("inputDesignation").value == "Foreman") && (thisEmployee[0].designation == "Foreman")){  
                //from foreman to foreman in another project  
                removeForeman(thisEmployee[0].projectId);
                removeWorker(thisEmployee[0].projectId, employeeID);
                addForeman(thisProject[0].id, employeeID);
                addWorker(thisProject[0].id, employeeID);
            }
            else if((document.getElementById("inputDesignation").value == "Skilled") && (thisEmployee[0].designation == "Skilled")){  
                //from skilled to skilled in another project  
                removeWorker(thisEmployee[0].projectId, employeeID);
                addWorker(thisProject[0].id, employeeID);
            }
        }

        //for new value of skills, we take all the checked checkboxes and put it in an array
        var skillsArray = [];
        for(i in skillsCheck){
            if(skillsCheck[i].checked) skillsArray.push(skillsCheck[i].id);
        }

        var newEmployee = {
            id: employeeID,
            projectId: thisProject[0].id,
            firstName: document.getElementById("inputFirstName").value,
            lastName: document.getElementById("inputLastName").value,
            contact: document.getElementById("inputContact").value,
            address: document.getElementById("inputAddress").value,
            designation: document.getElementById("inputDesignation").value,
            skills: skillsArray
        }

        var empList = employeeList;
        empList[index] = newEmployee;
        localStorage.setItem("employees", JSON.stringify(empList)); 

        sessionStorage.setItem("editAlert", JSON.stringify("true"));
    }
})

for(let i=0; i<skillsCheck.length; i++){
    skillsCheck[i].addEventListener("change", ()=>{
        if(valid) submitBtn.disabled = false;
        else if(!valid) submitBtn.disabled = true;
    })
}

//to dismiss an employee from the company
for(let i=0; i<dismissBtns.length; i++){
    dismissBtns[i].addEventListener("click", () => {
        var employeeID = event.target.closest("tr").id; //get the employee id located in each tr
        var thisEmployee = employeeList.filter((obj) => obj.id == employeeID);

        removeWorker(thisEmployee[0].projectId, employeeID);

        if(thisEmployee[0].designation == "Foreman") removeForeman(thisEmployee[0].projectId); //if employee was a foreman, remove foreman of that project

        localStorage.setItem("employees", JSON.stringify(employeeList.filter((obj) => obj.id != employeeID)));
        location.reload();
    })
}

const designationSelect = document.getElementById("inputDesignation");
const projectSelect = document.getElementById("inputProject");
var designationDefaultVal = "";

designationSelect.addEventListener("click", () => {
    return designationDefaultVal = designationSelect.value;
})

function checkDesignationSelect () {
    var projSelect = document.getElementById("inputProject");
    var thisProject = projectList.filter((obj) => obj.projectName == projSelect.value);

    if(designationSelect.value == "Foreman" && thisProject[0].projectForeman != ""){
        valid = false
    }
    else{
        valid = true;
    }
}

function addForeman(projectID, employeeID){
    var thisProject = projectList.filter((obj) => obj.id == projectID);

    thisProject[0] = {
        ...thisProject[0],
        projectForeman: employeeID
    }

    var projList = projectList;
    projList[projectID-1] = thisProject[0]
    localStorage.setItem("projects", JSON.stringify(projList));
}

function removeForeman(projectID){
    var thisProject = projectList.filter((obj) => obj.id == projectID);

    thisProject[0] = {
        ...thisProject[0],
        projectForeman: ""
    }

    var projList = projectList;
    projList[projectID-1] = thisProject[0]
    localStorage.setItem("projects", JSON.stringify(projList));
}

function addWorker(projectID, employeeID){
    var thisProject = projectList.filter((obj) => obj.id == projectID);
    var newWorkers = thisProject[0].workers;

    if(newWorkers.indexOf(employeeID) < 0) newWorkers.push(employeeID);

    thisProject[0] = {
        ...thisProject[0],
        workers: newWorkers
    }

    var projList = projectList;
    projList[projectID-1] = thisProject[0]
    localStorage.setItem("projects", JSON.stringify(projList));
}

function removeWorker(projectID, employeeID){
    var thisProject = projectList.filter((obj) => obj.id == projectID);
    var newWorkers = thisProject[0].workers;

    for(let i=0; i<newWorkers.length; i++){
        if(newWorkers[i] == employeeID ) newWorkers.splice(i, 1);
    }

    thisProject[0] = {
        ...thisProject[0],
        workers: newWorkers
    }

    var projList = projectList;
    projList[projectID-1] = thisProject[0]
    localStorage.setItem("projects", JSON.stringify(projList));
}

document.querySelector(".new-employee").addEventListener("click", () => {
    document.getElementById("editForm").reset()
    var modalTitle = document.querySelector(".modal-title");
    modalTitle.innerHTML = "<i class='bx bx-user-plus align-middle fs-3' ></i><span class='align-middle'> New Employee</span>"
    var submit = document.getElementById("submitBtn");
    submit.innerHTML = "Create Employee";
    updateSelectProject();
    employeeIDModal = "";
});

function createEmployee() {
    var newId = parseInt(employeeList[employeeList.length-1].id)+1; //increment last employee ID created
    newId = newId.toString();

    //for the new project value, we have to get its ID from the projects table using the provided project name and store its ID instead
    var thisProject = projectList.filter((obj) => obj.projectName == document.getElementById("inputProject").value);

    //for new value of skills, we take all the checked checkboxes and put it in an array
    var skillsArray = [];
    for(i in skillsCheck){
        if(skillsCheck[i].checked) skillsArray.push(skillsCheck[i].id);
    }

    var newEmployee = {
        id: newId,
        projectId: thisProject[0].id,
        firstName: document.getElementById("inputFirstName").value,
        lastName: document.getElementById("inputLastName").value,
        contact: document.getElementById("inputContact").value,
        address: document.getElementById("inputAddress").value,
        designation: document.getElementById("inputDesignation").value,
        skills: skillsArray
    }

    //if employee is assigned as foreman
    if(newEmployee.designation == "Foreman") addForeman(thisProject[0].id, newId);
    addWorker(thisProject[0].id, newId);

    var empList = employeeList;
    empList.push(newEmployee);
    localStorage.setItem("employees", JSON.stringify(empList)); 
    
    
    sessionStorage.setItem("createAlert", JSON.stringify("true"));
}


const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


