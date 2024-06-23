let urlApi = 'http://localhost/Myclub/Codigo/php/';
let urlHtml = 'http://localhost/Myclub/Codigo/html/';
// let urlServidor = 'http://79.109.50.179/Codigo/php/';
let urlLogin = `${urlHtml}login.html`;
let urlCalendario = `${urlHtml}calendarioEjemplo.html`;
let urlListas = `${urlHtml}listas.html`;
let urlIndex = `${urlHtml}index.html`;
console.log("urlIndex", urlIndex);
let divCabecera = document.getElementById("cabecera");
let urlCabecera = "../html/header.html";
fetch(urlCabecera)    
.then(response => response.text())
.then(async (html) => {
    divCabecera.innerHTML= html; 
    let jwt = sessionStorage.getItem('jwt');
    if(jwt == null || jwt == undefined){
        console.log("no autorizado");
        if(window.location.href == urlCalendario) window.location.href = urlLogin;
        if(window.location.href == urlListas) window.location.href = urlLogin;
    }else{
        console.log("Autorizado");
        let butLogin = document.querySelector('#butLogin');
        console.log(butLogin);
        document.querySelector('#butLogin').classList.add('esconderNone');
        document.querySelector('#butCerrarSesion').classList.remove('esconderNone');
        document.querySelector('#butCerrarSesion').addEventListener('click', cerrarSesion);
        if(await checkRol() == 'socio' || await checkRol() == 'familiar'){
            let cabeceraLinkListas = document.querySelector('#linkListas');
            // console.log("cabeceraLinkListas", cabeceraLinkListas);
            cabeceraLinkListas.classList.add('esconderNone');
        }
    }
});

let divPie = document.getElementById("footer");
let urlPie = "../html/footer.html";
fetch(urlPie)
.then(response => response.text())
.then((html) => {
    divPie.innerHTML= html; 
});
function cerrarSesion(){
    sessionStorage.removeItem('jwt');
    window.location.href = 'index.html';
}
/* 
* SEGURIDAD DE LA PAGINA
*/
async function consultarRol() {
  let rol = '';
  let jwt = sessionStorage.getItem('jwt');
  if(jwt == null) {
    window.location.href = `${urlLogin}`;
  } else {
    try {
      const response = await fetch(`${urlApi}usuarios.php?lista=permisos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'webToken': sessionStorage.getItem('jwt'),
        },
      });
      const data = await response.json();
      if (data) {
        rol = data;
      }
    } catch (error) {
      console.error("Error al sacar el rol:", error);
    }
  }
  return rol;
}

async function checkRol() {
  let rol = await consultarRol();
  // console.log("ROL USARIO", rol);
  return rol;
}