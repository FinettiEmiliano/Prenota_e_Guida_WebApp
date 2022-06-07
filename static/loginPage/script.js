var loggedUser = {};

// login function---------------------------------------------------------------------------------------
function login()
{
    // get the form object
    let username = document.getElementById("IdInputusername").value;
    let password = document.getElementById("IdInputpassword").value;

    fetch('/api/v1/authenticationToken', {
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
                operationResult(false, "Nome utente o password errati", true);
            else
                userRole(data, ""); // if the credentials are correct, call the function to detect the role

        return;

    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};

// function to show the error---------------------------------------------------------------------------
function operationResult(parentDiv, msg){

    // delete previous error
    if(document.getElementById("ErrorDiv")!=null)
        document.getElementById("ErrorDiv").remove();

    // creation of new page element to show error message
    let div = document.createElement("div");
        div.id = "ErrorDiv";
    let error = document.createElement("h5");
    let errorText = document.createTextNode(msg);
    error.appendChild(errorText);
    div.appendChild(error);
    document.getElementById(parentDiv).appendChild(div);

}

// function to detect user type and create proper page--------------------------------------------------
function userRole(result, filter, section){

    // get user role
    let userType = result.user_type;

    // delete login form and error div element
    let form = document.getElementById("loginform");
    if(form!=undefined)
        form.remove();

    // delete div that contains all element in order to be updated if necessary
    let containerCheck = document.getElementById("container");
    if(containerCheck!=undefined)
        containerCheck.remove();

    // adding page element common to all users
    let container = document.createElement("div");
        container.id = "container";
    let role = document.createElement("h3");
    let roleText = document.createTextNode(userType);
    let welcomeMsg = document.createElement("h2");
    let welcomeMsgText = document.createTextNode("Benvenuto " + loggedUser.name + " " + loggedUser.surname);
    let operationResultMsg = document.createElement("div");
        operationResultMsg.id = "operationResult";
    welcomeMsg.appendChild(welcomeMsgText);
    container.appendChild(welcomeMsg);
    role.appendChild(roleText);
    role.appendChild(operationResultMsg);
    container.appendChild(role);

    // adding page element based on user type
    if(userType=="Amministratore"){

        //side menu
        let selectBar = document.createElement("div");
            selectBar.id = "selectBar";
        let item1box = document.createElement("div");
            item1box.id = "item1";
            item1box.onclick = () => userRole(loggedUser, "", "gestione utenti");
        let item1 = document.createElement("span");
        let item1text = document.createTextNode("Gestione utenti");
        let item2box = document.createElement("div");
            item2box.id = "item2";
            item2box.onclick = () => userRole(loggedUser, "", "modifica disponibilita");
        let item2 = document.createElement("span");
        let item2text = document.createTextNode("Modifica disponibilità")
        item1.appendChild(item1text);
        item1box.appendChild(item1);
        item2.appendChild(item2text);
        item2box.appendChild(item2);
        selectBar.appendChild(item1box);
        selectBar.appendChild(item2box);

        if(section == "gestione utenti" || section == undefined){
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
                nameBox.placeholder ="Nome";
            // surname
            let surnameBox = document.createElement("input");
                surnameBox.id = "addSurnameBox";
                surnameBox.placeholder ="Cognome";
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
                all.id="all";
                all.type = "radio";
                all.name = "filter";
                all.value = "";
                all.onclick = ()=> userRole(loggedUser, all.value);
            let allLabel = document.createElement("label");
                allLabel.appendChild(document.createTextNode("Tutti"));
            // radio button - instructors
            let instructors = document.createElement("input");
                instructors.type = "radio";
                instructors.name = "filter";
                instructors.value = "/instructors";
                instructors.onclick = ()=>userRole(loggedUser, instructors.value);
            let instructorsLabel = document.createElement("label");
                instructorsLabel.appendChild(document.createTextNode("Istruttori"));
            // radio button - students
            let students = document.createElement("input");
                students.type = "radio";
                students.name = "filter";
                students.value = "/students";
                students.onclick = ()=>userRole(loggedUser, students.value);
            let studentsLabel = document.createElement("label");
                studentsLabel.appendChild(document.createTextNode("Studenti"));
            // set the proper radio button checked
            if(filter=="")
                all.checked = true;
            else if(filter=="/instructors")
                instructors.checked = true;
            else if(filter=="/students")
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
            container.appendChild(selectBar);
            container.appendChild(searchDiv);
            container.appendChild(addUserDiv);
            container.appendChild(usersManagementDiv);
        }
        else if(section == "modifica disponibilita"){

            container.appendChild(selectBar);
            item1box.style="background-color:#29287573";
            item2box.style="background-color:#292875";
            
        }

    }
    else if(userType=="Istruttore"){

    }
    else if(userType=="Studente"){
        
    }
    document.body.appendChild(container);
}

// function to get the list of users filtered by 'all, instructors, students or a single user'----------
function getUsers(filter){

    fetch('/api/v1/users' + filter + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {       // Get the array of users

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if(!data.success) // check if there is an error
                operationResult("operationResult","Errore: non è stato possibile recuperare le informazioni degli utenti");
            else{

                // create one line with all element for every user in the array
                return data.users.map(function(user) {

                    // check for admin user
                    if(user.user_type!="Amministratore"){

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
                            changePswButton.onclick = ()=>changePsw(user);
                        let changePswButtonText = document.createTextNode("genera nuova password");
                        // modify button
                        let modifyButton = document.createElement("button");
                            modifyButton.id = "modifyButton";
                            modifyButton.onclick = ()=>modifyUser(user);
                        let modifyButtonText = document.createTextNode("modifica");
                        // delete button
                        let deleteButton = document.createElement("button");
                            deleteButton.id = "deleteButton";
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
        .catch( error => console.error(error) ); // If there is any error you will catch them here
}

// function to change the password to a user------------------------------------------------------------
function changePsw(user){

    fetch('/api/v1/users/' + user.id + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            "name" : user.name,
            "surname" : user.surname,
            "user_type" :user.user_type,
            "username" : user.username, 
            "password" : user.password,
            "changePsw" : true
        } )
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Get the data

        loggedUser.success = data.success;
        loggedUser.message = data.message;

        if(!data.success) // check if there is an error
            operationResult("operationResult","Errore: la password di " + user.username + " non è stata cambiata");
        else{
            userRole(loggedUser, ""); // "update" the page
            operationResult("operationResult","La password di " + user.username + " è stata cambiata");
        }

        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

// function to modify attributes of a user--------------------------------------------------------------
function modifyUser(user){

    //get the form object
    var name = document.getElementById("name" + user.username).value;
    var surname = document.getElementById("surname" + user.username).value;

    fetch('/api/v1/users/' + user.id + '?token=' + loggedUser.token + '&id=' + loggedUser.id , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            "name" : name,
            "surname" : surname,
            "user_type" :user.user_type,
            "username" : user.username, 
            "password" : user.password,
            "changePsw" : false
        } )
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Get the data 

        loggedUser.success = data.success;
        loggedUser.message = data.message;

        if(!data.success) // check if there is an error
            operationResult("operationResult","Errore: utente " + user.username + " non modificato");
        else{
            userRole(loggedUser, ""); // "update" the page
            operationResult("operationResult","Utente " + user.username + " modificato");
        }

        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//function to delete a user-----------------------------------------------------------------------------
function deleteUser(user){

    fetch('/api/v1/users/' + user.id + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Here you get the data to modify as you please

        loggedUser.success = data.success;
        loggedUser.message = data.message;

        if(!data.success) // check if there is an error
            operationResult("operationResult","Errore: utente " + user.username + " non eliminato");
        else{
            userRole(loggedUser, ""); // "update" the page
            operationResult("operationResult","Utente " + user.username + " eliminato");
        }

        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//function to add a new user----------------------------------------------------------------------------
function addUser(result){

    //get the form object
    var name = document.getElementById("addNameBox").value;
    var surname = document.getElementById("addSurnameBox").value;
    var role = document.getElementById("addRoleBox").value;

    //check if name and surname aren't empty
    if(name=="" || surname==""){

        if(name=="")
            document.getElementById("addNameBox").style = "background-color: #fa2d2d73";
        if(surname=="")
            document.getElementById("addSurnameBox").style = "background-color: #fa2d2d73";

        operationResult("operationResult","Nome o Cognome mancanti");              
    }
    else{

        fetch('/api/v1/users' + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { 
                "name": name, 
                "surname": surname,
                "user_type" : role,
                "photo": "foto.jpg"} )
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {       // Get the data

            loggedUser.success = data.success;
            loggedUser.message = data.message;

            if(!data.success) // check if there is an error
                operationResult("operationResult","Errore: utente " + name + " " + surname + " non aggiunto");
            else{
                userRole(loggedUser, ""); // "update" the page
                operationResult("operationResult","Utente " + name + " " + surname + " aggiunto");
            } 

            return;
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
    }
}