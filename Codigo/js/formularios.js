let urlLocal = 'http://localhost/Myclub/Codigo/php/'
let webToken = "";
// cargaDinamicaForms();
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
    let invalidsInputs =[];
    let datosU = {}
    datosU.tipeform = "usuario";
    let tipo_user = document.querySelector('#tipo_user');
    if(tipo_user.value == ""){
        tipo_user.classList.add('campoInvalido');
        invalidsInputs.push(tipo_user);
    }else{
        datosU.tipo_user = tipo_user.value;
        tipo_user.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != tipo_user); 
    }
    let nom_usu = document.querySelector('#nom_usu');
    if(nom_usu.value == ""){
        nom_usu.classList.add('campoInvalido');
        invalidsInputs.push(nom_usu);
    }else{
        datosU.nom_usu = nom_usu.value;
        nom_usu.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != nom_usu); 
    }

    let pass_usu = document.querySelector('#pass');
    if(pass_usu.value == ""){
        pass_usu.classList.add('campoInvalido');
        invalidsInputs.push(pass_usu);
    }else{
        datosU.pass_usu = pass_usu.value;
        pass_usu.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != pass_usu); 
    }
    let nom = document.querySelector('#nom');
    if(nom.value == ""){
        nom.classList.add('campoInvalido');
        invalidsInputs.push(nom);
    }else{
        datosU.nom = nom.value;
        nom.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != nom); 
    }

    let apel1 = document.querySelector('#apel1');
    if(apel1.value == ""){
        apel1.classList.add('campoInvalido');
        invalidsInputs.push(apel1);
    }else{
        datosU.apel1 = apel1.value;
        apel1.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != apel1); 
    }
    let apel2 = document.querySelector('#apel2');
    if(apel2.value == ""){
        apel2.classList.add('campoInvalido');
        invalidsInputs.push(apel2);
    }else{
        datosU.apel2 = apel2.value;
        apel2.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != apel2);
    }

    let tlf = document.querySelector('#tlf');
    if(typeof(tlf.value) != "number" && tlf.value == "" && tlf.value.length <= 9){

        tlf.classList.add('campoInvalido');
        invalidsInputs.push(tlf);
    }else{
        console.log("tlf",tlf.value);
        datosU.tlf = tlf.value;
        tlf.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != tlf);
    }
    let correo = document.querySelector('#correo');
    if(correo.value == ""){
        correo.classList.add('campoInvalido');
        invalidsInputs.push(correo);
    }else{
        datosU.correo = correo.value;
        correo.classList.remove('campoInvalido');
        invalidsInputs.filter(input => input != correo);
    }
    // comprueba si hay campos incorrectos
    let datosRol =await recojerFormularioRol(tipo_user.value);
    datosU.rol ={... datosRol};
    console.log("datosRol",datosRol);
    if(invalidsInputs.length == 0){
        lanzarForm(datosU);
    }
}
async function lanzarForm(dataForm){ // arreglar
    console.log("datosUsusario",dataForm)
    console.log("webToken", sessionStorage.getItem('jwt'));
    console.log("lanzar form", dataForm.tipeform);
    await fetch(`${urlLocal}usuarios.php`, {
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
async function recojerFormularioRol(rol){ // arreglar
    let invalidsInputs =[];
    console.log("recojerFormularioRol");
    let datosAdicionales = {};
    datosAdicionales.tipeRol = rol;
    switch(rol){
        case 'director':
            let club = document.querySelector(' #club');
            if(club.value == ""){
                club.classList.add('campoInvalido');
                invalidsInputs.push(club);
            }else{
                datosAdicionales.club = club.value;
                club.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != club);
            }
            let fecha_elec = document.querySelector('#fecha_elec');
            if(fecha_elec.value == ""){
                fecha_elec.classList.add('campoInvalido');
                invalidsInputs.push(fecha_elec);
            }else{
                datosAdicionales.fecha_elec = fecha_elec.value;
                fecha_elec.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != fecha_elec);
            }
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
    // console.log("datos adicionales",datosAdicionales);

    return datosAdicionales;

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
function mostrarContrasena() {
    let inputContrasena = document.getElementById('pass_log');
    if (inputContrasena.type === "password") {
        inputContrasena.type = "text";
    } else {
        inputContrasena.type = "password";
    }
}

// validar();
// function validar(){
//     let feo = document.querySelector('#formulario');
//     console.log(feo.childNodes);
//     inputs = feo.querySelectorAll('input');
//     console.log(inputs);
//     inputs.forEach(input => {
//         console.log(input);
//         input.addEventListener('blur', function(){
//             console.log(input);
//             if(input.value == ""){
//                 input.classList.add('campoInvalido');
//             }else{
//                 input.classList.remove('campoInvalido');
//             }
//         });
//     });
// }

