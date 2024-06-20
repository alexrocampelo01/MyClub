let urlLocal = 'http://localhost/Myclub/Codigo/php/';
// let urlServidor = 'http://79.109.50.179/Codigo/php/';
let divCabecera = document.getElementById("cabecera");
let urlCabecera = "../html/header.html";
fetch(urlCabecera)    
.then(response => response.text())
.then((html) => {
    divCabecera.innerHTML= html; 
    let jwt = sessionStorage.getItem('jwt');
    if(jwt == null || jwt == undefined){
        console.log("no autorizado");
    }else{
        console.log("Autorizado");
        let butLogin = document.querySelector('#butLogin');
        console.log(butLogin);
        document.querySelector('#butLogin').classList.add('esconderNone');
        document.querySelector('#butCerrarSesion').classList.remove('esconderNone');
        document.querySelector('#butCerrarSesion').addEventListener('click', cerrarSesion);
    }
});
function cerrarSesion(){
    sessionStorage.removeItem('jwt');
    window.location.href = 'index.html';
}
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

