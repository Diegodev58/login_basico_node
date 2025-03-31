// Importación de módulos necesarios
import express from "express"; // Framework web para Node.js (viene de node_modules/express)
import cookieParser from 'cookie-parser'; // Middleware para manejar cookies (viene de node_modules/cookie-parser)
// Fix para __dirname en módulos ES
import path from 'path'; // Módulo para manejar rutas de archivos (viene de node_modules/path)
import {fileURLToPath} from 'url'; // Utilidad para convertir URL a path (viene de node_modules/url)

// Solución para obtener __dirname en módulos ES (equivalente a __dirname en CommonJS)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importación de métodos personalizados desde otros archivos
import {methods as authentication} from "./controllers/authentication.controller.js" // Métodos de autenticación (viene de ./controllers/authentication.controller.js)
import {methods as authorization} from "./middlewares/authorization.js"; // Middlewares de autorización (viene de ./middlewares/authorization.js)

// Configuración del servidor Express
const app = express(); // Crea una instancia de la aplicación Express
app.set("port",4000); // Establece el puerto 4000 como configuración
app.listen(app.get("port")); // Inicia el servidor en el puerto configurado
console.log("Servidor corriendo en puerto",app.get("port")); // Mensaje de confirmación en consola

// Configuración de middlewares
app.use(express.static(__dirname + "/public")); // Sirve archivos estáticos desde la carpeta /public
app.use(express.json()); // Permite parsear JSON en las solicitudes (middleware integrado de Express)
app.use(cookieParser()) // Habilita el manejo de cookies (middleware de cookie-parser)

// Definición de rutas
app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html")); 
// Ruta raíz que muestra login.html solo para usuarios no autenticados (usa middleware authorization.soloPublico)

app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html")); 
// Ruta de registro que muestra register.html solo para usuarios no autenticados (usa middleware authorization.soloPublico)

app.get("/admin",authorization.soloAdmin,(req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html")); 
// Ruta de admin que muestra admin.html solo para usuarios con rol admin (usa middleware authorization.soloAdmin)

app.post("/api/login",authentication.login); 
// Ruta POST para el login, maneja la autenticación (usa método authentication.login del controlador)

app.post("/api/register",authentication.register); 
// Ruta POST para el registro de nuevos usuarios (usa método authentication.register del controlador)