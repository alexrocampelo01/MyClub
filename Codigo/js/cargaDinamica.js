
let divCabecera = document.getElementById("cabecera");
let urlCabecera = "../html/header.html";
fetch(urlCabecera)    
.then(response => response.text())
.then((html) => {
    divCabecera.innerHTML= html; 
});

