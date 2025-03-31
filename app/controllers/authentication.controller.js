// Importación de módulos necesarios
import bcryptjs from "bcryptjs"; // Para hashing de contraseñas (viene de node_modules/bcryptjs)
import jsonwebtoken from "jsonwebtoken"; // Para generación de tokens JWT (viene de node_modules/jsonwebtoken)
import dotenv from "dotenv"; // Para manejo de variables de entorno (viene de node_modules/dotenv)

// Configuración de variables de entorno
dotenv.config(); // Carga las variables del archivo .env al process.env

// Base de datos temporal de usuarios (en memoria)
export const usuarios = [{ // Array exportable que almacena los usuarios registrados
  user: "a", // Nombre de usuario de ejemplo
  email: "a@a.com", // Email de ejemplo
  password: "$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2" // Contraseña hasheada de ejemplo
}]

/**
 * Función para manejar el login de usuarios
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
async function login(req,res){
  console.log(req.body); // Log de los datos recibidos
  const user = req.body.user; // Obtiene usuario del body
  const password = req.body.password; // Obtiene contraseña del body
  
  // Validación de campos completos
  if(!user || !password){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"}) // Respuesta de error
  }
  
  // Busca el usuario en la "base de datos"
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user); // Busca coincidencia de usuario
  if(!usuarioAResvisar){
    return res.status(400).send({status:"Error",message:"Error durante login"}) // Si no existe el usuario
  }
  
  // Compara la contraseña proporcionada con el hash almacenado
  const loginCorrecto = await bcryptjs.compare(password,usuarioAResvisar.password); // Comparación segura
  if(!loginCorrecto){
    return res.status(400).send({status:"Error",message:"Error durante login"}) // Si la contraseña no coincide
  }
  
  // Generación del token JWT
  const token = jsonwebtoken.sign( // Función para firmar el token
    {user:usuarioAResvisar.user}, // Payload (datos del usuario)
    process.env.JWT_SECRET, // Secreto para firmar (de variables de entorno)
    {expiresIn:process.env.JWT_EXPIRATION}); // Tiempo de expiración

  // Configuración de la cookie
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Fecha de expiración
    path: "/" // Ruta donde es válida la cookie
  }
  
  // Establece la cookie en la respuesta
  res.cookie("jwt",token,cookieOption); // Crea cookie con el token JWT
  res.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"}); // Respuesta exitosa
}

/**
 * Función para manejar el registro de nuevos usuarios
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
async function register(req,res){
  const user = req.body.user; // Obtiene usuario del body
  const password = req.body.password; // Obtiene contraseña del body
  const email = req.body.email; // Obtiene email del body
  
  // Validación de campos completos
  if(!user || !password || !email){
    return res.status(400).send({status:"Error",message:"Los campos están incompletos"}) // Respuesta de error
  }
  
  // Verifica si el usuario ya existe
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user); // Busca usuario existente
  if(usuarioAResvisar){
    return res.status(400).send({status:"Error",message:"Este usuario ya existe"}) // Si el usuario existe
  }
  
  // Generación del hash de la contraseña
  const salt = await bcryptjs.genSalt(5); // Genera un "salt"
  const hashPassword = await bcryptjs.hash(password,salt); // Genera el hash con la contraseña y el salt
  
  // Crea el nuevo usuario
  const nuevoUsuario ={
    user, email, password: hashPassword // Objeto con los datos del nuevo usuario
  }
  
  // Almacena el nuevo usuario
  usuarios.push(nuevoUsuario); // Agrega el usuario al array
  console.log(usuarios); // Log de la "base de datos" actualizada
  
  // Respuesta exitosa
  return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} agregado`,redirect:"/"})
}

// Exportación de los métodos
export const methods = {
  login, // Exporta la función login
  register // Exporta la función register
}