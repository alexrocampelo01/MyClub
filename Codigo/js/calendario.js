console.log("calendario.js");
let elementDomListaActividades = document.querySelector('#ListaActividades');
let butCrear = document.querySelector('#butCrear');
butCrear.classList.remove('esconderNone');
elementDomListaActividades.appendChild(butCrear);
cambiosPorRol();

let listaActividades = [];

listaNombreMonitores();

//declaramos variables inicializo el dia
let hoy = new Date();
var dia = hoy.getDate();
var mes = hoy.getMonth() + 1; // Nota: ¡Los meses en JavaScript van de 0 a 11!
var año = hoy.getFullYear();
console.log(`[HOY] ${año}- ${mes} - ${dia}`);

let textoMesCalendario = document.querySelector('#mesCalendario');
let divCalendario = document.querySelector('#calendario');
createCalendar(divCalendario, año, mes);

let sumarMes = document.querySelector('#sumarMes');
sumarMes.addEventListener('click', anadirMes);
function anadirMes(){
  console.log("+");
  mes ++;
  comprobacionMes(mes);
  createCalendar(divCalendario, año, mes);
}
let restarMes= document.querySelector('#restarMes');
restarMes.addEventListener('click', disminuirMes);
function disminuirMes(){
  console.log("-");
  mes--;
  comprobacionMes(mes);
  createCalendar(divCalendario, año, mes);
}
// function crearClendario2(){

// let divCalendario = document.querySelector('#calendario');
// let tableConJS = document.createElement('table');
// tableConJS.innerHTML = "<tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>"
//   divCalendario.append(tableConJS);
// }

async function createCalendar(elem, year, month) {

  console.log(`[CREACION CALENDARIO] ${year} - ${month}`);

  let nombresMesesEspañol = ["Enero",  "Febrero",  "Marzo",  "Abril",  "Mayo",  "Junio",  "Julio",  "Agosto",  "Septiembre",  "Octubre",  "Noviembre",  "Diciembre"];
  let ano = year; 
  let mon = month - 1; // los meses en JS son 0..11, no 1..12
  let d = new Date(year, mon);


  textoMesCalendario.textContent = nombresMesesEspañol[d.getMonth()] + ` ${ano}`;
  let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';
  //comprobacion de cambio de año

  // Obtener el primer día del mes
  var primerDia = new Date(d.getFullYear(), mes -1, 1);
  
  // Obtener el último día del mes
  var ultimoDia = new Date(d.getFullYear(), mes, 0);
  // obtenemos la lista de actividades de este mes
  listaActividades = await getActividadesList(convertirDateATextoSQL(primerDia),convertirDateATextoSQL(ultimoDia));
  console.log(`[Lista de Actividades]`, listaActividades);
  
   
  // espacios en la primera línea
  // desde lunes hasta el primer día del mes
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += '<td></td>';
  }

  // <td> con el día  (1 - 31)
  while (d.getMonth() == mon) {
    table += `<td class="diaConActividad" date-fecha='${convertirDateATextoSQL(d)}'>
    <div class="textoCalendario">
    <span class="numeroDia">${d.getDate()}</span>`;
    let actividadesHoy = await obtenerActividadesPorFecha(listaActividades, d);
    if(actividadesHoy.length > 0){
      table += `<span class="spanActividad">${actividadesHoy.length}</span>`;
    }
    table += `</div></td>`;
    
    if (getDay(d) % 7 == 6) { // domingo, último dia de la semana nueva línea
      table += '</tr><tr>';
    }

    d.setDate(d.getDate() + 1);
  }

  // espacios después del último día del mes hasta completar la última línea
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td></td>';
    }
  }

  // cerrar la tabla
  table += '</tr></table>';
  elem.addEventListener('click', seleccionarDia);

  elem.innerHTML = table;
  
}
function getDay(date) { // obtiene el número de día desde 0 (lunes) a 6 (domingo)
  let day = date.getDay();
  if (day == 0) day = 7; // hacer domingo (0) el último día
  return day - 1;
}

