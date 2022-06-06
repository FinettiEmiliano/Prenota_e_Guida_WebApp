var loggedUser = {};

var redErrorBackground = "background-color: #fa2d2d73";

// login function---------------------------------------------------------------------------------------
function login() {
    // get the form object
    let username = document.getElementById("IdInputusername").value;
    let password = document.getElementById("IdInputpassword").value;

    fetch('http://localhost:8080/api/v1/authenticationToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "username": username, "password": password })
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Get the data to modify loggedUser

            loggedUser.success = data.success;
            loggedUser.message = data.message;
            loggedUser.token = data.token;
            loggedUser.id = data.id;
            loggedUser.user_type = data.user_type;
            loggedUser.username = data.username;
            loggedUser.name = data.name;
            loggedUser.surname = data.surname;

            if (!data.success) // check if there is an error in the credentials
                operationResult("loginform", "Nome utente o password errati");
            else
                userRole(data, ""); // if the credentials are correct, call the function to detect the role

            return;

        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
};

// function to show the error---------------------------------------------------------------------------
function operationResult(success, msg, color) {

    // delete previous error
    if (document.getElementById("msgDiv") != null)
        document.getElementById("msgDiv").remove();
    var parentDiv = document.getElementById("operationResult");
    // creation of new page element to show error message
    let msgDiv = document.createElement("div");
    msgDiv.id = "msgDiv";
    if (color) {
        if (!success)
            msgDiv.style.backgroundColor = "#FA2D2D";
        else
            msgDiv.style.backgroundColor = "#3EA36C";
    }
    let msgBox = document.createElement("h5");
    let msgText = document.createTextNode(msg);
    msgBox.appendChild(msgText);
    msgDiv.appendChild(msgBox);
    parentDiv.appendChild(msgDiv);

}

// function to detect user type and create proper page--------------------------------------------------
function userRole(result, filter) {

    // get user role
    let userType = result.user_type;

    // delete login form and error div element
    let form = document.getElementById("loginform");
    if (form != undefined)
        form.remove();

    // delete div that contains all element in order to be updated if necessary
    let containerCheck = document.getElementById("container");
    if (containerCheck != undefined)
        containerCheck.remove();

    // adding page element common to all users
    let welcomeBox = document.createElement("div");
    welcomeBox.id = "welcome";
    var container = document.createElement("div");
    container.id = "container";
    let role = document.createElement("h3");
    let roleText = document.createTextNode(userType);
    let welcomeMsg = document.createElement("h2");
    let welcomeMsgText = document.createTextNode("Benvenuto " + loggedUser.name + " " + loggedUser.surname);
    let operationResultBox = document.createElement("div");
    operationResultBox.id = "operationResultBox";
    let operationResultMsg = document.createElement("div");
    operationResultMsg.id = "operationResult";

    welcomeMsg.appendChild(welcomeMsgText);
    welcomeBox.appendChild(welcomeMsg);
    container.appendChild(welcomeBox);
    role.appendChild(roleText);
    welcomeBox.appendChild(role);
    operationResultBox.appendChild(operationResultMsg);
    container.appendChild(operationResultBox);

    document.body.appendChild(container);

    // adding page element based on user type
    if (userType == "Amministratore") {

        // search user div
        let searchDiv = document.createElement("div");
        searchDiv.id = "searchDiv";
        // search label
        let searchBoxLabel = document.createTextNode("Cerca utente:");
        // search box
        let searchBox = document.createElement("input");
        searchBox.id = "searchBox";
        searchBox.placeholder = "Nome utente";
        // search button
        let searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.onclick = () => userRole(loggedUser, "/" + searchBox.value);
        let searchButtonText = document.createTextNode("cerca");
        // dividing line
        let separator = document.createElement("hr");
        searchButton.appendChild(searchButtonText);
        searchDiv.appendChild(searchBoxLabel);
        searchDiv.appendChild(searchBox);
        searchDiv.appendChild(searchButton);
        searchDiv.appendChild(separator);

        // add user div
        let addUserDiv = document.createElement("div");
        addUserDiv.id = "addUserDiv";
        let line2 = document.createElement("hr");
        // add label
        let addLabel = document.createTextNode("Aggiungi utente:");
        // name
        let nameBox = document.createElement("input");
        nameBox.id = "addNameBox";
        nameBox.placeholder = "Nome";
        // surname
        let surnameBox = document.createElement("input");
        surnameBox.id = "addSurnameBox";
        surnameBox.placeholder = "Cognome";
        // role
        let roleBox = document.createElement("select");
        roleBox.id = "addRoleBox";
        let roleElement1 = document.createElement("option");
        roleElement1.selected = "true";
        let roleElement1Text = document.createTextNode("Studente");
        let roleElement2 = document.createElement("option");
        let roleElement2Text = document.createTextNode("Istruttore");
        // add button
        let addButton = document.createElement("button");
        addButton.onclick = (result) => { addUser(result); };
        let addButtonText = document.createTextNode("aggiungi");
        // output section
        let outputMsg = document.createElement("p");
        outputMsg.id = "outputMsg";
        roleElement1.appendChild(roleElement1Text);
        roleElement2.appendChild(roleElement2Text);
        roleBox.appendChild(roleElement1);
        roleBox.appendChild(roleElement2);
        addButton.appendChild(addButtonText);
        addUserDiv.appendChild(addLabel);
        addUserDiv.appendChild(line2);
        addUserDiv.appendChild(nameBox);
        addUserDiv.appendChild(surnameBox);
        addUserDiv.appendChild(roleBox);
        addUserDiv.appendChild(addButton);
        addUserDiv.appendChild(outputMsg);

        // modify/delete div
        let usersManagementDiv = document.createElement("div");
        usersManagementDiv.id = "usersManagementDiv";
        //'modify or delete' label
        let userLabel = document.createTextNode("Utenti:");
        // radio button - all
        let all = document.createElement("input");
        all.id = "all";
        all.type = "radio";
        all.name = "filter";
        all.value = "";
        all.onclick = () => userRole(loggedUser, all.value);
        let allLabel = document.createElement("label");
        allLabel.appendChild(document.createTextNode("Tutti"));
        // radio button - instructors
        let instructors = document.createElement("input");
        instructors.type = "radio";
        instructors.name = "filter";
        instructors.value = "/instructors";
        instructors.onclick = () => userRole(loggedUser, instructors.value);
        let instructorsLabel = document.createElement("label");
        instructorsLabel.appendChild(document.createTextNode("Istruttori"));
        // radio button - students
        let students = document.createElement("input");
        students.type = "radio";
        students.name = "filter";
        students.value = "/students";
        students.onclick = () => userRole(loggedUser, students.value);
        let studentsLabel = document.createElement("label");
        studentsLabel.appendChild(document.createTextNode("Studenti"));
        // set the proper radio button checked
        if (filter == "")
            all.checked = true;
        else if (filter == "/instructors")
            instructors.checked = true;
        else if (filter == "/students")
            students.checked = true;
        usersManagementDiv.appendChild(userLabel);
        usersManagementDiv.appendChild(all);
        usersManagementDiv.appendChild(allLabel);
        usersManagementDiv.appendChild(instructors);
        usersManagementDiv.appendChild(instructorsLabel);
        usersManagementDiv.appendChild(students);
        usersManagementDiv.appendChild(studentsLabel);
        usersManagementDiv.appendChild(document.createElement("br"));

        // popolate userManagementDIv with the requested users
        getUsers(filter);

        //add the new div to the main container
        container.appendChild(searchDiv);
        container.appendChild(addUserDiv);
        container.appendChild(usersManagementDiv);

    } else if (userType == "Istruttore") {
        initIstruttore();
    } else if (userType == "Studente") {

    }
}

// function to get the list of users filtered by 'all, instructors, students or a single user'----------
function getUsers(filter) {

    fetch('http://localhost:8080/api/v1/users' + filter + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Get the array of users

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: non è stato possibile recuperare le informazioni degli utenti", true);
            else {
                // create one line with all element for every user in the array
                return data.users.map(function(user) {

                    // check for admin user
                    if (user.user_type != "Amministratore") {

                        let usersManagementDiv = document.getElementById("usersManagementDiv");
                        let line = document.createElement("hr");
                        // name
                        let nameBox = document.createElement("input");
                        nameBox.id = "name" + user.username;
                        nameBox.type = "text";
                        nameBox.value = user.name;
                        // surname
                        let surnameBox = document.createElement("input");
                        surnameBox.id = "surname" + user.username;
                        surnameBox.type = "text";
                        surnameBox.value = user.surname;
                        // div for only visible data
                        let onlyVisibleDiv = document.createElement("div");
                        onlyVisibleDiv.id = "onlyVisibleDiv";
                        // user type --> only visible
                        let userTypeBox = document.createElement("span");
                        userTypeBox.textContent = "Ruolo: " + user.user_type;
                        // username --> only visible
                        let usernameBox = document.createElement("span");
                        usernameBox.textContent = "Username: " + user.username;
                        // password --> only visible
                        let passwordBox = document.createElement("span");
                        passwordBox.textContent = "Password: " + user.password;
                        // change password button
                        let changePswButton = document.createElement("button");
                        changePswButton.id = "newPswButton";
                        changePswButton.onclick = () => changePsw(user);
                        let changePswButtonText = document.createTextNode("genera nuova password");
                        // modify button
                        let modifyButton = document.createElement("button");
                        modifyButton.id = "modifyButtonUser" + user.id;
                        modifyButton.className = "modifyButton";
                        modifyButton.onclick = () => modifyUser(user);
                        let modifyButtonText = document.createTextNode("modifica");
                        // delete button
                        let deleteButton = document.createElement("button");
                        modifyButton.id = "deleteButtonUser" + user.id;
                        deleteButton.className = "deleteButton";
                        deleteButton.onclick = () => deleteUser(user);
                        let deleteButtonText = document.createTextNode("elimina");
                        // append elements to modify/delete div
                        changePswButton.appendChild(changePswButtonText);
                        modifyButton.appendChild(modifyButtonText);
                        deleteButton.appendChild(deleteButtonText);
                        usersManagementDiv.appendChild(line);
                        usersManagementDiv.appendChild(nameBox);
                        usersManagementDiv.appendChild(surnameBox);
                        onlyVisibleDiv.appendChild(userTypeBox);
                        onlyVisibleDiv.appendChild(usernameBox);
                        onlyVisibleDiv.appendChild(passwordBox);
                        usersManagementDiv.appendChild(onlyVisibleDiv);
                        usersManagementDiv.appendChild(changePswButton);
                        usersManagementDiv.appendChild(modifyButton);
                        usersManagementDiv.appendChild(deleteButton);
                        usersManagementDiv.appendChild(document.createElement("br"));
                    }
                })
            }
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

// function to change the password to a user------------------------------------------------------------
function changePsw(user) {

    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": user.name,
                "surname": user.surname,
                "user_type": user.user_type,
                "username": user.username,
                "password": user.password,
                "changePsw": true
            })
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Get the data

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: la password di " + user.username + " non è stata cambiata", true);
            else {
                userRole(loggedUser, ""); // "update" the page
                operationResult(true, "La password di " + user.username + " è stata cambiata", true);
            }

            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

// function to modify attributes of a user--------------------------------------------------------------
function modifyUser(user) {

    //get the form object
    var name = document.getElementById("name" + user.username).value;
    var surname = document.getElementById("surname" + user.username).value;

    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": name,
                "surname": surname,
                "user_type": user.user_type,
                "username": user.username,
                "password": user.password,
                "changePsw": false
            })
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Get the data 

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: utente " + user.username + " non modificato", true);
            else {
                userRole(loggedUser, ""); // "update" the page
                operationResult(true, "Utente " + user.username + " modificato", true);
            }

            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

//function to delete a user-----------------------------------------------------------------------------
function deleteUser(user) {

    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: utente " + user.username + " non eliminato", true);
            else {
                userRole(loggedUser, ""); // "update" the page
                operationResult(true, "Utente " + user.username + " eliminato", true);
            }

            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

//function to add a new user----------------------------------------------------------------------------
function addUser() {

    //get the form object
    var name = document.getElementById("addNameBox").value;
    var surname = document.getElementById("addSurnameBox").value;
    var role = document.getElementById("addRoleBox").value;

    //check if name and surname aren't empty
    if (name == "" || surname == "") {

        if (name == "")
            document.getElementById("addNameBox").style = "background-color: #fa2d2d73";
        if (surname == "")
            document.getElementById("addSurnameBox").style = "background-color: #fa2d2d73";

        operationResult(false, "Nome o Cognome mancanti"), true;
    } else {

        fetch('http://localhost:8080/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "token": loggedUser.token,
                    "name": name,
                    "surname": surname,
                    "user_type": role,
                    "photo": "foto.jpg"
                })
            })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) { // Get the data

                loggedUser.success = data.success;
                loggedUser.message = data.message;

                if (!data.success) // check if there is an error
                    operationResult(false, "Errore: utente " + name + " " + surname + " non aggiunto", true);
                else {
                    userRole(loggedUser, ""); // "update" the page
                    operationResult(true, "Utente " + name + " " + surname + " aggiunto", true);
                }
                name.value = ""; // name = "";
                surname.value = "";
                role.value = "Studente";
                return;
            })
            .catch(error => console.error(error)); // If there is any error you will catch them here
    }
}

