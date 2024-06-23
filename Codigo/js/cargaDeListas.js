let divEtiquetas = document.querySelector('#etiquetas');
divEtiquetas.addEventListener('click',cambiarLista);

function cambiarLista(e){
    if(e.target){
        console.log("etiquetas",e.target.id);
        cargarLista(e.target.id)
    }
}
//preparamos la carga de las listas segun los permisos
cargaConPermisos();
async function cargaConPermisos(){
    let rol = await checkRol();
    console.log("cargaConPermisos ROL",rol);
    if(rol == 'monitor'){
        document.querySelector('#directores').classList.add('esconderNone');
        document.querySelector('#monitores').classList.add('esconderNone');
        document.querySelector('#crearUsuario').classList.add('esconderNone');
    }
}
cargarLista('socios');
function cargarLista(tipoLista){
    if(tipoLista){
        // console.log("etiquetas",e.target.id);
        let rutaFiltro = '';
        let rutaTabla = '';
        switch(tipoLista){
            case 'directores':
                // console.log("directores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroDirectores.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaDirectores.html';
                getDirectores();
                break;
            case 'usuarios':
                // console.log("usuarios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroUsuario.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaUsuario.html';
                getUsuarios();
                break;
            case 'monitores':
                // console.log("monitores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroMonitor.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaMonitores.html';
                getMonitores();
                break;
            case 'socios':
                // console.log("socios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroSocios.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaSocios.html';
                getSocios();
                break;
            case 'familiares':
                // console.log("familiares");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroFamiliar.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaFamiliares.html';
                getFamiliares();
                break;
        }
    // let divfiltro = document.querySelector('#filtros');
    // fetch(rutaFiltro).then(res => res.text()).then(html => divfiltro.innerHTML = html);

    let divTabla = document.querySelector('#divListas');
    fetch(rutaTabla).then(res => res.text()).then(html => {
        divTabla.innerHTML = html
        document.addEventListener('DOMContentLoaded', (event) => {
            // Aquí va tu función
            miFuncion();

            // Aquí va el código que quieres ejecutar después de que la página haya cargado
            console.log('La página ha cargado completamente');
        });
        let butCrearUsuario = document.createElement('button');
        butCrearUsuario.id = 'crearUsuario';
        butCrearUsuario.textContent = '+';
        divTabla.appendChild(butCrearUsuario);
    });
    }
};
function getUsuarios(){
    fetch(`${urlApi}usuarios.php?lista=usuarios`, {
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
                                  
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getDirectores(){
    fetch(`${urlApi}usuarios.php?lista=directores`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log("DIRECTORES",data);
        let tabla = document.querySelector('#tbodyTabla');
        data.forEach(director => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${director.nom_usu}</td>
                <td>${director.apel1} ${director.apel2}</td>
                <td>${director.club}</td>
                <td>${director.fechaEleccion}</td>
                <td>
                    <button onclick="modificar('director', ${director.id_d}, ${director.id_usuarios})" class="botonModificar">Editar</button>
                    <button onclick="eliminar('director', ${director.id_d}, ${director.id_usuarios})" class="botonEliminar">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getMonitores(){
    fetch(`${urlApi}usuarios.php?lista=monitores`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log("MONITORES",data);
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
                    <button onclick="modificar('monitor', ${monitores.id_m}, ${monitores.id_usuarios})" class="botonModificar">Editar</button>
                    <button onclick="eliminar('monitor', ${monitores.id_m}, ${monitores.id_usuarios})" class="botonEliminar">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getSocios(){
    fetch(`${urlApi}usuarios.php?lista=socios`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log("SOCIOS",data);
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
                    <button onclick="modificar('socios', ${socio.id_socio}, ${socio.id_usuarios})" class="botonModificar">Editar</button>
                    <button onclick="eliminar('socios', ${socio.id_socio}, ${socio.id_usuarios})" class="botonEliminar">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}

function getFamiliares(){
    fetch(`${urlApi}usuarios.php?lista=familiares`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        console.log("FAMILIARES",data);
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
                    <button onclick="modificar('familiares', ${familiar.id_f}, ${familiar.id_usuarios})" class="botonModificar">Editar</button>
                    <button onclick="eliminar('familiares', ${familiar.id_f}, ${familiar.id_usuarios})" class="botonEliminar">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);
        });
    });
}
async function eliminar(rol, id, id_usuario){
    console.log("eliminar",rol, id);
    await eliminarUsuario(rol, id, id_usuario);
}
async function eliminarUsuario(rol, id, id_usuario){
    console.log(`${urlApi}usuarios.php?id=${id}&tipo_user=${rol}&id_u=${id_usuario}`);
    let confirmacion = confirm(`¿Estas seguro de eliminar al usario ${rol} ?`);
    if(confirmacion){
    console.log("eliminar actividad");   
    fetch(`${urlApi}usuarios.php?id=${id}&tipo_user=${rol}&id_u=${id_usuario} `, {
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'webToken' : sessionStorage.getItem('jwt'),
      },
    });
    // location.reload(); 
    cargarLista("socios");
    }else{
      console.log("no se elimina");
    }
  }
async function modificar(rol, id){
    console.log("modificar",rol, id);
    await recogerDatos(rol, id);
}
async function recogerDatos(rol, id){
    let datos = {};
    console.log("rol", rol);
    console.log("id", id);
    console.log(`ULR DE CONSULTA DE USARIO BBDD \n
    ${urlApi}usuarios.php?lista=${rol}&id=${id}`
    );
    if(rol == 'monitor'){
        rol = 'monitores';
    }
    if(rol == 'director'){
        rol = 'directores';
    } 
    fetch(`${urlApi}usuarios.php?lista=${rol}&id=${id}`, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
    }).then(response => {
        // console.log(response);
        return response.json();
    }).then(data => {     
        // console.log("RESULTADO EDITAR",data);
       abrirModal();
       modificarUsuario(data);
    });

}

function abrirModal(){
    let modal = document.querySelector('#modalUsuario');
    modal.style.display = 'block';
};
function cerrarModal(){
    let modal = document.querySelector('#modalUsuario');
    modal.style.display = 'none';
}
window.onclick = function(event) {
    let modal = document.querySelector('#modalUsuario');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