function comprobacionMes(mes){
  console.log(`[MES] comprobae`, mes );
  if(mes <= 0){
    this.mes = 12;
    this.año = this.año - 1;
  }else if(mes > 11){
    this.mes = 1;
    this.año = this.año +1;
  }
}
    
function seleccionarDia(e){
  if(listaActividades.length > 0){
    let day = new Date(e.target.getAttribute("date-fecha"))
    let activiades = obtenerActividadesPorFecha(listaActividades, day);
    elementDomListaActividades.innerHTML = "";
    activiades.forEach((actividad)=>{
      let divActividadLista = document.createElement('div');
      divActividadLista.setAttribute('class', 'actividadLista');
      divActividadLista.setAttribute('id_C', `${actividad.id}`);
      divActividadLista.innerHTML = `    
      <div class="contenidoActividad">
      <span class="tituloActividad">${actividad.titulo}</span>
        <div class="informacionActividad">
            <span>Curso: ${actividad.curso_ac}</span><br>
            <span>Fecha Inicio: ${actividad.fechaHora_start}</span><br>
            <span>Fecha Final: ${actividad.fechaHora_end}</span>
        </div>
        <div class="accionesActividad">
            <button idC="${actividad.id}" class="modificarAc">Modificar</button>
            <button idC="${actividad.id}" class="eliminarAc">Eliminar</button>
            <button idC="${actividad.id}" class="infoAc">Información</button>
        </div>
      </div>
      `;

      // console.log(`creando lista`, divActividadLista);
      elementDomListaActividades.append(divActividadLista);
      elementDomListaActividades.appendChild(butCrear);
      document.querySelectorAll('.modificarAc').forEach((element)=>{element.addEventListener('click', modificarActividadLoad);})
      document.querySelectorAll('.eliminarAc').forEach((element)=>{element.addEventListener('click', eliminarActividad);})
      document.querySelectorAll('.infoAc').forEach((element)=>{element.addEventListener('click', modificarActividadLoad);})
      cambiosPorRolActividad();
    })
  }
}

function modificarActividadLoad(e){
  console.log("modificar actividad", e.target.getAttribute('idc'));
  let activiadad = listaActividades.find(actividad => actividad.id == e.target.getAttribute('idc'));
  console.log("actividad", activiadad);
  // abromos el modal y lo modificamos
  abrirModal();
  document.querySelector('#butCrearActividad').classList.add('esconderNone');
  document.querySelector('#butModificaActividad').classList.remove('esconderNone');
  //rellenamos los campos
  let monitor = document.querySelector('#monitor')
  let monitorSelect =  monitor.querySelector(`option[value="${activiadad.id_m}"]`);
  if(monitorSelect != null){
    monitorSelect.selected = true;
  }
  document.querySelector('#titulo').value = activiadad.titulo;
  document.querySelector('#fechStart').value = activiadad.fechaHora_start;
  document.querySelector('#fechEnd').value = activiadad.fechaHora_end;
  document.querySelector('#lugar').value = activiadad.lugar;
  let curso = document.querySelector('#curso');
  let cursoSelect =  curso.querySelector(`option[value="${activiadad.curso_ac}"]`);
  if(cursoSelect != null){
    cursoSelect.selected = true;
  }

  document.querySelector('#descripcion').value = activiadad.descripcion;
  document.querySelector('#material').value = activiadad.material;
  // Si es info no se puede modificar
  if(e.target.classList.contains('infoAc')){ 
    console.log("INFORMACION TARGET", e.target);
    document.querySelector('#butModificaActividad').classList.add('esconderNone');
    hacerNoEditableForm(true);
  }else{
    //añadimos el evento
    hacerNoEditableForm(false); 
    document.querySelector('#butModificaActividad').setAttribute('id_C', `${activiadad.id}`);
    document.querySelector('#butModificaActividad').addEventListener('click', modificarActividad);

  }
}
//si recive true no se puede editar
//si recive false se puede editar

