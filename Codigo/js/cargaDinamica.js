
let urlLocal = 'http://localhost/Myclub/Codigo/php/';
let divCabecera = document.getElementById("cabecera");
let urlCabecera = "../html/header.html";
fetch(urlCabecera)    
.then(response => response.text())
.then((html) => {
    divCabecera.innerHTML= html; 
});

// COMPROBACION DE PERMISOS
// function redirigirLogin(){
//     if(sessionStorage.getItem('jwt') == null){
//         window.location.href = 'login.html';
//     }else{
//         console.log("no autorizado");
//     }
// }
// function checkRol(){
// fetch
// }

