function checkRol(jwt){
  if(sessionStorage.getItem('jwt') == null){
    window.location.href = 'login.html';
  }else{
    // navCabecera.classList.remove('esconder');
    // console.log("jwt: "+sessionStorage.getItem('jwt'));
  }
}
checkRol();
