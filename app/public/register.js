// Obtiene el elemento para mostrar mensajes de error
const mensajeError = document.getElementsByClassName("error")[0];

// Añade event listener al formulario de registro
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el envío tradicional del formulario
  console.log(e.target.children.user.value); // Log para depuración
  
  // Envía los datos al servidor
  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST", // Método HTTP POST
    headers: {
      "Content-Type": "application/json" // Indica que enviamos datos JSON
    },
    body: JSON.stringify({ // Convierte los datos a JSON
      user: e.target.children.user.value, // Nombre de usuario
      email: e.target.children.email.value, // Email del usuario
      password: e.target.children.password.value // Contraseña
    })
  });
  
  // Manejo de errores
  if(!res.ok) {
    // Si la respuesta no es exitosa, muestra el mensaje de error
    return mensajeError.classList.toggle("escondido", false);
  }
  
  // Procesa la respuesta exitosa
  const resJson = await res.json(); // Convierte la respuesta a JSON
  
  // Redirección si es necesaria
  if(resJson.redirect) {
    window.location.href = resJson.redirect; // Redirige a la URL especificada
  }
});