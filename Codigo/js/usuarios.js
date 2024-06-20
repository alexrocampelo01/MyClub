
let butCrearUser = document.querySelector('#butCrearUser');
butCrearUser.addEventListener('click', recojerFormularioUsuario); 
let butModificarUser = document.querySelector('#butModificarUser');
butModificarUser.addEventListener('click', recojerFormularioUsuarioModificar); // cambiar a modificarUsuario 


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
            listaNombresSocios();
        }
    });
}
function recojerFormularioUsuarioModificar(){
    recojerFormularioUsuario("modificar");
}

let invalidsInputs =[];
async function recojerFormularioUsuario(mode){
    invalidsInputs =[];
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
    let datosRol = await recojerFormularioRol(tipo_user.value);
    datosU.rol ={...datosRol};
    console.log("datosRol",datosRol);
    console.log("Formulario recojido",datosU);
    console.log("errores formulario",invalidsInputs);
    //buscamos los elemetos ocultos y los quitamos
    let campos ocultos = invalidsInputs.filter(input => input.classList.contains('esconderNone'))
    if(invalidsInputs.length == 0){
        if(mode == "modificar"){
            // datosU.id = idU;
            console.log("modificar usuario",datosU);
        }else{
            console.log("crear usuario",datosU);
            lanzarForm(datosU);
        }
    }else{
        let stringError = "";
        invalidsInputs.forEach(input => {
            input.classList.add('campoInvalido');
            stringError += input.name + " , ";
        })
        document.querySelector('#errores').innerHTML=`Campo incorrecto ${stringError}`;
    }
}

async function recojerFormularioRol(rol){ // arreglar
    console.log("recojerFormularioRol");
    let datosAdicionales = {};
    datosAdicionales.tipeRol = rol;
    switch(rol){
        case 'director':
            let club = document.querySelector('#club');
            if(club.value == ""){
                club.classList.add('campoInvalido');
                invalidsInputs.push(club);
            }else{
                datosAdicionales.club = club.value;
                club.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != club);
            }
            let fecha_elec = document.querySelector('#fecha_elec');
            if(isFechaValida(fecha_elec.value) || fecha_elec.value == ""){
                fecha_elec.classList.add('campoInvalido');
                invalidsInputs.push(fecha_elec);
            }else{
                datosAdicionales.fecha_elec = fecha_elec.value;
                fecha_elec.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != fecha_elec);
            }
            console.log("fecha", fecha_elec.value);
            break;
        case 'monitor':
            datosAdicionales.id_d = document.querySelector('#director').value;
            datosAdicionales.curso_m = document.querySelector('#curso_m').value;
            datosAdicionales.carne_conducir = document.querySelector('#carne_conducir').value;
            datosAdicionales.titulo_monitor = document.querySelector('#titulo_monitor').value;
            break;
        case 'socio':
            datosAdicionales.curso_s = document.querySelector('#curso').value;

            let colegio = document.querySelector('#colegio');
            if(colegio.value == ""){
                colegio.classList.add('campoInvalido');
                invalidsInputs.push(colegio);
            }else{
                datosAdicionales.colegio = colegio.value;
                colegio.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != colegio);
            }
            let fechNac = document.querySelector('#fechNac');
            if(isFechaValida(fechNac.value) || fechNac.value == ""){
                fechNac.classList.add('campoInvalido');
                invalidsInputs.push(fechNac);
            }else{
                datosAdicionales.fechNac = fechNac.value;
                fechNac.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != fechNac);
            }
            let fecha_inscrip = document.querySelector('#fecha_inscrip');
            if(isFechaValida(fecha_inscrip.value) || fecha_inscrip.value == ""){
                fecha_inscrip.classList.add('campoInvalido');
                invalidsInputs.push(fecha_inscrip);
            }else{
                datosAdicionales.fecha_inscrip = fecha_inscrip.value;
                fecha_inscrip.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != fecha_inscrip);
            }
            let observaciones = document.querySelector('#observaciones');
            if(observaciones.value == ""){
                observaciones.classList.add('campoInvalido');
                invalidsInputs.push(observaciones);
            }else{ 
                datosAdicionales.observaciones = observaciones.value;
                observaciones.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != observaciones);
            }
            break;
        case 'familiar':
            datosAdicionales.id_s = document.querySelector('#socio').value;
            let direccion = document.querySelector('#dir');
            if(direccion.value == ""){
                direccion.classList.add('campoInvalido');
                invalidsInputs.push(direccion);
            }else{
                datosAdicionales.dir = direccion.value;
                direccion.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != direccion);
            }
            let loc = document.querySelector('#loc');
            if(loc.value == ""){
                loc.classList.add('campoInvalido');
                invalidsInputs.push(loc);
            }else{
                datosAdicionales.loc = loc.value;
                loc.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != loc);
            }
            let cp = document.querySelector('#cp');
            console.log("cp",cp);
            console.log("cp valor",cp.value);
            if(typeof(cp.value) != "number" && cp.value == "" && cp.value.length <= 5){
                cp.classList.add('campoInvalido');
                invalidsInputs.push(cp);
            }else{
                datosAdicionales.cp = cp.value;
                cp.classList.remove('campoInvalido');
                invalidsInputs.filter(input => input != cp);
            }
            datosAdicionales.parentesco = document.querySelector('#parentesco').value;
            break;
        default:
            console.log("no hay datos adicionales");
            break;
    }
    // console.log("datos adicionales",datosAdicionales);

    return datosAdicionales;

}

