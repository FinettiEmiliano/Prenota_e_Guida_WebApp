var loggedUser = {};

function login()
{
    //get the form object
    var username = document.getElementById("IdInputusername").value;
    var password = document.getElementById("IdInputpassword").value;

    fetch('http://localhost:8080/api/v1/authenticationToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { "username": username, "password": password } )
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Here you get the data to modify as you please

        loggedUser.success = data.success;
        loggedUser.message = data.message;
        loggedUser.token = data.token;
        loggedUser.id = data.id;
        loggedUser.user_type = data.user_type;
        loggedUser.username = data.username;
        loggedUser.name = data.name;
        loggedUser.surname = data.surname;

        //check if there is an error in the credentials
        if(!data.success)
            showError();
        else
            userRole(data, ""); 
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};

//function to show the credentials error 
function showError(){
    //delete precedent error
    if(document.getElementById("ErrorDiv")!=null)
    document.getElementById("ErrorDiv").remove();

    //creation of new page element
    var div = document.createElement("div");
    div.id = "ErrorDiv";
    var error = document.createElement("h3");
    var errorText = document.createTextNode("Nome utente o password errati");
    error.appendChild(errorText);
    div.appendChild(error);
    document.getElementById("loginform").appendChild(div);
}

//function to detect user type and create proper page
function userRole(result, filter){
    const userType = result.user_type;

    //delete login form and error div
    var form = document.getElementById("loginform");
    if(form!=undefined)
        form.remove();

    var containerCheck = document.getElementById("container");
    if(containerCheck!=undefined)
        containerCheck.remove();

    //adding page element common to all users
    var container = document.createElement("div");
    container.id = "container";
    var role = document.createElement("h3");
    var roleText = document.createTextNode(userType);
    var welcomeMsg = document.createElement("h2");
    var welcomeMsgText = document.createTextNode("Benvenuto " + loggedUser.name + " " + loggedUser.surname);
    welcomeMsg.appendChild(welcomeMsgText);
    container.appendChild(welcomeMsg);
    role.appendChild(roleText);
    container.appendChild(role);

    //adding page element based on user type
    if(userType=="Amministratore"){
        //search user div
        var searchDiv = document.createElement("div");
        searchDiv.id = "searchDiv";
        var searchBoxLabel = document.createTextNode("Cerca utente:");
        var searchBox = document.createElement("input");
        searchBox.id = "searchBox";
        searchBox.placeholder = "Nome utente";
        var searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.onclick = () => userRole(loggedUser, "/" + searchBox.value);
        var searchButtonText = document.createTextNode("cerca");
        var line3 = document.createElement("hr");
        searchButton.appendChild(searchButtonText);
        searchDiv.appendChild(searchBoxLabel);
        searchDiv.appendChild(searchBox);
        searchDiv.appendChild(searchButton);
        searchDiv.appendChild(line3);
        //add user div
        var addUserDiv = document.createElement("div");
        addUserDiv.id = "addUserDiv";
        var line2 = document.createElement("hr");
        //'add' label
        var addLabel = document.createTextNode("Aggiungi utente:");
        // name
        nameBox = document.createElement("input");
        nameBox.id = "addNameBox";
        nameBox.placeholder ="Nome";
        // surname
        surnameBox = document.createElement("input");
        surnameBox.id = "addSurnameBox";
        surnameBox.placeholder ="Cognome";
        // role
        roleBox = document.createElement("select");
        roleBox.id = "addRoleBox";
        var roleElement1 = document.createElement("option");
        roleElement1.selected = "true";
        var roleElement1Text = document.createTextNode("Studente");
        var roleElement2 = document.createElement("option");
        var roleElement2Text = document.createTextNode("Istruttore");
        //add button
        var addButton = document.createElement("button");
        addButton.onclick = (result) => { addUser(result); };
        var addButtonText = document.createTextNode("aggiungi");
        //output section
        var outputMsg = document.createElement("p");
        outputMsg.id = "outputMsg";
        //append elements to add user div
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
        //modify/delete div
        var usersManagementDiv = document.createElement("div");
        usersManagementDiv.id = "usersManagementDiv";
        //'modify or delete' label
        var userLabel = document.createTextNode("Utenti:");
        //filter
        var all = document.createElement("input");
        all.id="all";
        all.type = "radio";
        all.name = "filter";
        all.value = "";
        all.onclick = ()=> userRole(loggedUser, all.value);
        var allLabel = document.createElement("label");
        allLabel.appendChild(document.createTextNode("Tutti"));
        var instructors = document.createElement("input");
        instructors.type = "radio";
        instructors.name = "filter";
        instructors.value = "/instructors";
        instructors.onclick = ()=>userRole(loggedUser, instructors.value);
        var instructorsLabel = document.createElement("label");
        instructorsLabel.appendChild(document.createTextNode("Istruttori"));
        var students = document.createElement("input");
        students.type = "radio";
        students.name = "filter";
        students.value = "/students";
        students.onclick = ()=>userRole(loggedUser, students.value);
        var studentsLabel = document.createElement("label");
        studentsLabel.appendChild(document.createTextNode("Studenti"));
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
        var username="";
        if(filter!="")
            username=filter.replace('/','');

        fetch('http://localhost:8080/api/v1/users' + filter + '?token=' + loggedUser.token + '&id=' + loggedUser.id, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'username': username
            }
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {       // Here you get the data to modify as you please
            loggedUser.success = data.success;
            loggedUser.message = data.message;
            return data.map(function(user) {
                //check for admin user
                if(user.user_type!="Amministratore"){
                    var line = document.createElement("hr");
                    //name
                    var nameBox = document.createElement("input");
                    nameBox.id = "name" + user.username;
                    nameBox.type = "text";
                    nameBox.value = user.name;
                    //surname
                    var surnameBox = document.createElement("input");
                    surnameBox.id = "surname" + user.username;
                    surnameBox.type = "text";
                    surnameBox.value = user.surname;
                    //div for only visible data
                    var onlyVisibleDiv = document.createElement("div");
                    onlyVisibleDiv.id = "onlyVisibleDiv";
                    //user type --> only visible
                    var userTypeBox = document.createElement("span");
                    userTypeBox.textContent = "Ruolo: " + user.user_type;
                    //username --> only visible
                    var usernameBox = document.createElement("span");
                    usernameBox.textContent = "Username: " + user.username;
                    //password --> only visible
                    var passwordBox = document.createElement("span");
                    passwordBox.textContent = "Password: " + user.password;
                    //change password button
                    var changePswButton = document.createElement("button");
                    changePswButton.id = "newPswButton";
                    changePswButton.onclick = ()=>changePsw(user);
                    var changePswButtonText = document.createTextNode("genera nuova password");
                    //modify button
                    var modifyButton = document.createElement("button");
                    modifyButton.id = "modifyButton";
                    modifyButton.onclick = ()=>modifyUser(user);
                    var modifyButtonText = document.createTextNode("modifica");
                    //delete button
                    var deleteButton = document.createElement("button");
                    deleteButton.id = "deleteButton";
                    deleteButton.onclick = () => deleteUser(user);
                    var deleteButtonText = document.createTextNode("elimina");
                    //append elements to modify/delte div
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
            //return;
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
        //add the new div to the main container
        container.appendChild(searchDiv);
        container.appendChild(addUserDiv);
        container.appendChild(usersManagementDiv);
    }
    else if(userType=="Istruttore"){

    }
    else if(userType=="Studente"){
        
    }
    document.body.appendChild(container);
}

//function to change the password a user
function changePsw(user){
    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
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
    .then(function(data) {       // Here you get the data to modify as you please
        loggedUser.success = data.success;
        loggedUser.message = data.message;
        userRole(loggedUser, "");
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}


//function to modify attributes of a user
function modifyUser(user){
    //get the form object
    var name = document.getElementById("name" + user.username).value;
    var surname = document.getElementById("surname" + user.username).value;
    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
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
    .then(function(data) {       // Here you get the data to modify as you please
        loggedUser.success = data.success;
        loggedUser.message = data.message;
        userRole(loggedUser, "");
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//function to delete a user
function deleteUser(user){
    fetch('http://localhost:8080/api/v1/users/' + user.id + '?token=' + loggedUser.token, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Here you get the data to modify as you please
        loggedUser.success = data.success;
        loggedUser.message = data.message;
        userRole(loggedUser, "");
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//function to add a new user
function addUser(result){
    //get the form object
    var name = document.getElementById("addNameBox").value;
    var surname = document.getElementById("addSurnameBox").value;
    var role = document.getElementById("addRoleBox").value;
    var output = "";
    //check if name and surname aren't empty
    if(name=="" || surname==""){
        if(name=="")
            document.getElementById("addNameBox").style = "border-color: red; margin-left: 1em";
        if(surname=="")
            document.getElementById("addSurnameBox").style = "border-color: red; margin-left: 1em";  
        output = "Dati mancanti";                                        
    }
    else{
        fetch('http://localhost:8080/api/v1/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { 
                "token" : loggedUser.token,
                "name": name, 
                "surname": surname,
                "user_type" : role,
                "photo": "foto.jpg"} )
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {       // Here you get the data to modify as you please
            loggedUser.success = data.success;
            loggedUser.message = data.message;
            userRole(loggedUser, "");
            //check if there is an error in the credentials
            if(!data.success)
                showError();
            else
                console.log(data); 
            return;
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
        //restoring border box color
        document.getElementById("addNameBox").style = "margin-left: 1em";
        document.getElementById("addNameBox").value = "";
        document.getElementById("addSurnameBox").style = "margin-left: 1em";
        document.getElementById("addSurnameBox").value = "";
        output = "Utente aggiunto";
    }   
    // show the output message
    document.getElementById("outputMsg").textContent = output;
}