function initIstruttore() {

    var availabilitiesDiv = document.createElement("div");
    availabilitiesDiv.id = "availabilitiesDiv";
    // add existing availabilities
    let addAvailabilitiesDiv = document.createElement("div");
    addAvailabilitiesDiv.id = "addAvailabilitiesDiv";
    // date
    let date = document.createElement("input");
    let dateLabel = document.createTextNode("Data: ");
    date.id = "addDate";
    date.type = "date";
    // start time
    let startTime = document.createElement("input");
    let startTimeLabel = document.createTextNode("Inizio: ");
    startTime.id = "addStartTime";
    startTime.type = "time";
    startTime.min = "08:00";
    startTime.max = "20:00";
    startTime.required = "true";
    // end time
    let endTime = document.createElement("input");
    let endTimeLabel = document.createTextNode("Fine: ");
    endTime.id = "addEndTime";
    endTime.type = "time";
    endTime.min = "08:00";
    endTime.max = "20:00";
    endTime.required = "true";
    // duration
    let duration = document.createElement("input");
    let durationLabel = document.createTextNode("Durata: ");
    duration.id = "addDuration";
    duration.type = "number";
    duration.min = "15";
    duration.max = "60";
    duration.step = "5";
    duration.placeholder = "15";
    duration.required = "true";

    // add availability button
    let addAvailabilityButton = document.createElement("button");
    addAvailabilityButton.id = "addAvailabilityButton";
    addAvailabilityButton.onclick = () => addAvailability();
    let addAvailabilityButtonText = document.createTextNode("aggiungi");
    addAvailabilityButton.appendChild(addAvailabilityButtonText);

    let underMsgLine = document.createElement("hr");
    underMsgLine.style.margin = "1em";
    addAvailabilitiesDiv.appendChild(underMsgLine);

    addAvailabilitiesDiv.appendChild(dateLabel);
    addAvailabilitiesDiv.appendChild(date);
    addAvailabilitiesDiv.appendChild(startTimeLabel);
    addAvailabilitiesDiv.appendChild(startTime);
    addAvailabilitiesDiv.appendChild(endTimeLabel);
    addAvailabilitiesDiv.appendChild(endTime);
    addAvailabilitiesDiv.appendChild(durationLabel);
    addAvailabilitiesDiv.appendChild(duration);
    addAvailabilitiesDiv.appendChild(addAvailabilityButton);

    addAvailabilitiesDiv.appendChild(document.createElement("hr"));

    // get existing availabilities
    let getAvailabilitiesDiv = document.createElement("div");
    getAvailabilitiesDiv.id = "getAvailabilitiesDiv";
    // availabilities label
    let getAvailabilitiesLabel = document.createElement("b");
    getAvailabilitiesLabel.textContent = "Disponibilità attive: ";
    // refresh button
    let refreshButton = document.createElement("button");
    refreshButton.id = "refreshButton";
    refreshButton.onclick = () => updateAvailabilities(true);
    let refreshButtonText = document.createTextNode("aggiorna");
    // div to append records
    let AvailabilitiesList = document.createElement("div");
    AvailabilitiesList.id = "AvailabilitiesList";

    AvailabilitiesList.appendChild(document.createElement("hr"));

    refreshButton.appendChild(refreshButtonText);
    getAvailabilitiesDiv.appendChild(getAvailabilitiesLabel);
    getAvailabilitiesDiv.appendChild(refreshButton);
    getAvailabilitiesDiv.appendChild(AvailabilitiesList);

    // popolate getAvailabilitiesDiv with all available availabilities
    updateAvailabilities(false); // false, no need to clear the UI

    //add new divs to the main container
    availabilitiesDiv.appendChild(addAvailabilitiesDiv);
    availabilitiesDiv.appendChild(getAvailabilitiesDiv);
    container.appendChild(availabilitiesDiv);

}

