function checkRol(jwt){
  console.log("checkRol");
  if(sessionStorage.getItem('jwt') == null){
    window.location.href = 'login.html';
  }else{
    // navCabecera.classList.remove('esconder');
    // console.log("jwt: "+sessionStorage.getItem('jwt'));
  }
  let navCabecera = document.getElementById("navCabecera");
  console.log("navCabecera: "+navCabecera);
}
checkRol();
