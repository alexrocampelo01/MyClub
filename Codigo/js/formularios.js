let urlLocal = 'http://localhost/Myclub/Codigo/php/'
let webToken = "";
// cargaDinamicaForms();
let butLog = document.querySelector('#butLog');
butLog.addEventListener('click', recojerFormularioLog);

let butUser = document.querySelector('#butUser');
butUser.addEventListener('click', recojerFormularioUsuario); 

document.addEventListener('DOMContentLoaded', function() {
    var tipoUser = document.getElementById('tipo_user');

    tipoUser.addEventListener('change', function() {
        // Aquí va el código que se ejecutará cuando cambie el valor del selector
        console.log('El valor del selector ha cambiado a: ' + this.value);
        loadForm(this.value);
    });

    // Aquí va el código que se ejecutará cuando se cargue la página
    console.log('La página ha cargado y el valor inicial del selector es: ' + tipoUser.value);
    loadForm(tipoUser.value);
});
function loadForm(tipoUser = ''){
    let rutaFomr = "";
    switch(tipoUser){
        case 'director':
            rutaFomr = "../html/Componentes/Formularios/formulariosDirector.html";
            break;  
        case 'monitor':
            rutaFomr = "../html/Componentes/Formularios/formulariosMonitor.html";
            break;
        case 'socio':
            rutaFomr = "../html/Componentes/Formularios/formulariosSocios.html";
            break;
        case 'familiar':
            rutaFomr = "../html/Componentes/Formularios/formulariosFamiliar.html";
            break;
        default:    
            console.log("no hay formulario");
            break;
    }
    console.log("sacando form correcto"  +  rutaFomr);
    let divForm = document.querySelector('#formTipo');
    fetch(rutaFomr)
    .then(response => response.text())
    .then((html) => {
        divForm.innerHTML= html; 
        if(tipoUser == 'monitor'){
            listaNombresDirectore();
        }else if(tipoUser == 'familiar'){
            console.log("familiar");
            listaNombresUsuario();
        }
    });
}

let textoDebug = document.querySelector('#errores');
textoDebug.textContent= "hola angel";


async function recojerFormularioUsuario(){
        let datosU = {}
        datosU.tipeRol = "usuario";
        datosU.tipo_user = document.querySelector('#tipo_user').value;
        datosU.nom_usu = document.querySelector('#nom_usu').value;
        datosU.pass_usu = document.querySelector('#pass').value;
        datosU.nom = document.querySelector('#nom').value;
        datosU.apel1 = document.querySelector('#apel1').value;
        datosU.apel2 = document.querySelector('#apel2').value;
        datosU.tlf = document.querySelector('#tlf').value;
        datosU.correo = document.querySelector('#correo').value;
        lanzarForm(datosU);
}
async function lanzarForm(dataForm){ // arreglar
    console.log("webToken", sessionStorage.getItem('jwt'));
    console.log("lanzar form", dataForm.tipeRol);
    fetch(`${urlLocal}usuarios.php`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt')
        },
        body: JSON.stringify(dataForm),
    })
    .then(response => {
        console.log(response.status);
            switch(response.status){
                case 200:
                    return response.text();
                case 201:
                    document.querySelector('#errores').innerHTML=`usuario creado con exito`;
                    return response.text();
                case 404:
                    document.querySelector('#errores').innerHTML=`Sql excepcion`;
                    break;
                case 406:
                    console.log("usario ya usado");
                    document.querySelector('#errores').innerHTML=`usuario o contaseñas incorrectos`;
                    break;
                case 401:
                    console.log("no tienes permiso");
                    document.querySelector('#errores').innerHTML=`no tienes permiso`;
                    break;
                default:
                    document.querySelector('#errores').innerHTML=`error intentelo mas tarde`;
                    console.log("defecto");
                    break;
            }
    })
    .then(data => {
        console.log("THEN lanzarform",data);
        if(data != undefined){
            if(dataForm.tipeRol == "usuario"){
                idU =data;
                console.log("usuario creado con exito");
                recojerFormularioRol(idU, dataForm.tipo_user);
            }else{
                console.log("crado otro tipo de usuario", dataForm.tipeRol);
            }
        }else{
            console.log("no hay datos");
        }
    }).catch(error => {
        console.log("error",error);
    });
}
async function recojerFormularioRol(id,rol){ // arreglar
    console.log("recojerFormularioRol");
    let datosAdicionales = {};
    datosAdicionales.tipeRol = rol;
    datosAdicionales.id_u = id;
    switch(rol){
        case 'director':
            datosAdicionales.club = document.querySelector('#club').value;
            datosAdicionales.fecha_elec = document.querySelector('#fecha_elec').value;
            break;
        case 'monitor':
            datosAdicionales.id_d = document.querySelector('#director').value;
            datosAdicionales.curso_m = document.querySelector('#curso_m').value;
            datosAdicionales.carne_conducir = document.querySelector('#carne_conducir').value;
            datosAdicionales.titulo_monitor = document.querySelector('#titulo_monitor').value;
            break;
        case 'socio':
            datosAdicionales.curso = document.querySelector('#curso').value;
            datosAdicionales.colegio = document.querySelector('#colegio').value;
            datosAdicionales.fechNac = document.querySelector('#fechNac').value;
            datosAdicionales.fecha_inscrip = document.querySelector('#fecha_inscrip').value;
            datosAdicionales.observaciones = document.querySelector('#observaciones').value;
            break;
        case 'familiar':
            datosAdicionales.id_s = document.querySelector('#socio').value;
            datosAdicionales.dir = document.querySelector('#dir').value;
            datosAdicionales.loc = document.querySelector('#loc').value;
            datosAdicionales.cp = document.querySelector('#cp').value;
            datosAdicionales.parentesco = document.querySelector('#parentesco').value;
            break;
        default:
            console.log("no hay datos adicionales");
            break;
    }
    console.log("datos adicionales",datosAdicionales);
    console.log("webToken", sessionStorage.getItem('jwt'));
    lanzarForm(datosAdicionales)

}
function listaNombresDirectore(){
    let selectorDirectores = document.querySelector('#director');
    console.log("selectorDirectores",selectorDirectores);
    fetch(`${urlLocal}usuarios.php?lista=directores&nombre`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt')
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log(data);
        console.log
        data.forEach(element => {
            let option = document.createElement('option');
            option.text = element.nom + element.apel1;
            option.value = element.id;
            selectorDirectores.appendChild(option);
        });
    });
}
function listaNombresUsuario(){
    let selecSocio = document.querySelector('#socio');
    console.log("selecSocio",selecSocio);
    fetch(`${urlLocal}usuarios.php?lista=socios&nombres`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        console.log(response);
        return response.json();
    }).then(data => {     
        console.log(data);
        data.forEach(element => {
            let option = document.createElement('option');
            option.text = element.nom + element.apel1;
            option.value = element.id;
            selecSocio.appendChild(option);
        });
    });
}
function recojerFormularioLog(){
    console.log("login");
    let datosU = {};
    datosU.tipeRol = "login";
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
                    document.querySelector('#errores').innerHTML=`creado con exito`;
                    return response.json();
                case 404:
                    document.querySelector('#errores').innerHTML=`Ese nombre de usario ya existe`;
                    break;
                case 406:
                    document.querySelector('#errores').innerHTML=`algo incorrecto`;
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
        return data;
    })
}
