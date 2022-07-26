
const projectList = JSON.parse(localStorage.getItem("projects"));
const employeeList = JSON.parse(localStorage.getItem("employees"));
const taskList = JSON.parse(localStorage.getItem("tasks"));
const toolsList = JSON.parse(localStorage.getItem("tools"));
const attendList = JSON.parse(localStorage.getItem("attendance"));
const accountList = JSON.parse(localStorage.getItem("accounts"));
const modalBtns = document.querySelectorAll(".modalBtn"); //get all Open Project buttons

function setProfile(){
	var user = JSON.parse(sessionStorage.getItem("userId"));
	
	if(user == "") window.location.href = "../../html/login.html"
	else if(user === "admin"){
		document.getElementById("profileName").innerHTML = "Manager";
	}
	else{
		var thisEmployee = employeeList.filter((obj) => obj.id === user);
		document.getElementById("profileName").innerHTML = thisEmployee[0].firstName;
	}
}

function searchTable(inputElement, tableElement) {
	var input, filter, found, table, tr, td, i, j;
	input = document.getElementById(inputElement);
	filter = input.value.toUpperCase();
	table = document.getElementById(tableElement);
	tr = table.getElementsByTagName("tr");

	if (input.value == "Filter by project") location.reload();
	else {
        // if(inputElement == "filter" && tableElement == "attendance") document.getElementById("datePicker").valueAsDate = null;
        
		for (i = 1; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td");
			for (j = 0; j < td.length; j++) {
				if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
					found = true;
				}
			}
			if (found) {
				tr[i].style.display = "";
				found = false;
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", function(event) {

	const showNavbar = (toggleId, navId, bodyId, headerId) => {
		const toggle = document.getElementById(toggleId),
			nav = document.getElementById(navId),
			bodypd = document.getElementById(bodyId),
			headerpd = document.getElementById(headerId)

		// Validate that all variables exist
		if (toggle && nav && bodypd && headerpd) {
			toggle.addEventListener('click', () => {
				// show navbar
				nav.classList.toggle('showNav')
				// change icon
				toggle.classList.toggle('bx-x')
				// add padding to body
				bodypd.classList.toggle('body-pd')
				// add padding to header
				headerpd.classList.toggle('body-pd')
				// hide logo icon
				// document.getElementById("logo-icon").classList.toggle("d-none");
			})
		}
		setProfile();
	}

	showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

	/*===== LINK ACTIVE =====*/
	const linkColor = document.querySelectorAll('.nav_link')

	function colorLink() {
		if (linkColor) {
			linkColor.forEach(l => l.classList.remove('active'))
			this.classList.add('active')
		}
	}
	linkColor.forEach(l => l.addEventListener('click', colorLink))

	// Your code to run since DOM is loaded and ready
});

function updateSelectFilter() {
    var filterSelect = document.getElementById("filter");
    filterSelect.innerHTML = "<option selected onclick='history.go(0)'>Filter by project</option>";

    const options = projectList.map(function (project) {
        return project.projectName;
    });

    for(i in options){
        var option = document.createElement("option");
        option.value = options[i];
        option.textContent = options[i];
        filterSelect.appendChild(option);
    }
}

//populate project input datalist
function updateSelectProject() {
    var projSelect = document.getElementById("inputProject");

    //reset select options
    projSelect.innerHTML = "";

    const options = projectList.map(function (project) {
        return project.projectName;
    });

    for(i in options){
        var option = document.createElement("option");
        option.value = options[i];
        option.textContent = options[i];
        projSelect.appendChild(option);
    }
}

const showOnPx = 100;
const backToTopButton = document.getElementById("topBtn");

const scrollContainer = () => {
    return document.querySelector(".row") || document.documentElement;
}

scrollContainer().addEventListener("scroll", () => {
	if (scrollContainer().scrollTop > showOnPx) {
		backToTopButton.classList.remove("d-none")
	} else {
		backToTopButton.classList.add("d-none")
	}
})

document.querySelector(".nav_logo-name").addEventListener("click", () => {
    window.location.href = "dashboard.html";
})

const logout = document.getElementsByClassName("logout");

for(let i = 0; i<logout.length; i++){
	logout[i].addEventListener("click", () =>{
		sessionStorage.setItem("user", JSON.stringify(""));
		sessionStorage.setItem("userId", JSON.stringify(""));
		window.location.href = "../login.html";
	})
}
