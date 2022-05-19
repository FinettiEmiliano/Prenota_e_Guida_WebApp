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

        console.log(data);
        if(!data.success)       //check if there is an error in the credentials
            showError(data); 
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};

//function to show the credentials error 
function showError(result){
    //console.log(result.success);
        document.getElementById("IdErrori").innerHTML = 
        "<h3>Nome utente errato o inesistente</h3>";
}
