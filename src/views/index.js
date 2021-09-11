function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            construct(this);
        }
    };
    xhttp.open("GET", "http://localhost:8000/chat", true);
    xhttp.send();
}

function construct(this) {
    var xmlDoc = this.responseXML;

    document.getElementById("chatParent").innerHTML = "<h1>hey</h1>";
}
