var loggedUser = {};

function login()
{
    //get the form object
    var username = document.getElementById("Idusername").value;
    var password = document.getElementById("Idpassword").value;

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
        //console.log(data);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
};