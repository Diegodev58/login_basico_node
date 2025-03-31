# login_basico_node
# Guía de Funcionamiento de la Aplicación Web de Autenticación

##  Arquitectura General

##  Flujo de Autenticación

### 1. Registro de Usuario

1.  **Frontend** (register.html + register.js):
    * Usuario completa formulario (user, email, password)
    * JavaScript intercepta el submit y envía datos a `/api/register`

    ```json
    {
        "user": "nombreUsuario",
        "email": "email@valido.com",
        "password": "contraseñaSegura"
    }
    ```

2.  **Backend** (authentication.controller.js):
    * Valida campos obligatorios
    * Verifica si el usuario ya existe
    * Hashea la contraseña con bcryptjs
    * Almacena usuario en array `usuarios`
    * Responde con:

    ```json
    {
        "status": "ok",
        "message": "Usuario [nombre] agregado",
        "redirect": "/"
    }
    ```

### 2. Inicio de Sesión

1.  **Frontend** (login.html + login.js):
    * Usuario ingresa credenciales (user, password)
    * Datos enviados a `/api/login`

    ```json
    {
        "user": "nombreUsuario",
        "password": "contraseña"
    }
    ```

2.  **Backend** (authentication.controller.js):
    * Verifica credenciales
    * Compara hash de contraseña con bcryptjs
    * Genera token JWT válido por tiempo configurado
    * Establece cookie `jwt` con el token
    * Responde con:

    ```json
    {
        "status": "ok",
        "message": "Usuario loggeado",
        "redirect": "/admin"
    }
    ```

### 3. Acceso a Rutas Protegidas

1.  **Middleware** (authorization.js):
    * `soloPublico`: Bloquea acceso a login/register si hay sesión activa
    * `soloAdmin`: Exige token JWT válido para acceder a /admin
    * Verifica cookie `jwt` y valida con `jsonwebtoken.verify()`

2.  **Admin Panel**:
    * Si token es válido, muestra admin.html
    * Botón logout elimina la cookie jwt y redirige a login

## ️ Mecanismos de Seguridad

| Capa           | Protección             | Tecnología           |
| -------------- | ---------------------- | -------------------- |
| **Frontend** | Validación básica      | HTML5 + JavaScript   |
| **Comunicación** | Cifrado contraseñas    | HTTPS (en producción) |
| **Backend** | Hash contraseñas       | bcryptjs             |
| **Sesiones** | Tokens temporales      | JWT + cookie         |
| **Rutas** | Control de acceso      | Middlewares          |

##  Variables de Entorno Requeridas


JWT_SECRET=miClaveSuperSecreta
JWT_EXPIRATION=1h
JWT_COOKIE_EXPIRES=1


[Formulario Registro] → (POST /api/register) → [DB Usuarios]
        ↓
[Formulario Login] → (POST /api/login) → [Cookie JWT]
        ↓
[Acceso /admin] → [Middleware JWT] → [Panel Admin]
        ↓
[Logout] → [Elimina Cookie] → [Redirige a Login]
