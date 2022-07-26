window.addEventListener("load", function() {
    authenticateUser();
    window.setTimeout(() => {
        document.querySelector(".loader").classList.add("d-none");
        document.body.classList.replace("overflow-hidden", "overflow-auto");
    }, 300)
    showProject()
    checkTimes()
})

function authenticateUser(){
    var user = sessionStorage.getItem("user");

    if(user === "") window.location.href="../../html/login.html"
    else if(user === "Foreman") window.location.href="../../html/foreman/dashboard.html"
    else if(user === "Manager") window.location.href="../../html/manager/dashboard.html"
}

const id = JSON.parse(sessionStorage.getItem("userId"));
const thisUser = employeeList.filter((obj) => obj.id == id);
const modalBtn = document.querySelector(".modalBtn")
var userId = JSON.parse(sessionStorage.getItem("userId"));
var projectId;

modalBtn.addEventListener("click", ()=>{
    let thisProject=projectList.filter((obj)=>obj.id === thisUser[0].projectId)
    let project = thisProject[0];

    document.getElementById("projName").innerHTML = project.projectName;
    document.getElementById("projAddress").innerHTML = project.projectAddress;
    document.getElementById("projStart").innerHTML = project.projectStart;
    document.getElementById("projEnd").innerHTML = project.projectEnd;

    var thisEmployee = employeeList.filter(e => e.id == project.projectForeman);
    var foreman = thisEmployee[0];
    document.getElementById("projForeman").innerHTML = foreman.firstName + " " + foreman.lastName;

    showTasks(project.id);
}) 

function showProject(){
    let thisProject=projectList.filter((obj)=>obj.id === thisUser[0].projectId)
    let project = thisProject[0];

    document.getElementById("projectName").innerHTML = project.projectName;
    document.getElementById("projectAddress").innerHTML = project.projectAddress;
    document.getElementById("projectStart").innerHTML = project.projectStart;
    document.getElementById("projectEnd").innerHTML = project.projectEnd;
    document.getElementById("projectStatus").innerHTML ? '<span class="badge text-bg-success w-100">Ongoing</span>' : '<span class="badge text-bg-danger w-100">Cancelled</span>'
}

function showTasks(projectID){
    var thisProject = projectList.filter(p => p.id === projectID);
    var project = thisProject[0];
    var tasks = project.tasks;
    var taskTable = document.getElementById("tasks");
    taskTable.innerHTML = "<tr><th>Task Items</th><th>Target</th><th>Status</th></tr>";
    
    for(i in tasks){
        var task = document.createElement("tr");
        var name = document.createElement("td");
        var date = document.createElement("td");
        var status = document.createElement("td");

        name.innerHTML = tasks[i].taskName;
        name.setAttribute("data-label", "Task Name");

        date.innerHTML = tasks[i].targetDate;
        date.setAttribute("data-label", "Target");

        status.innerHTML = tasks[i].status;
        status.setAttribute("data-label", "Status");

        taskTable.appendChild(task);
        task.append(name);
        task.append(date);
        task.append(status);
    }
}

// $.getJSON('http://ip-api.com/json', function(data) {
//   console.log(JSON.stringify(data, null, 2));
// });

document.getElementById("timeIn").addEventListener("click", setTimeIn);
document.getElementById("timeOut").addEventListener("click", setTimeOut);

async function setTimeIn(){
    var date = new Date();
    var employee = employeeList.filter(e => e.id === userId);
    var project = projectList.filter(p => p.id === employee[0].projectId);
    var attendance = attendList.filter(a => (a.employeeId === userId) && (a.date === date.yyyymmdd()));
    var index = attendList.findIndex(a => (a.employeeId === userId) 
    && (a.date === date.yyyymmdd()));
    var newList;
   

    var timeStamp = await getTime();
    console.log(timeStamp.datetime);
    if(attendance.length === 0){
        var newAttendance = {
            id: (attendList.length+1).toString(),
            employeeId: userId,
            projectId: project[0].id,
            designation: employee[0].designation,
            date: date.yyyymmdd(),
            timeIn: timeStamp.datetime.substring(11,16),
            timeOut: "",
            status: "Present"
        }

        newList = attendList;
        newList.push(newAttendance);
    }else{
        attendance[0] = {
            ...attendance[0],
            timeIn: timeStamp.datetime.substring(11,16)
        }
        newList = attendList;
        newList[index] = attendance[0];
    }

    localStorage.setItem("attendance", JSON.stringify(newList));

    var timeIn = document.getElementById("timeIn");
    timeIn.innerHTML = timeStamp.datetime.substring(11,16);
    timeIn.disabled = true;

    checkTimes();
}

async function setTimeOut(){
    var date = new Date();
    var attendance = attendList.filter(a => (a.employeeId === userId) 
    && (a.date === date.yyyymmdd()));
    var index = attendList.findIndex(a => (a.employeeId === userId) 
    && (a.date === date.yyyymmdd()));
    var newList;
    console.log(attendance[0]);
    
    var timeStamp = await getTime();
    console.log(timeStamp.datetime);

    attendance[0] = {
        ...attendance[0],
        timeOut: timeStamp.datetime.substring(11,16)
    }
    newList = attendList;
    newList[index] = attendance[0];


    localStorage.setItem("attendance", JSON.stringify(newList));

    var timeOut = document.getElementById("timeOut");
    timeOut.innerHTML = timeStamp.datetime.substring(11,16);
    timeOut.disabled = true;

    checkTimes();
}

async function getTime(){
    const response = await fetch("https://worldtimeapi.org/api/ip");
    return await response.json();
}

function checkTimes(){
    var date = new Date();
    var attendance = attendList.filter(a => (a.employeeId === userId) && (a.date === date.yyyymmdd()));
    var timeIn = document.getElementById("timeIn");
    var timeOut = document.getElementById("timeOut");

    if(attendance.length != 0){
        if(attendance[0].timeIn != ""){
            timeIn.innerHTML = attendance[0].timeIn;
            timeIn.disabled = true;
        }else timeIn.disabled = false
    
        if(attendance[0].timeOut != ""){
            timeOut.innerHTML = attendance[0].timeOut;
            timeOut.disabled = true;
        } else timeOut.disabled = false;
    }
}

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};
