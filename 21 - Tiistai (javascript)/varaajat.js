function getAll() {
    axios.get("http://localhost:8000/api/varaajat")
        .then(response => {
            console.log("response received");
            console.log(response.data)
            createTable(response.data.result);
        })
        .catch(error => {
            granulateError(error)
        });
}

function deleteId(id) {
    axios.delete("http://localhost:8000/api/varaajat/" + id)
        .then(response => {
            console.log("response received");
            console.log(response.data)
            getAll()
        })
        .catch(error => {
            granulateError(error)
        });
}

function createName(event) {
    event.preventDefault()
    const nameInput = document.getElementById("name")
    axios.post("http://localhost:8000/api/varaajat", {"nimi": nameInput.value})
        .then(response => {
            console.log("response received");
            console.log(response.data)
            nameInput.value = ''
            getAll()
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

function createTable(varaajat) {
    container = document.getElementById("varaajat-table-container")
    container.innerHTML = ""
    table = document.createElement("table")
    table.innerHTML = "<tr><th>ID</th><th>Nimi</th></tr>"
    container.append(table)

    for (let varaaja of varaajat){
        const id = document.createElement("td")
        id.innerHTML = varaaja.id
        const name = document.createElement("td")
        name.innerHTML = varaaja.nimi
        const del = document.createElement("button")
        del.onclick = () => deleteId(varaaja.id)
        del.innerHTML = "X"
        const row = document.createElement("tr")
        row.append(id, name, del)
        table.append(row)
    }
}