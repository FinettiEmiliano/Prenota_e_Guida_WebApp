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
        loggedUser.username = data.username;
        loggedUser.id = data.id;
        loggedUser.user_type = data.user_type;

        //check if there is an error in the credentials
        if(!data.success)
            showError();
        else
            userRole(data); 
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
function userRole(result){
    const userType = result.user_type;
    const username = result.username;

    //delete login form and error div
    var form = document.getElementById("loginform");
    form.remove();

    //adding page element common to all users
    var container = document.createElement("div");
    var role = document.createElement("h3");
    var roleText = document.createTextNode(userType);
    var welcomeMsg = document.createElement("h2");
    var welcomeMsgText = document.createTextNode("Benvenuto " + username);
    welcomeMsg.appendChild(welcomeMsgText);
    container.appendChild(welcomeMsg);
    role.appendChild(roleText);
    container.appendChild(role);

    //adding page element based on user type
    if(userType=="Amministratore"){
        //modify/delete div
        var usersManagementDiv = document.createElement("div");
        //'modify or delete' label
        var searchBoxLabel = document.createTextNode("Modifica o elimina un utente:");
        //select
        var searchBox = document.createElement("select");
        searchBox.style = "margin-left: 1em";
        var searchElement = document.createElement("option");
        searchElement.selected = "true";
        searchElement.disabled = "true";
        var searchElementText = document.createTextNode("Nome Utente");
        //modify button
        var modifyButton = document.createElement("button");
        modifyButton.style = "margin-left: 1em";
        var modifyButtonText = document.createTextNode("modifica");
        //delete button
        var deleteButton = document.createElement("button");
        deleteButton.style = "margin-left: 1em";
        var deleteButtonText = document.createTextNode("elimina");
        //append elements to modify/delte div
        usersManagementDiv.appendChild(searchBoxLabel);
        searchElement.appendChild(searchElementText);
        searchBox.appendChild(searchElement);
        usersManagementDiv.appendChild(searchBox);
        modifyButton.appendChild(modifyButtonText);
        usersManagementDiv.appendChild(modifyButton);
        deleteButton.appendChild(deleteButtonText);
        usersManagementDiv.appendChild(deleteButton);
        //add user div
        var addUserDiv = document.createElement("div");
        addUserDiv.style = "margin-top: 2em";
        //'add' label
        var addLabel = document.createTextNode("Aggiungi un nuovo utente:");
        // name div
        var nameDiv = document.createElement("div");
        nameDiv.style = "margin-top: 1em";
        nameBox = document.createElement("input");
        nameBox.placeholder ="Nome";
        nameBox.style = "margin-left: 1em";
        // surname div
        var surnameDiv = document.createElement("div");
        surnameDiv.style = "margin-top: 1em";
        surnameBox = document.createElement("input");
        surnameBox.placeholder ="Cognome";
        surnameBox.style = "margin-left: 1em";
        // role div
        var roleDiv = document.createElement("div");
        roleDiv.style = "margin-top: 1em";
        roleBox = document.createElement("select");
        roleBox.style = "margin-left: 1em";
        var roleElement1 = document.createElement("option");
        roleElement1.selected = "true";
        var roleElement1Text = document.createTextNode("Studente");
        var roleElement2 = document.createElement("option");
        var roleElement2Text = document.createTextNode("Istruttore");
        //append elements to add user div
        addUserDiv.appendChild(addLabel);
        nameDiv.appendChild(nameBox);
        surnameDiv.appendChild(surnameBox);
        roleElement1.appendChild(roleElement1Text);
        roleElement2.appendChild(roleElement2Text);
        roleBox.appendChild(roleElement1);
        roleBox.appendChild(roleElement2);
        roleDiv.appendChild(roleBox);
        addUserDiv.appendChild(nameDiv);
        addUserDiv.appendChild(surnameDiv);
        addUserDiv.appendChild(roleDiv);
        //add the new div to the main container
        container.appendChild(usersManagementDiv);
        container.appendChild(addUserDiv);
    }

    document.body.appendChild(container);
}