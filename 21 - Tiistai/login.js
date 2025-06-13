function login(event){
    console.log("login")
    event.preventDefault()
    const nInput = document.getElementById("username")
    const pInput = document.getElementById("password")
    const json = {
        "tunnus": nInput.value,
        "salasana": pInput.value
    }
    console.log(json)
    axios.post("http://localhost:8000/api/login", json, {withCredentials: true})
        .then(response => {
            console.log("response received");
            console.log(response.data)
            nInput.value = ''
            pInput.value = ''
        })
        .catch(error => {
            granulateError(error)
        });
}

function granulateError (error) {
    console.error("Error in Axios request: " + error);
    if (error.response) {
        console.log("Error status: " + error.response.status);
        console.log(error.response.data);
    } else if (error.request) {
        console.log("No response received: " + error.request);
    } else {
        console.log("Error message: " + error.message);
    }
}