function modificarActividad(e){ // validar formulario
  console.log("modificar actividad");
  let activiadad ={};
  activiadad.id = e.target.getAttribute('id_C');
  console.log("id", activiadad.id);
  activiadad.id_m = document.querySelector('#monitor').value;
  activiadad.titulo = document.querySelector('#titulo').value;
  activiadad.fechaHora_start = document.querySelector('#fechStart').value;
  activiadad.fechaHora_end = document.querySelector('#fechEnd').value;
  activiadad.lugar = document.querySelector('#lugar').value;
  activiadad.curso_ac = document.querySelector('#curso').value;
  activiadad.descripcion = document.querySelector('#descripcion').value;  
  activiadad.material = document.querySelector('#material').value;
  console.log("actividad", activiadad);
  fetch(`${urlApi}actividades.php`, {
      method:'PUT',
      headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'webToken' : sessionStorage.getItem('jwt'),
      },
      body: JSON.stringify(activiadad)
  }).then((response) => {
      // console.log(response);
      switch(response.status){
          case 200:
              return response.json();
          case 201:
              document.querySelector('#errores').innerHTML=`modificado con exito`;
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
  }).then(data => {     
      console.log(data);
      cerrarModal();
      location.reload(); 
  });
}
function eliminarActividad(e){
  console.log("eliminar actividad", e.target.getAttribute('idc'));
  let id_actividad = e.target.getAttribute('idc');
  let confirmacion = confirm("¿Estas seguro de eliminar la actividad?");
  if(confirmacion){
  console.log("eliminar actividad");   
  fetch(`${urlApi}actividades.php?id=${id_actividad}`, {
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'webToken' : sessionStorage.getItem('jwt'),
    },
  });
  location.reload(); 
  }else{
    console.log("no se elimina");
  }

}


function convertirDateATextoSQL(fecha) {

  let date = new Date(fecha);
  // console.log(date);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');

  let formatoSQL = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formatoSQL;
}

