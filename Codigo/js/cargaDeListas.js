let divEtiquetas = document.querySelector('#etiquetas');
console.log("divEtiquetas",divEtiquetas);
divEtiquetas.addEventListener('click',cargarLista);

function cargarLista(e){
    console.log("etiquetas",e.target);
    if(e.target){
        // console.log("etiquetas",e.target.id);
        let rutaFiltro = '';
        let rutaTabla = '';
        switch(e.target.id){
            case 'directores':
                console.log("directores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroDirectores.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaDirectores.html';
                break;
            case 'usuarios':
                console.log("usuarios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroUsuario.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaUsuario.html';
                break;
            case 'monitores':
                console.log("monitores");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroMonitor.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaMonitores.html';
                break;
            case 'socios':
                console.log("socios");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroSocios.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaSocios.html';
                break;
            case 'familiares':
                console.log("familiares");
                rutaFiltro = '../html/Componentes/filtrosListas/filtroFamiliar.html';
                rutaTabla = '../html/Componentes/tablasListas/tablaFamiliares.html';
                break;
        }
    let divfiltro = document.querySelector('#filtros');
    console.log("divfiltro",divfiltro);
    fetch(rutaFiltro).then(res => res.text()).then(html => divfiltro.innerHTML = html);
    let divTabla = document.querySelector('#divListas');
    console.log("divListas",divTabla);
    fetch(rutaTabla).then(res => res.text()).then(html => divTabla.innerHTML = html);
    }
};