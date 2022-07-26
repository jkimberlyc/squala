window.addEventListener("load", function() {
    authenticateUser();
    window.setTimeout(() => {
        document.querySelector(".loader").classList.add("d-none");
        document.body.classList.replace("overflow-hidden", "overflow-auto");
    }, 300)
    datePicker = document.getElementById('datePicker');
    datePicker.value = new Date().toLocaleDateString('en-ca')
    datePicker.max = new Date().toLocaleDateString('en-ca')
    searchRecords();
})

function authenticateUser(){
    var user = JSON.parse(sessionStorage.getItem("user"));

    if(user === "Manager") window.location.href="../../html/foreman/dashboard.html"
    else if(user === "Employee") window.location.href="../../html/employee/dashboard.html"
}

const attendanceTable = document.getElementById("attendance");
var attendanceIDModal;
var attendanceCreateID;

function showAttendance() {
    for(i in attendList){
        var attendance = document.createElement("tr");
        var name = document.createElement("td");
        var contact = document.createElement("td");
        var project = document.createElement("td");
        var designation = document.createElement("td");
        var timeIn = document.createElement("td");
        var timeOut = document.createElement("td");
        var date = document.createElement("td");
        var status = document.createElement("td");
        var action = document.createElement("td");

        var thisEmployee = employeeList.filter((obj) => obj.id === attendList[i].employeeId);
        var thisProject = projectList.filter((obj) => obj.id === attendList[i].projectId);
        
        name.innerHTML = thisEmployee[0].firstName + " " + thisEmployee[0].lastName;
        contact.innerHTML = thisEmployee[0].contact;
        designation.innerHTML = attendList[i].designation
        project.innerHTML = thisProject[0].projectName;
        date.innerHTML = attendList[i].date;

        if(attendList[i].timeIn === "") timeIn.innerHTML = "--:--";
        else timeIn.innerHTML = attendList[i].timeIn;
        
        if(attendList[i].timeOut === "") timeOut.innerHTML = "--:--";
        else timeOut.innerHTML = attendList[i].timeOut;

        if(attendList[i].status === "Present") status.innerHTML = "<span class='badge text-bg-success fs-6'>Present</span>"
        else if(attendList[i].status === "Absent") status.innerHTML = "<span class='badge text-bg-danger fs-6'>Absent</span>"
        else if(attendList[i].status === "Half-day") status.innerHTML = "<span class='badge text-bg-warning fs-6'>Half-day</span>"
        else status.innerHTML = "<span class='badge text-bg-secondary fs-6'>On Leave</span>"

        //add update button with bootstrap modal activation
        action.innerHTML = "<button type='button' class='btn btn-outline-info btn-sm btn-update w-100 px-0' data-bs-toggle='modal' data-bs-target='#attendanceModal'><i class='bx bxs-user-detail fs-5 align-middle'></i> <span class='align-middle'>Update</span></button>"

        //provide additional data attribute for responsive viewing purposes
        name.setAttribute("data-label", "Name");
        contact.setAttribute("data-label", "Contact Number");
        project.setAttribute("data-label", "Project");
        designation.setAttribute("data-label", "Designation");
        timeIn.setAttribute("data-label", "Time In");
        timeOut.setAttribute("data-label", "Time Out");
        date.setAttribute("data-label", "Date");
        status.setAttribute("data-label", "Status");

        //lastly, give the tr element an ID of the attendance record
        attendance.id = attendList[i].id;
        
        updateSelectProject();

        attendanceTable.appendChild(attendance);
        attendance.appendChild(date);
        attendance.appendChild(name);
        attendance.appendChild(contact);
        attendance.appendChild(project);
        attendance.appendChild(designation);
        attendance.appendChild(timeIn);
        attendance.appendChild(timeOut);
        attendance.appendChild(status);
        attendance.appendChild(action);
    }
}
showAttendance();


