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

    //adding new element based on user type
    var container = document.createElement("div");
    var role = document.createElement("h3");
    var roleText = document.createTextNode(userType);
    var welcomeMsg = document.createElement("h2");
    var welcomeMsgText = document.createTextNode("Benvenuto " + username);
    welcomeMsg.appendChild(welcomeMsgText);
    container.appendChild(welcomeMsg);
    role.appendChild(roleText);
    container.appendChild(role);
    document.body.appendChild(container);
}