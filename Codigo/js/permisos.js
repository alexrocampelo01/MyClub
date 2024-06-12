function checkRol(jwt){
  console.log("checkRol");
  if(sessionStorage.getItem('jwt') == null){
    window.location.href = 'login.html';
  }else{
    let navCabecera = document.getElementById("navCabecera");
    navCabecera.classList.remove('esconder');
    console.log("jwt: "+sessionStorage.getItem('jwt'));
  }
}


checkRol();