const updateBtns = document.querySelectorAll(".btn-update");
// update button event listener
for(let i=0; i<updateBtns.length; i++){
    updateBtns[i].addEventListener("click", ()=> {
        //reset alerts
        clearAlertVal();

        document.getElementById("searchEmployee").required = false;

        var submit = document.getElementById("submitBtn");
        submit.innerHTML = "Save Changes";

        var search = document.getElementById("searchForm");
        search.classList.add("d-none")

        var modalTitle = document.querySelector(".modal-title");
        modalTitle.innerHTML = "<i class='bx bx-calendar-edit align-middle fs-3'></i><span class='align-middle'> Edit Record</span>"

        var attendanceID = event.target.closest("tr").id;
        attendanceIDModal = attendanceID
        console.log(attendanceID)

        var thisAttendance = attendList.filter((obj) => obj.id === attendanceID);
        attendance = thisAttendance[0];

        var thisEmployee = employeeList.filter((obj) => obj.id === attendance.employeeId);
        employee = thisEmployee[0];

        var thisProject = projectList.filter((obj) => obj.id === attendance.projectId);
        project = thisProject[0];
        
        var name = document.getElementById("inputFullName");
        var contact = document.getElementById("inputContact");
        var inputProject = document.getElementById("inputProject");
        var designation = document.getElementById("inputDesignation");
        var date = document.getElementById("inputDate");
        var timeIn = document.getElementById("inputIn");
        var timeOut = document.getElementById("inputOut");
        var status = document.getElementById("inputStatus");
    
        name.value = employee.firstName + " " + employee.lastName;
        contact.value = employee.contact;
        inputProject.value = project.projectName;
        designation.value = attendance.designation;
        date.value = attendance.date;
        timeIn.value = attendance.timeIn;
        timeOut.value = attendance.timeOut;
        status.value = attendance.status;

    })
}

//create attendance record function
document.querySelector(".new-attendance").addEventListener("click", () =>{
    document.getElementById("editForm").reset();

    var submit = document.getElementById("submitBtn");
    submit.innerHTML = "Submit";

    var modalTitle = document.querySelector(".modal-title");
    modalTitle.innerHTML = "<i class='bx bxs-edit-alt align-middle fs-3'></i><span class='align-middle'> New Attendance Record</span>"

    var submit = document.getElementById("submitBtn");
    submit.disabled = false;

    var date = document.getElementById("inputDate");
    date.value = new Date().toLocaleDateString('en-ca');
    date.disabled = false;

    var search = document.getElementById("searchForm");
    search.classList.remove("d-none")

    var list = document.getElementById("searchResult");
    list.innerHTML = "";

    attendanceIDModal = "";
})

var eventSource = null;
//search employee and add found employee to datalist
document.getElementById("searchEmployee").addEventListener("keyup", (e) => {
    var input = document.getElementById("searchEmployee").value;
    var list = document.getElementById("searchResult");

    var firstSearch = employeeList.filter(obj => obj.firstName.toUpperCase() === input.toUpperCase());
    var secondSearch = employeeList.filter(obj => obj.lastName.toUpperCase() === input.toUpperCase());
    
    //if input field is empty or backspace is pressed, reset the datalist
    // if(input === "" || e.keyCode === 8) list.innerHTML = "";

    if(eventSource === "list") {
        displayEmployeeDetails(list.firstChild.id)
    }
    else {
        list.innerHTML = "";
        if(firstSearch!=undefined){
            for(i in firstSearch){
                var option = document.createElement("option");
                option.innerHTML = firstSearch[i].firstName + " " + firstSearch[i].lastName;
                option.id = firstSearch[i].id;
                list.appendChild(option);
            }
        }else list.innerHTML="";
    
        if(secondSearch!=undefined){
            for(i in secondSearch){
                var option = document.createElement("option");
                option.innerHTML = secondSearch[i].firstName + " " + secondSearch[i].lastName;
                option.id = secondSearch[i].id;
                list.appendChild(option);
            }
        }
    }
})

document.getElementById("searchEmployee").addEventListener("keydown", (e) => {
    eventSource = e.key ? 'input' : 'list';
    // console.log(eventSource);
    
})

//display employee details in new attendance record
function displayEmployeeDetails(employeeID){
    if(employeeID != "") attendanceCreateID = employeeID;

    var thisEmployee = employeeList.filter((obj) => obj.id === employeeID);
    var employee = thisEmployee[0];
    var thisProject = projectList.filter((obj) => obj.id === employee.projectId);

    var name = document.getElementById("inputFullName");
    var contact = document.getElementById("inputContact");
    var project = document.getElementById("inputProject");
    var designation = document.getElementById("inputDesignation");

    name.value = employee.firstName + " " + employee.lastName;
    contact.value = employee.contact;
    project.value = thisProject[0].projectName;
    designation.value = employee.designation;
}

