function getAll() {
    axios.get("http://localhost:8000/api/varaukset")
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
    axios.delete("http://localhost:8000/api/varaukset/" + id)
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
    const tInput = document.getElementById("tila")
    const vInput = document.getElementById("varaaja")
    const pInput = document.getElementById("varauspaiva")
    const json = {
        "tila": tInput.value,
        "varaaja": vInput.value,
        "varauspaiva": pInput.value
    }
    console.log(json)
    axios.post("http://localhost:8000/api/varaukset", json)
        .then(response => {
            console.log("response received");
            console.log(response.data)
            tInput.value = ''
            vInput.value = ''
            pInput.value = ''
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

function createTable(varaukset) {
    container = document.getElementById("varaukset-table-container")
    container.innerHTML = ""
    table = document.createElement("table")
    table.innerHTML = "<tr><th>ID</th><th>Tila</th><th>Varaaja</th><th>Varauspäivä</th></tr>"
    container.append(table)

    for (let varaus of varaukset){
        const id = document.createElement("td")
        id.innerHTML = varaus.id
        const tila = document.createElement("td")
        tila.innerHTML = varaus.tila
        const varaaja = document.createElement("td")
        varaaja.innerHTML = varaus.varaaja
        const varauspaiva = document.createElement("td")
        varauspaiva.innerHTML = varaus.varauspaiva
        const del = document.createElement("button")
        del.onclick = () => deleteId(varaus.id)
        del.innerHTML = "X"
        const row = document.createElement("tr")
        row.append(id, tila, varaaja, varauspaiva, del)
        table.append(row)
    }
}