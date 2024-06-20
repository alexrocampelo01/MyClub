let butLog = document.querySelector('#butLog');
butLog.addEventListener('click', validarFormLorgin);

let butVerPass = document.querySelector('#verPass');
butVerPass.addEventListener('click', mostrarContrasena);

function validarFormLorgin(){   
    let invalidsInputs =[];
    console.log("validarFormLorgin");
    let inputNom = document.querySelector('#nom_log');
    let inputPass = document.querySelector('#pass_log');
    //validadcion del nombre de usario
    if(inputNom.value != ""){
        inputNom.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != inputNom); 
    }else{
        inputNom.classList.add('campoInvalido');
        invalidsInputs.push(inputNom);
        document.querySelector('#errores').innerHTML=`rellene los campos`;
    }
    //valudacion de la contraseña
    if(inputPass.value != ""){
        inputPass.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != inputPass); 
    }else{
        inputPass.classList.add('campoInvalido');
        invalidsInputs.push(inputPass);
        document.querySelector('#errores').innerHTML=`rellene los campos`;
    }
    if(invalidsInputs.length == 0){
        recojerFormularioLog();
    }else{
        let stringError = "";
        invalidsInputs.forEach(input => {
            input.classList.add('campoInvalido');
            stringError += input.name + " , ";
        })
        document.querySelector('#errores').innerHTML=`Campo incorrecto ${stringError}`;
    }
}
function recojerFormularioLog(){
    console.log("login");
    let datosU = {};
    datosU.tipeform = "login";
    datosU.nom_usu = document.querySelector('#nom_log').value;   
    datosU.pass_usu = document.querySelector('#pass_log').value;
    lanzarLogin(datosU);
}
async function lanzarLogin(dataForm){ //funciona 
    fetch(`${urlLocal}usuarios.php`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(dataForm),
    })
    .then(response => {
            switch(response.status){
                case 200:
                    return response.json();
                case 201:
                    document.querySelector('#errores').innerHTML=`Registro con exito`;
                    alert("Registro con exito");
                    return response.json();
                case 404:
                    document.querySelector('#errores').innerHTML=`usaario o contaseñas incorrectos`;
                    break;
                case 406:
                    document.querySelector('#errores').innerHTML=`usaario o contaseñas incorrectos`;
                    break;
                default:
                    document.querySelector('#errores').innerHTML=`error intentelo mas tarde`;
                    console.log("defecto");
                    break;
            }
        return response.json();
    })
    .then(data => {
        // console.log(data);
        let jwt = data.replace(/["']/g, '');
        sessionStorage.setItem('jwt', jwt);
        document.querySelector('#errores').innerHTML=' logeado con exito';
        //configuaraciones por haber logeado
        window.location.href = "http://localhost/Myclub/Codigo/html/CalendarioEjemplo.html";
        document.querySelector('#errores').innerHTML=' logeado con exito';
        return data;
    })
}
function mostrarContrasena() {
    console.log("mostrarContrasena");
    let inputContrasena = document.getElementById('pass_log');
    if (inputContrasena.type === "password") {
        inputContrasena.type = "text";
    } else {
        inputContrasena.type = "password";
    }
}