async function lanzarForm(dataForm){ // arreglar
    console.log("datosUsusario",dataForm)
    // console.log("webToken", sessionStorage.getItem('jwt'));
    console.log("lanzar form", dataForm.tipeform);
    // await fetch(`${urlLocal}usuarios.php`, {
    await fetch(`${urlServidor}usuarios.php`, {
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
                location.reload(true);
            }else{
                console.log("crado otro tipo de usuario", dataForm.tipeRol);
            }
        }else{
            console.log("no hay datos");
        }
    })
}


/*
*MODIFICAR USUARIOS
*/
function modificarUsuario(data){
    let infoUsuario = data[0];
    console.log("data MODIFICAR",infoUsuario);
    console.log("CARGO EL FORMULARIO", infoUsuario.tipo_user);
    //Configuramos el formulario
    document.querySelector('#tipo_user').value = infoUsuario.tipo_user;
    this.loadForm(infoUsuario.tipo_user);
    let label = document.querySelector("label[for='pass']").classList.add('esconderNone');
    document.querySelector('#pass').classList.add('esconderNone');
    butCrearUser.classList.add('esconderNone');
    butModificarUser.classList.remove('esconderNone');
    //Rellenamos el formulario
    document.querySelector('#nom_usu').value = infoUsuario.nom_usu;
    document.querySelector('#nom').value = infoUsuario.nom;
    document.querySelector('#apel1').value = infoUsuario.apel1;
    document.querySelector('#apel2').value = infoUsuario.apel2;
    document.querySelector('#tlf').value = infoUsuario.tlf;
    document.querySelector('#correo').value = infoUsuario.correo;
    //Rellenamos el formulario de rol
    // datosAdicionales.id_d = document.querySelector('#director').value;
    // datosAdicionales.curso_m = document.querySelector('#curso_m').value;
    // datosAdicionales.carne_conducir = document.querySelector('#carne_conducir').value;
    // datosAdicionales.titulo_monitor = document.querySelector('#titulo_monitor').value;
    console.log("director DEFAULT",document.querySelector('#director').value);
    console.log("director cargado",infoUsuario.id_d);
    let selectorDirectores = document.querySelector('#director')
    for (let i = 0; i < selectorDirectores.options.length; i++) {
        if (selectorDirectores.options[i].value === infoUsuario.id_d) {
            opcionEncontrada = true;
            selectorDirectores.options[i].selected = true;
            console.log("opcion encontrado", selectorDirectores.options[i]);
            console.log("opcion encontrada", infoUsuario.id_d);
            break;
        }
    }

    console.log("director DEFAULT",document.querySelector('#director').value);
    console.log("director cargado",infoUsuario.id_d);
    // let selectorDirectores = document.document.querySelector('#director')
    // for (let i = 0; i < select.options.length; i++) {
    //     if (select.options[i].value === infoUsuario.id_d) {
    //         opcionEncontrada = true;
    //         console.log("opcion encontrada", infoUsuario.id_d);
    //         break;
    //     }
    // }
    document.querySelector('#curso_m').value = infoUsuario.curso;
    
}

/*
*Funciones de apoyo
*/
function listaNombresDirectore(){
    let selectorDirectores = document.querySelector('#director');
    console.log("selectorDirectores",selectorDirectores);
    // fetch(`${urlLocal}usuarios.php?lista=directores&nombre`, {
    fetch(`${urlServidor}usuarios.php?lista=directores&nombre`, {
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
        data.forEach(element => {
            let option = document.createElement('option');
            option.text = element.nom+" "+element.apel1+" "+element.apel2;
            option.value = element.id;
            selectorDirectores.appendChild(option);
        });
    });
}

function listaNombresSocios(){
    let selecSocio = document.querySelector('#socio');
    console.log("selecSocio",selecSocio);
    // fetch(`${urlLocal}usuarios.php?lista=socios&nombres`, {
    fetch(`${urlServidor}usuarios.php?lista=socios&nombres`, {
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
            option.text = element.nom+" "+element.apel1+" "+element.apel2;
            option.value = element.id;
            selecSocio.appendChild(option);
        });
    });
}

function isFechaValida(d) {
    return d instanceof Date && !isNaN(d);
}

