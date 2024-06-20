
let divFiltros = document.querySelector('#divListas');
let divListas = document.querySelector('#divListas');

let butvisualizar = document.querySelector('#visualizarLista');
butvisualizar.addEventListener('click', changeList);
// let selectorLista = document.querySelector('#tipeUser');
// selectorLista.addEventListener('change', changeList);
// butsModificar.addEventListener('click', modificar);

function modificar(e){
    console.log("modificar",e.target);
}
function changeList(){
    let tipoLista = document.querySelector('#tipeUser').value;
    
}

let butCrearUsario = document.querySelector('#crearUsuario');
butCrearUsario.addEventListener('click', crearUsuario);

let spanCerrar = document.querySelector('#cerrarModal');
spanCerrar.addEventListener('click', cerrarModal);

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