async function getActividadesList(startDate, endDate){
  // console.log(`[URL] ${urlApi}actividades.php?lista=rangoFechas&filtro=${startDate},${endDate}`)
  let listaActividades = fetch(`${urlApi}actividades.php?lista=rangoFechas&filtro=${startDate},${endDate}`, {
      method:'GET',
      headers: {
        webToken: `${sessionStorage.getItem('jwt')}`,
      },
  })
  .then(response => {
    // console.log(response.status);
    switch(response.status){
        case 200:
            // console.log("que pasa",response);
            return response.json();
        case 201:
            document.querySelector('#errores').innerHTML=`cargadas activiades`;
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
  })
  .then((data) => {
      console.log("data", data);
      return data;
      // console.log("lista activiades", listaActividades);
    })
    return listaActividades;
}

function obtenerActividadesPorFecha(listaActividades, fecha) {
  return listaActividades.filter(function(actividad) {
    // console.log(actividad.fechaHora_start);
    let fechaActividad = new Date(actividad.fechaHora_start);
    // console.log(`${fechaActividad} === ${fecha}`);
    return fechaActividad.getDate() === fecha.getDate() &&
           fechaActividad.getMonth() === fecha.getMonth() &&
           fechaActividad.getFullYear() === fecha.getFullYear();
});
}

function listaNombreMonitores(){
    let selecMonitores = document.querySelector('#monitor');
    fetch(`${urlApi}usuarios.php?lista=monitores&nombres`, {
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
        data.forEach(element => {
            let option = document.createElement('option');
            option.text = element.nom+" "+element.apel1;
            option.value = element.id;
            selecMonitores.appendChild(option);
        });
    });
}
function hacerNoEditableForm(editable){
  if(editable){
    document.querySelector('#monitor').disabled = true;
    document.querySelector('#titulo').disabled = true;
    document.querySelector('#fechStart').disabled = true;
    document.querySelector('#fechEnd').disabled = true;
    document.querySelector('#lugar').disabled = true;
    document.querySelector('#curso').disabled = true;
    document.querySelector('#descripcion').disabled = true;
    document.querySelector('#material').disabled = true;
  }else{
    document.querySelector('#monitor').disabled = false;
    document.querySelector('#titulo').disabled = false;
    document.querySelector('#fechStart').disabled = false;
    document.querySelector('#fechEnd').disabled = false;
    document.querySelector('#lugar').disabled = false;
    document.querySelector('#curso').disabled = false;
    document.querySelector('#descripcion').disabled = false;
    document.querySelector('#material').disabled = false;
  }
}
async function cambiosPorRolActividad(){
  let rol = await checkRol();
  console.log("cambios por rol", rol);
  if(rol == 'socio' || rol == 'familiar'){
  document.querySelectorAll('.modificarAc').forEach((element)=>{element.classList.add('esconderNone');})
  document.querySelectorAll('.eliminarAc').forEach((element)=>{element.classList.add('esconderNone');})
  }
}
async function cambiosPorRol(){
  let rol = await checkRol();
  console.log("cambios por rol", rol);
  if(rol == 'socio' || rol == 'familiar'){
    document.querySelector('#butCrear').classList.add('esconderNone');
  }
}

//CREAR ACTIVIDAD
let btnCrearActividad = document.querySelector('#butCrearActividad');
btnCrearActividad.addEventListener('click', recojerFormActividad);

let butModificaActividad = document.querySelector('#butModificaActividad');
btnCrearActividad.addEventListener('click', modificarActividadLoad);

function recojerFormActividad(){
    document.querySelector('#butCrearActividad').classList.remove('esconderNone');
    document.querySelector('#butModificaActividad').classList.add('esconderNone');
    console.log("crear actividad");
    let activiadad ={};
    activiadad.id_m = document.querySelector('#monitor').value;
    activiadad.titulo = document.querySelector('#titulo').value;
    activiadad.fechaHora_start = document.querySelector('#fechStart').value;
    activiadad.fechaHora_end = document.querySelector('#fechEnd').value;
    activiadad.lugar = document.querySelector('#lugar').value;
    activiadad.curso_ac = document.querySelector('#curso').value;
    activiadad.descripcion = document.querySelector('#descripcion').value;  
    activiadad.material = document.querySelector('#material').value;
    console.log("actividad", activiadad);
    crearActividad(activiadad);
}
function crearActividad(dataActividad){
    console.log("crear actividad", dataActividad);
    console.log("crear actividad JSON", JSON.stringify(dataActividad));
    fetch(`${urlApi}actividades.php`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'webToken' : sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(dataActividad)
    }).then((response) => {
        // console.log(response);
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
    }).then(data => {     
        console.log(data);
        location.reload();
        cerrarModal();
    });
}

// Crear la ventana  modal
butCrear = document.querySelector('#butCrear');
butCrear.addEventListener('click', abrirModal);
butCrear.addEventListener('click',prepararActividadNueva);

function prepararActividadNueva(){
  document.querySelector('#butCrearActividad').classList.remove('esconderNone');
  document.querySelector('#butModificaActividad').classList.add('esconderNone');
  let formulario = document.querySelector('#formActividad');
  for (let i = 0; i < formulario.elements.length; i++) {
    if (formulario.elements[i].type == "text" || formulario.elements[i].type == "textarea") {
      formulario.elements[i].value = "";
    } else if (formulario.elements[i].type == "checkbox" || formulario.elements[i].type == "radio") {
      formulario.elements[i].checked = false;
    } else if (formulario.elements[i].type == "number") {
      formulario.elements[i].selectedIndex = 0;
    } else if (formulario.elements[i].type == "date" || formulario.elements[i].type == "datetime-local") {
        formulario.elements[i].selectedIndex = 0;
      }
  }
};

let spanCerrar = document.querySelector('#cerrarModal');
spanCerrar.addEventListener('click', cerrarModal);

function abrirModal(){
  let modal = document.querySelector('#miModal');
  modal.style.display = 'block';
};
function cerrarModal(){
  let modal = document.querySelector('#miModal');
  modal.style.display = 'none';
}
window.onclick = function(event) {
  let modal = document.querySelector('#miModal');
  if (event.target == modal) {
      modal.style.display = "none";
  }
}
