let urlLocal = 'http://localhost/Myclub/Codigo/php/'
let webToken = "";
// cargaDinamicaForms();

let butUser = document.querySelector('#butUser');
butUser.addEventListener('click', crearUsuario); 
console.log("hola");
document.addEventListener('DOMContentLoaded', function() {
    var tipoUser = document.getElementById('tipo_user');

    tipoUser.addEventListener('change', function() {
        // Aquí va el código que se ejecutará cuando cambie el valor del selector
        console.log('El valor del selector ha cambiado a: ' + this.value);
        loadForm(this.value)
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
            console.log("monitor");
            rutaFomr = "../html/Componentes/Formularios/formulariosMonitor.html";
            break;
        case 'socio':
            rutaFomr = "../html/Componentes/Formularios/formulariosSocios.html";
            break;
        case 'familiar':
            rutaFomr = "../html/Componentes/Formularios/formulariosFamiliar.html";
            break;
        default:    
            // rutaFomr = "../html/Componentes/Formularios/formularioUsuarios.html";
            console.log("no hay formulario");
            break;
    }
    console.log("sacando form correcto"  +  rutaFomr);
    let divForm = document.querySelector('#formTipo');
    fetch(rutaFomr)
    .then(response => response.text())
    .then((html) => {
        divForm.innerHTML= html; 
    });
}

let textoDebug = document.querySelector('#errores');
textoDebug.textContent= "hola angel";


console.log("hola funciono");
function crearUsuario(){
    console.log("creando user");
    //guardamos el tipo de usario a lo largo del forulario de creacion 
    let datosUsuario;
    datosUsuario = recojerFormularioUsuario();
    //console.log(datosUsuario);
//    lanzarForm(datosUsuario);
}
function login(){
    localStorage.setItem('tipoUser',tipo_user.value);
    let datosUsuario = recojerFormularioLog();
    lanzarLogin(datosUsuario);
}

function recojerFormularioUsuario(){
    // if(validarForm()){
        let datosU = {}
        datosU.tipeRol = "usuarios";
        datosU.tipo_user = document.querySelector('#tipo_user').value;
        datosU.nom_usu = document.querySelector('#nom_usu').value;
        datosU.pass = document.querySelector('#pass').value;
        datosU.nom = document.querySelector('#nom').value;
        datosU.apel1 = document.querySelector('#apel1').value;
        datosU.apel2 = document.querySelector('#apel2').value;
        datosU.tlf = document.querySelector('#tlf').value;
        datosU.email = document.querySelector('#correo').value;
        let datosAdicionales = {};
        switch(datosU.tipo_user){
            case 'director':
                datosAdicionales.club = document.querySelector('#club').value;
                datosAdicionales.fecha_elec = document.querySelector('#fecha_elec').value;
                break;
            case 'monitor':
                datosAdicionales.curso_m = document.querySelector('#curso_m').value;
                datosAdicionales.carne_conducir = document.querySelector('#carne_conducir').value;
                datosAdicionales.titulo_monitor = document.querySelector('#titulo_monitor').value;
                break;
            case 'socios':
                datosAdicionales.curso = document.querySelector('#curso').value;
                datosAdicionales.colegio = document.querySelector('#colegio').value;
                datosAdicionales.fechNac = document.querySelector('#fechNac').value;
                datosAdicionales.fecha_inscrip = document.querySelector('#fecha_inscrip').value;
                datosAdicionales.observaciones = document.querySelector('#observaciones').value;
                break;
            case 'familiar':
                datosAdicionales.dir = document.querySelector('#dir').value;
                datosAdicionales.loc = document.querySelector('#loc').value;
                datosAdicionales.cp = document.querySelector('#cp').value;
                datosAdicionales.parentesco = document.querySelector('#parentesco').value;
                break;
            default:
                console.log("no hay datos adicionales");
                break;
        }
        console.log(datosU);
        console.log(datosAdicionales);
        //lanzarForm(datosU);

        // return datosU;
    // }else {
    //     console.log("datos incorrectos");
    //     return false;
    // }
}
function recojerFormularioLog(){
    let datosU = {};
    datosU.tipeRol = "login";
    datosU.nom_usu = document.querySelector('#nomUsu_log').value;
    datosU.pass_usu = document.querySelector('#nomUsu_log').value;
    console.log(datosU);
    return datosU;
}

function recogerFormDirector(){

    textoDebug.textContent = "hola soy el formulario del director";
    
    let datosDir = {};
    datosDir.tipeRol = "director"

    datosDir.club = document.querySelector('#club').value;
    datosDir.fecha_elec = document.querySelector('#fecha_elec').value;
    console.log(datosDir);
    return datosDir
    
}
function recogerFormSocio(){
    textoDebug.textContent = "hola soy el formulario del Socio";
    // console.log(e.target);
    let datosS = {};
    datosS.tipeRol = "socios";
    datosS.nom_s = document.querySelector('#nom_s').value;
    datosS.apel1_s = document.querySelector('#apel1_s').value;
    datosS.apel2_s = document.querySelector('#apel2_s').value;
    datosS.curso_s = document.querySelector('#curso_s').value;
    datosS.fechNac = document.querySelector('#fechNac').value;
    datosS.dir = document.querySelector('#dir').value;
    datosS.poblacion = document.querySelector('#poblacion').value;
    datosS.cp = document.querySelector('#cp').value;
    datosS.tlf_s = document.querySelector('#tlf_s').value;
    datosS.colegio = document.querySelector('#colegio').value;
    datosS.fecha_inscrip = document.querySelector('#fecha_inscrip').value;
    datosS.observaciones = document.querySelector('#observaciones').value;
    // console.log(datosS);
    return datosS;
}

function recogerFormPadre(){
    let datosP = {};
    datosP.tipeRol = "padres";
    datosP.nom_usu = document.querySelector('#nomUsu_p').value;
    datosP.pass_usu = document.querySelector('#passUsu_p').value;
    datosP.nom_p = document.querySelector('#nom_p').value;
    datosP.apel1_p = document.querySelector('#apel1_p').value;
    datosP.apel2_p = document.querySelector('#apel2_p').value;
    datosP.tlf_p = document.querySelector('#tlf_p').value;
    // console.log(datosP);
    return datosP;
}

function recogerFormMadre(){
    let datosM = {};
    datosM.tipeRol = "padres";
    datosM.nom_usu = document.querySelector('#nomUsu_ma').value;
    datosM.pass_usu = document.querySelector('#passUsu_ma').value;
    datosM.nom_p = document.querySelector('#nom_ma').value;
    datosM.apel1_p = document.querySelector('#apel1_ma').value;
    datosM.apel2_s = document.querySelector('#apel2_ma').value;
    datosM.tlf_p = document.querySelector('#tlf_ma').value;
    // console.log(datosM);
    return datosM;
}

function recogerFormMonitor(){
    textoDebug.textContent = "hola soy el formulario del Monitor";
    // console.log(e.target);
    let datosMoni = {};
    datosMoni.tipeRol = "monitor"
    datosMoni.nom_m = document.querySelector('#nom_m').value;
    datosMoni.apel1_m = document.querySelector('#apel1_m').value;
    datosMoni.apel2_m = document.querySelector('#apel2_m').value;
    datosMoni.tlf_m = document.querySelector('#tlf_m').value;
    datosMoni.curso_m = document.querySelector('#curso_m').value;
    datosMoni.carne_conducir = document.querySelector('#carne_conducir').value;
    datosMoni.titulo_monitor = document.querySelector('#titulo_moni tor').value;
    // lanzarForm(datosMoni);
    return datosMoni;
}


async function lanzarLogin(dataForm){ //funciona 
    console.log(dataForm);
    fetch(`${urlLocal}usuarios.php`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(dataForm),
    })
    .then(response => {
        // console.log(response.status);
            switch(response.status){
                case 200:
                    // document.querySelector('#errores').innerHTML=`creado con exito`;
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
        console.log(data);
        let jwt = data.replace(/["']/g, '');
        localStorage.setItem('jwt', jwt);
        //console.log(localStorage.getItem('jwt'));
        return data;
    })
}

async function lanzarForm(dataForm){ // arreglar
    console.log(dataForm);
    // console.log("webtoken debug"+localStorage.getItem('jwt'));

    fetch(`${urlLocal}usuarios.php`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : localStorage.getItem('jwt')
        },
        body: JSON.stringify(dataForm),
    })
    .then(response => {
        //console.log(response.status);
            switch(response.status){
                case 200:
                    return response.json();
                case 201:
                    document.querySelector('#errores').innerHTML=`usuario creado con exito`;
                    return response.json();
                case 404:
                    document.querySelector('#errores').innerHTML=`Sql excepcion`;
                    break;
                case 406:
                    console.log("usario ya usado");
                    document.querySelector('#errores').innerHTML=`usuario repetido`;
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
        return response.text();
    })
    .then(data => {
        let idUsu = data;
        console.log("id usuario "+ data);
        localStorage.setItem('idUsuario', data);
        console.log("tipo de usario "+dataForm.tipo_user);
        cargaDinamicaForms(dataForm.tipo_user);
    })
}
// function cargaDinamicaForms(tipo_user = ''){
//     console.log("sacando form correcto"  +  tipo_user);
//     switch(tipo_user){
//         case 'director':
//             rutaFomr = "../html/Componentes/Formularios/formulariosDirector.html";
//             break;
//         case 'monitor':
//             rutaFomr = "../html/Componentes/Formularios/formulariosMonitor.html";
//             break;
//         case 'socios':
//             rutaFomr = "../html/Componentes/Formularios/formulariosSocios.html";
//             break;
//         default:
//             rutaFomr = "../html/Componentes/Formularios/formularioUsuarios.html";
//             break;

//     }
//     let divForm = document.querySelector('#zonaForm');
//     fetch(rutaFomr)
//     .then(response => response.text())
//     .then((html) => {
//         //console.log("contenido form ="+ document.querySelector('#zonaForm').innerHTML);
//         divForm.innerHTML= html; 
//         switch(tipo_user){
//             case 'director':
//                 let butDir = document.querySelector('#butDir');
//                 butDir.addEventListener('click', recogerFormDirector);
//                 break;
//             case 'monitor':
//                 let butMonitor = document.querySelector('#butMonitor');
//                 butMonitor.addEventListener('click', recogerFormMonitor);
//                 break;
//             case 'socios':
//                 let butSocio = document.querySelector('#butSocio');
//                 butSocio.addEventListener('click', recogerFormSocio);
//                 break;
//             default:
//                 let butUser = document.querySelector('#butUser');
//                 butUser.addEventListener('click', crearUsuario);
//                 break;
    
//         }
//     })
// }



// function validarFormUsurio(){
//     //creamos el validador de que el contenido es una cadena 
//     let condicionNom = /^[A-Za-z]+$^/;
//     let condicionPass = /^[A-Za-z]+$^/;
//     if(document.querySelector('#nomUsu_p').value.trim() === ''){
//         textoDebug.textContent = "nombre no puede estar vacio";
//         return false;
//     }
//     if(!document.querySelector('#nomUsu_p').value.test(condicionSoloTexto)){
//         textoDebug.textContent = "Nombre no cumple las condiciones";
//         return false;
//     }
//     if(document.querySelector('#passUsu_p').value.trim() === ''){
//         textoDebug.textContent = "Contraseña vacia";
//         return false;
//     }
//     if(!document.querySelector('#passUsu_p').value.test(condicionSoloTexto)){
//         textoDebug.textContent = "Contraseña no cumple las condiciones";
//         return false;
//     }
//     return true;
// }
