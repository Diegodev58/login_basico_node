// Importación de módulos necesarios
import jsonwebtoken from "jsonwebtoken"; // Para verificación de tokens JWT (viene de node_modules/jsonwebtoken)
import dotenv from "dotenv"; // Para manejo de variables de entorno (viene de node_modules/dotenv)
import {usuarios} from "./../controllers/authentication.controller.js"; // Importa la "base de datos" de usuarios (viene de ../controllers/authentication.controller.js)

// Configuración de variables de entorno
dotenv.config(); // Carga las variables del archivo .env al process.env

/**
 * Middleware que restringe el acceso solo a usuarios administradores
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
function soloAdmin(req, res, next) {
  const logueado = revisarCookie(req); // Verifica si hay una sesión válida
  if(logueado) return next(); // Si está logueado, permite continuar
  return res.redirect("/"); // Si no está logueado, redirige al login
}

/**
 * Middleware que restringe el acceso solo a usuarios no autenticados (público)
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
function soloPublico(req, res, next) {
  const logueado = revisarCookie(req); // Verifica si hay una sesión válida
  if(!logueado) return next(); // Si no está logueado, permite continuar
  return res.redirect("/admin"); // Si está logueado, redirige al admin
}

/**
 * Función auxiliar para verificar la cookie JWT
 * @param {Object} req - Objeto de solicitud de Express
 * @returns {boolean} - True si la cookie es válida, False en caso contrario
 */
function revisarCookie(req) {
  try {
    // Extrae la cookie JWT del header
    const cookieJWT = req.headers.cookie
      .split("; ") // Divide todas las cookies
      .find(cookie => cookie.startsWith("jwt=")) // Busca la cookie JWT
      .slice(4); // Elimina el prefijo "jwt="
    
    // Verifica y decodifica el token JWT
    const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificada); // Log del token decodificado
    
    // Busca el usuario en la "base de datos"
    const usuarioAResvisar = usuarios.find(usuario => usuario.user === decodificada.user);
    console.log(usuarioAResvisar); // Log del usuario encontrado
    
    // Si no encuentra el usuario, retorna false
    if(!usuarioAResvisar) {
      return false;
    }
    
    // Si todo es correcto, retorna true
    return true;
  } catch {
    // Si hay algún error en el proceso, retorna false
    return false;
  }
}

// Exportación de los métodos
export const methods = {
  soloAdmin, // Middleware para rutas de admin
  soloPublico, // Middleware para rutas públicas
}