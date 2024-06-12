let urlLocal = 'http://localhost/Myclub/Codigo/php/'
let divFiltros = document.querySelector('#divListas');
let divListas = document.querySelector('#divListas');

let butvisualizar = document.querySelector('#visualizarLista');
butvisualizar.addEventListener('click', changeList);
// let selectorLista = document.querySelector('#tipeUser');
// selectorLista.addEventListener('change', changeList);


function getListas() {
    let tipoLista = document.querySelector('#tipeUser').value;
    let listaUsuarios = [];
    let url = urlLocal;
    if(tipoLista != undefined){
        console.log(tipoLista);
        url = urlLocal + `usuarios.php?lista=${tipoLista}`;
    };
    console.log(url);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'webToken' : sessionStorage.getItem('jwt'),
        }
    })
    .then(response => response.json())
    .then(data => {
    console.log(data);
    listaUsuarios=data;
    console.log(`tipo de usario ${tipoLista} // listaUsuarios `, listaUsuarios);
    generateList(listaUsuarios, tipoLista);
    });
    console.log("listaUsuarios",listaUsuarios);
    return listaUsuarios;
}
function generateList(lista, tipoLista){
    let tableUsuarios = document.querySelector('#tableUsuarios');
    console.log("div",tableUsuarios);
    let header = document.querySelector('#headerTableUsuarios');
    let tbody = document.querySelector('#tbodyTablaUsuarios');
    tbody.addEventListener('click', modificar)
    header.innerHTML = '';
    tbody.innerHTML = '';
    switch (tipoLista) {
        case 'directores':
            header.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>club</th>
                <th>fechaEleccion</th>
                <th>Acciones</th>
            </tr>
            `;
            lista.forEach(user => {
                tbody.innerHTML += `
                <tr>
                    <td>${user.nom}</td>
                    <td>${user.apel1} ${user.apel2}</td>
                    <td>${user.correo}</td>
                    <td>${user.club}</td>
                    <td>${user.fechaEleccion}</td>
                    <td>
                    <button class="btn btn-primary" idU="${user.id_u}" idD="${user.id}">Editar</button>
                    <button class="btn btn-danger" idU="${user.id_u}" idD="${user.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            });
            break;
        case 'monitores':
            header.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>curso</th>
                <th>Titulo Monitor</th>
                <th>Carne conducir</th>
            </tr>
            `;
            lista.forEach(user => {
                tbody.innerHTML += `
                <tr>
                    <td>${user.nom}</td>
                    <td>${user.apel1} ${user.apel2}</td>
                    <td>${user.correo}</td>
                    <td>${user.curso}</td>
                    <td>${user.titulo_m}</td>
                    <td>${user.carne_c}</td>
                    <td>
                    <button class="btn btn-primary" idU="${user.id_u}" idD="${user.id}">Editar</button>
                    <button class="btn btn-danger" idU="${user.id_u}" idD="${user.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            });
            break;
        case 'socios':
            header.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>curso</th>
                <th>fechaNacimiento</th>
                <th>colegio</th>
                <th>observaciones</th>
                <th>Acciones</th>
            </tr>
            `;
            lista.forEach(user => {
                tbody.innerHTML = `
                <tr>
                    <td>${user.nom}</td>
                    <td>${user.apel1} ${user.apel2}</td>
                    <td>${user.correo}</td>
                    <td>${user.curso}</td>
                    <td>${user.fechaNacimiento}</td>
                    <td>${user.colegio}</td>
                    <td>${user.observaciones}</td>
                    <td>
                    <button class="btn btn-primary" idU="${user.id_u}" idD="${user.id}">Editar</button>
                    <button class="btn btn-danger" idU="${user.id_u}" idD="${user.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            });
            break;
        case 'familiares':
            header.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>socio</th>
                <th>parentesco</th>
                <th>correo</th>
                <th>direccion</th>
                <th>localidad</th>
            </tr>
            `;
            lista.forEach(user => {
                tbody.innerHTML = `
                <tr>
                    <td>${user.nom}</td>
                    <td>${user.apel1} ${user.apel2}</td>
                    <td>Socio</td>
                    <td>${user.correo}</td>
                    <td>${user.direccion}</td>
                    <td>${user.localidad}</td>
                    <td>
                    <button class="btn btn-primary" idU="${user.id_u}" idD="${user.id}">Editar</button>
                    <button class="btn btn-danger" idU="${user.id_u}" idD="${user.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            });
            break;
            default:
                header.innerHTML = ` <h4> sin datos</h4> `;
                break;
    }
    

}
function modificar(e){
    console.log("modificar",e.target);
}
function changeList(){
    let tipoLista = document.querySelector('#tipeUser').value;
    console.log(tipoLista);
    console.log ("lista",getListas());
    
}
let butCrearUsario = document.querySelector('#crearUsuario');
butCrearUsario.addEventListener('click', crearUsuario);

function crearUsuario(){
console.log("crearUsuario");
}





