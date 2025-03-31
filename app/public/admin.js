// Obtiene el primer botón del documento y le añade un event listener para el evento 'click'
document.getElementsByTagName("button")[0].addEventListener("click", () => {
  
  // Elimina la cookie JWT estableciendo una fecha de expiración en el pasado
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Redirige al usuario a la página principal ("/")
  document.location.href = "/";
});