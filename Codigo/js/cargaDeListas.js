let divEtiquetas = document.querySelector('#etiquetas');
divEtiquetas.addEventListener('click',cargarLista);

function cargarLista(e){
    if(e.target){
        // console.log("etiquetas",e.target.id);
        let rutaFiltro = '';
        let rutaTabla = '';
        switch(e.target.id){
            case 'directores':
                console.log("directores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroDirectores.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaDirectores.html';
                getDirectores();
                break;
            case 'usuarios':
                console.log("usuarios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroUsuario.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaUsuario.html';
                getUsuarios();
                break;
            case 'monitores':
                console.log("monitores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroMonitor.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaMonitores.html';
                getMonitores();
                break;
            case 'socios':
                console.log("socios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroSocios.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaSocios.html';
                getSocios();
                break;
            case 'familiares':
                console.log("familiares");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroFamiliar.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaFamiliares.html';
                getFamiliares();
                break;
        }
    let divfiltro = document.querySelector('#filtros');
    fetch(rutaFiltro).then(res => res.text()).then(html => divfiltro.innerHTML = html);

    let divTabla = document.querySelector('#divListas');
    fetch(rutaTabla).then(res => res.text()).then(html => {
        divTabla.innerHTML = html
        document.addEventListener('DOMContentLoaded', (event) => {
            // Aquí va tu función
            miFuncion();

            // Aquí va el código que quieres ejecutar después de que la página haya cargado
            console.log('La página ha cargado completamente');
        });
    });
    }
};
function getUsuarios(){
    // fetch(`${urlLocal}usuarios.php?lista=usuarios`, {
    fetch(`${urlServidor}usuarios.php?lista=usuarios`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        // console.log(data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(usuario => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nom_usu}</td>
                <td>${usuario.apel1} ${usuario.apel2}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.tlf}</td>
                <td>${usuario.tipo_user}</td>
                <td>
                    <button class="btn btn-primary">Editar</button>
                    <button class="btn btn-danger">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getDirectores(){
    // fetch(`${urlLocal}usuarios.php?lista=directores`, {
    fetch(`${urlServidor}usuarios.php?lista=directores`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        // console.log(data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(director => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${director.nom_usu}</td>
                <td>${director.apel1} ${director.apel2}</td>
                <td>${director.club}</td>
                <td>${director.fecha_eleccion}</td>
                <td>
                    <button class="botonModificar" rol="directores" id_r="${director.id}">Editar</button>
                    <button class="botonEliminar" rol="directores" id_r="${director.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getMonitores(){
    // fetch(`${urlLocal}usuarios.php?lista=monitores`, {
    fetch(`${urlServidor}usuarios.php?lista=monitores`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log(data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(monitores => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${monitores.nom_usu}</td>
                <td>${monitores.apel1} ${monitores.apel2}</td>
                <td>${monitores.curso}</td>
                <td>${monitores.carne_c != 0 ? "Si":"No"}</td>
                <td>${monitores.titulo_m != 0 ? "Si":"No"}</td>
                <td class="acciones">
                    <button onclick="modificar('monitores', ${monitores.id_m})" class="botonModificar" >Editar</button>
                    <button class="botonEliminar" rol="monitores" id_r="${monitores.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getSocios(){
    // fetch(`${urlLocal}usuarios.php?lista=socios`, {
    fetch(`${urlServidor}usuarios.php?lista=socios`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        // console.log(data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(socio => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${socio.nom_usu}</td>
                <td>${socio.apel1} ${socio.apel2}</td>
                <td>${socio.curso}</td>
                <td>${socio.colegio}</td>
                <!-- <td>${socio.edad}</td> -->
                <td>${socio.observaciones}</td>
                <!-- <td>${socio.familiares}</td> -->
                <td>
                    <button class="botonModificar" rol="socios" id_r="${socio.id}">Editar</button>
                    <button class="botonEliminar" rol="socios" id_r="${socio.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getFamiliares(){
    // fetch(`${urlLocal}usuarios.php?lista=familiares`, {
    fetch(`${urlServidor}usuarios.php?lista=familiares`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        // console.log(data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(familiar => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${familiar.nom_usu}</td>
                <td>${familiar.apel1} ${familiar.apel2}</td>
                <td>${familiar.localidad}</td>
                <td>${familiar.direccion}</td>
                <td>${familiar.cp}</td>
                <td>${familiar.parentesco}</td>
                <!-- <td>${familiar.socio}</td> -->
                <td>
                    <button class="botonModificar" rol="familiar" id_r="${familiar.id}">Editar</button>
                    <button class="botonEliminar" rol="familiar" id_r="${familiar.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}
//funciona
// function pruebas(e){
// let divAcciones = document.querySelector('.acciones');
// console.log("divacciones",divAcciones);
// divAcciones.addEventListener('click',modificar)
// }

// function modificar(e){
//     console.log("modificar", e.target);
//     alert("Hola"+ e.target);
// }
function pruebas(e){
let divAcciones = document.querySelector('.acciones');
console.log("divacciones",divAcciones);
divAcciones.addEventListener('click',modificar)
}

async function modificar(rol, id){
    console.log("modificar",rol, id);
    await recogerDatos(rol, id);
}
async function recogerDatos(rol, id){
    let datos = {};
    console.log("rol", rol);
    console.log("id", id);
    // console.log(`${urlLocal}usuarios.php?lista=${rol}&id=${id}`);
    console.log(`${urlServidor}usuarios.php?lista=${rol}&id=${id}`);

    // fetch(`${urlLocal}usuarios.php?lista=${rol}&id=${id}`, {
    fetch(`${urlServidor}usuarios.php?lista=${rol}&id=${id}`, {
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
       abrirModal();
       modificarUsuario(data);
    });

}
