let urlLogin = 'http://localhost/Myclub/Codigo/html/login.html'
let urlCalendario = 'http://localhost/Myclub/Codigo/html/calendario.html'

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
  console.log("ROL USARIO", rol);
  return rol;
}
checkRol();