//listen for form changes
document.getElementById("editForm").addEventListener("change", () => {
    var submit = document.getElementById("submitBtn");
    submit.disabled = false;
})

//submit form modal -> check if update or create
document.getElementById("submitBtn").addEventListener("click", () => {
    if(attendanceIDModal === "") createAttendance();
    else{ 
        //if attendanceIDModal is not empty, it means update
        var id = attendanceIDModal;
        var timeIn = document.getElementById("inputIn");
        var timeOut = document.getElementById("inputOut");
        var status = document.getElementById("inputStatus");
 
        var thisRecord = attendList.filter((obj) => obj.id === id);
        
        thisRecord[0] = {
            ...thisRecord[0],
            timeIn: timeIn.value,
            timeOut: timeOut.value,
            status: status.value
        }
        var attendanceRecord = attendList;
        attendanceRecord[parseInt(id)-1] = thisRecord[0];

        localStorage.setItem("attendance", JSON.stringify(attendanceRecord));

        sessionStorage.setItem("editAlert1", JSON.stringify("true"));
    }
})

function createAttendance() {
    document.getElementById("searchEmployee").required = true;
    
    if(document.getElementById("searchEmployee").value != ""){
        var newId = (attendList.length+1).toString();
        var thisEmployee = employeeList.filter((obj) => obj.id === attendanceCreateID)
        var employee = thisEmployee[0];

        var attendance = {
            id: newId,
            employeeId: employee.id,
            projectId: employee.projectId,
            designation: employee.designation,
            date: document.getElementById("inputDate").value,
            timeIn: document.getElementById("inputIn").value,
            timeOut: document.getElementById("inputOut").value,
            status: document.getElementById("inputStatus").value,
        }
        var newList = attendList;
        newList.push(attendance);
        localStorage.setItem("attendance", JSON.stringify(newList));
        
        sessionStorage.setItem("createAlert1", JSON.stringify("true"));
    }
}

function searchRecords() {
    var input, filter, found, table, tr, td, i, j;
	input = document.getElementById('searchAttendance');
	filter = input.value.toUpperCase();
	table = document.getElementById('attendance');
	tr = table.querySelectorAll("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].classList.remove("d-none");
            found = false;
        } else {
            tr[i].classList.add("d-none");
        }
    }
    
    secondarySearch('datePicker', 'attendance')
    secondarySearch('filter', 'attendance')
        
	
}

function secondarySearch(inputElement, tableElement){
    var input, filter, found, table, tr, tempTr, td, i, j;
	input = document.getElementById(inputElement);
	filter = input.value.toUpperCase();
	table = document.getElementById(tableElement);
	tr = table.querySelectorAll("tr:not(.d-none)");
    tempTr = tr;

	if (input.value === "" && (document.getElementById("searchAttendance") == "")){
        while (table.children.length > 1) {
            table.removeChild(table.lastChild);
        }
        showAttendance();
    }
	else if(inputElement === 'datePicker' || input.value != 'Filter by project') 
    {
        tr = tempTr; 
		for (i = 1; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td");
			for (j = 0; j < td.length; j++) {
				if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
					found = true;
				}
			}
			if (found) {
				tr[i].classList.remove("d-none");
				found = false;
			} else {
				tr[i].classList.add("d-none");
			}
		}
	}
}

function checkForAlerts() {
    create = JSON.parse(sessionStorage.getItem("createAlert1"));
    edit = JSON.parse(sessionStorage.getItem("editAlert1"));

    if(create) showAlert(".create-alert")
    else hideAlert(".create-alert");

    if(edit) showAlert(".edit-alert");
    else hideAlert(".edit-alert");
}

function clearAlertVal() {
    sessionStorage.setItem("createAlert1", JSON.stringify(""));
    sessionStorage.setItem("editAlert1", JSON.stringify(""));
}

function showAlert(className) {
    var alertMsg = document.querySelector(className);
    alertMsg.classList.replace("d-none", "d-block")
}

function hideAlert(className) {
    var alertMsg = document.querySelector(className);
    alertMsg.classList.replace("d-block", "d-none");
}

//call functions here
updateSelectFilter();
checkForAlerts();