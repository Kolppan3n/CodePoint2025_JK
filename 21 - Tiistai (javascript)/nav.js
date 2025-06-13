document.addEventListener("DOMContentLoaded", function() {

    const location = window.location.pathname

    const pages = [
        "Index",
        "Tilat",
        "Varaajat",
        "Varaukset",
        "Login"
    ]

    const nav = document.createElement("nav")
    const table = document.createElement("table")
    const tr = document.createElement("tr")

    for (let page of pages ){
        const th = document.createElement("th")
        const a = document.createElement("a")
        const url = "/"+page+".html"
        if(location.toUpperCase() !== url.toUpperCase()){
            a.style = "text-decoration: none;"
        }
        a.href = page + ".html"
        a.innerHTML = page
        th.append(a)
        tr.append(th)
    }

    table.append(tr)
    nav.append(table)
    document.getElementById("nav-container").append(nav)
});