function updateAvailabilities(clear) {

    fetch('http://localhost:8080/api/v2/availabilities/' + loggedUser.id + '?token=' + loggedUser.token, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then((data) => { // Get the array of users

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: non è stato possibile recuperare le tue disponibilità", true);
            else {
                // check parameter for clear
                let AvailabilitiesList = document.getElementById("AvailabilitiesList");
                if (clear)
                    AvailabilitiesList.innerHTML = "";
                // create one line with all element for every availability in the array
                return data.workshifts.map(function(availability) {

                    // check for admin user
                    if (loggedUser.user_type != "Amministratore") {
                        let line = document.createElement("hr");
                        // date
                        let date = document.createElement("h4");
                        let dateReq = availability.date;
                        date.id = "date" + availability.id;
                        date.className = "availabilityDate";
                        date.textContent = dateReq.day + "/" + dateReq.month + "/" + dateReq.year;
                        // start time
                        let startTime = document.createElement("input");
                        let startTimeLabel = document.createTextNode("Inizio: ");
                        let startTimeReq = availability.start_time;
                        startTime.id = "StartTime" + availability.id;
                        startTime.type = "time";
                        startTime.min = "08:00";
                        startTime.max = "20:00";
                        startTime.required = "true";
                        // check 2 digits hour
                        if (startTimeReq.hour < 10)
                            startTimeReq.hour = "0" + startTimeReq.hour;
                        startTime.value = startTimeReq.hour + ":" + startTimeReq.minute;
                        // end time
                        let endTime = document.createElement("input");
                        let endTimeLabel = document.createTextNode("Fine: ");
                        let endTimeReq = availability.end_time;
                        endTime.id = "EndTime" + availability.id;
                        endTime.type = "time";
                        endTime.min = "08:00";
                        endTime.max = "20:00";
                        endTime.required = "true";
                        // check 2 digits hour
                        if (endTimeReq.hour < 10)
                            endTimeReq.hour = "0" + endTimeReq.hour;
                        endTime.value = endTimeReq.hour + ":" + endTimeReq.minute;
                        // duration
                        let duration = document.createElement("input");
                        let durationLabel = document.createTextNode("Durata: ");
                        duration.id = "Duration" + availability.id;
                        duration.className = "durationInput";
                        duration.type = "number";
                        duration.placeholder = availability.duration;
                        duration.min = "15";
                        duration.max = "60";
                        duration.step = "5";
                        //duration.required = "true";
                        duration.value = availability.duration;
                        // modify button
                        let modifyButton = document.createElement("button");
                        modifyButton.id = "modifyButtonWorkshift" + availability.id;
                        modifyButton.className = "modifyButton";
                        modifyButton.onclick = () => modifyAvailability(availability);
                        let modifyButtonText = document.createTextNode("modifica");
                        // delete button
                        let deleteButton = document.createElement("button");
                        deleteButton.id = "deleteButtonWorkshift" + availability.id;
                        deleteButton.className = "deleteButton";
                        deleteButton.onclick = () => deleteAvailability(availability);
                        let deleteButtonText = document.createTextNode("elimina");
                        // append elements to modify/delete div
                        modifyButton.appendChild(modifyButtonText);
                        deleteButton.appendChild(deleteButtonText);

                        AvailabilitiesList.appendChild(date);
                        AvailabilitiesList.appendChild(startTimeLabel);
                        AvailabilitiesList.appendChild(startTime);
                        AvailabilitiesList.appendChild(endTimeLabel);
                        AvailabilitiesList.appendChild(endTime);
                        AvailabilitiesList.appendChild(durationLabel);
                        AvailabilitiesList.appendChild(duration);
                        AvailabilitiesList.appendChild(modifyButton);
                        AvailabilitiesList.appendChild(deleteButton);
                        AvailabilitiesList.appendChild(line);
                        AvailabilitiesList.appendChild(document.createElement("br"));
                    }
                })
            }
        })
        .then(operationResult(true, "Disponibilità recuperate con successo", false))
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

function modifyAvailability(availability) {
    //get the form object
    var startTime = document.getElementById("StartTime" + availability.id).value;
    var endTime = document.getElementById("EndTime" + availability.id).value;
    var duration = document.getElementById("Duration" + availability.id).value;
    // parse input time value strings and put into an object
    var startTimeObj = {};
    var endTimeObj = {};
    startTimeObj.hour = parseInt(startTime.split(":")[0]);
    startTimeObj.minute = parseInt(startTime.split(":")[1]);
    endTimeObj.hour = parseInt(endTime.split(":")[0]);
    endTimeObj.minute = parseInt(endTime.split(":")[1]);

    fetch('http://localhost:8080/api/v2/availabilities/' + availability.id + '?token=' + loggedUser.token, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "date": availability.date,
                "instructor": loggedUser.id,
                "start_time": startTimeObj,
                "end_time": endTimeObj,
                "duration": duration,
            })
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Get the data 

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: disponibilità non modificata", true);
            else {
                updateAvailabilities(true); // refresh availabilities
                operationResult(true, "Disponibilità modificata con successo", true);
            }

            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

function deleteAvailability(availability) {
    fetch('http://localhost:8080/api/v2/availabilities/' + availability.id + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if (!data.success) // check if there is an error
                operationResult(false, "Errore: disponibilità non eliminata", true);
            else {
                updateAvailabilities(true); // refresh availabilities
                operationResult(true, "Disponibilità eliminata con successo", true);
            }

            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here
}

function addAvailability() {

    //get the form object
    var addDate = document.getElementById("addDate").value;
    var addStartTime = document.getElementById("addStartTime").value;
    var addEndTime = document.getElementById("addEndTime").value;
    var addDuration = document.getElementById("addDuration").value;

    //check if name and surname aren't empty
    if (addDate == "" || addStartTime == "" || addEndTime == "" || addDuration == "") {

        if (addDate == "")
            document.getElementById("addDate").style = redErrorBackground;
        if (addStartTime == "")
            document.getElementById("addStartTime").style = redErrorBackground;
        if (addEndTime == "")
            document.getElementById("addEndTime").style = redErrorBackground;
        if (addDuration == "")
            document.getElementById("addDuration").style = redErrorBackground;

        operationResult(false, "Alcuni campi sono incompleti!", true);
    } else {
        let dateObj = {};
        var startTimeObj = {};
        var endTimeObj = {};
        dateObj.day = addDate.split("-")[2];
        dateObj.month = addDate.split("-")[1];
        dateObj.year = addDate.split("-")[0];
        startTimeObj.hour = parseInt(addStartTime.split(":")[0]);
        startTimeObj.minute = parseInt(addStartTime.split(":")[1]);
        endTimeObj.hour = parseInt(addEndTime.split(":")[0]);
        endTimeObj.minute = parseInt(addEndTime.split(":")[1]);

        fetch('http://localhost:8080/api/v2/availabilities' + '?token=' + loggedUser.token, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "date": dateObj,
                    "instructor": loggedUser.id,
                    "start_time": startTimeObj,
                    "end_time": endTimeObj,
                    "duration": addDuration
                })
            })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) { // Get the data

                loggedUser.success = data.success;
                loggedUser.message = data.message;

                if (!data.success) // check if there is an error
                    operationResult(false, "Errore: disponibilità non aggiunta!", true);
                else {
                    updateAvailabilities(true); // refresh availabilities
                    operationResult(true, "Disponibilità aggiunta con successo", true);
                }
                document.getElementById("addDate").value = "";
                document.getElementById("addStartTime").value = "";
                document.getElementById("addEndTime").value = "";
                document.getElementById("addDuration").value = "";
                document.getElementById("addDate").style = "";
                document.getElementById("addStartTime").style = "";
                document.getElementById("addEndTime").style = "";
                document.getElementById("addDuration").style = "";
                return;
            })
            .catch(error => console.error(error)); // If there is any error you will catch them here
    }
}