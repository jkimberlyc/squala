
   sessionStorage.setItem("currentIdUser", JSON.stringify("1"));
    let id = JSON.parse(sessionStorage.getItem("currentIdUser"));
    //console.log(id); //to check the result of id...

    let thisUser = employeeList.filter((obj) => obj.id == id); //get the object that matches the project id; filter() returns an array
    //console.log(thisUser[0].firstName); //to check if the filter is functioning

    document.getElementById("displayName").innerHTML=thisUser[0].firstName+ ", " + thisUser[0].lastName; //displays the NAME at employee.html
    document.getElementById("displayContact").innerHTML=thisUser[0].contact; //displays the CONTACT at employee.html
    document.getElementById("displayAddress").innerHTML=thisUser[0].address;
    document.getElementById("displayDesig").innerHTML=thisUser[0].designation;
    document.getElementById("displaySkills").innerHTML=thisUser[0].skills;
    document.getElementById("displayProject").innerHTML=thisUser[0].allProjects;
    


