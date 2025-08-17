# 📚 Book Reviews API

## Descripción 📋
API completa para la gestión de reseñas de libros personalizadas. Permite buscar libros, crear reseñas, gestionar biblioteca personal y autenticación de usuarios con arquitectura de microservicios usando Moleculer.

## Pre-requisitos ⚙️
Antes de comenzar, asegúrate de tener instalado lo siguiente:
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/) versión 18 o superior

Para que la aplicación funcione correctamente, necesitas configurar algunas variables de entorno. En la raíz del proyecto, crea un archivo llamado .env (si no lo tienes ya) y agrega las siguientes variables de entorno:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/bookreviews?retryWrites=true&w=majority
JWT_SECRET=tu-secret-super-seguro
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
OPENLIBRARY_API_URL=https://openlibrary.org
```

## Comenzando 🚀

Para iniciar el proyecto localmente:

1. Clona este repositorio.
2. Ingresa al directorio del proyecto.
3. Instala las dependencias:

```bash
npm install
```

4. Configura la base de datos MongoDB (asegúrate de haber creado previamente el archivo .env con los datos correctos de MongoDB Atlas o tu instancia local).

5. Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

6. Para generar el *build* de producción:

```bash
npm run build
npm start
```

Esto creará una carpeta `dist/` con los archivos transpilados listos para producción.

## Construido con 🛠️
- [Node.js](https://nodejs.org/)
- [Moleculer](https://moleculer.services/) - Framework de microservicios
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)
- [OpenLibrary API](https://openlibrary.org/developers/api) - Integración para búsqueda de libros

## Arquitectura 🏗️
El proyecto utiliza arquitectura de microservicios con Moleculer:

- **Gateway Service**: Punto de entrada HTTP y manejo de rutas
- **Auth Service**: Autenticación JWT y gestión de usuarios
- **Books Service**: Búsqueda de libros en OpenLibrary API
- **Library Service**: Gestión de biblioteca personal del usuario
- **Search Service**: Historial de búsquedas

## Dependencias del Proyecto 🔗
Esta API está pensada para ser utilizada junto al frontend:
- [Frontend - Book Reviews App](https://github.com/evertofd/book_reviews_app)

## Rutas de la API 📡
Si necesitas más detalles y documentación sobre las rutas, puedes acceder a la interfaz de Swagger en la siguiente URL:

**Documentación de la API (Swagger): `/api-docs`**

### Rutas Públicas
| Método | Ruta                                    | Descripción                    |
|--------|-----------------------------------------|--------------------------------|
| GET    | `/api-docs`                            | Documentación Swagger          |
| POST   | `/api/public/auth/register`            | Registro de usuario            |
| POST   | `/api/public/auth/login`               | Inicio de sesión               |
| GET    | `/api/public/auth/health`              | Health check del servicio auth |
| GET    | `/api/public/books/health`             | Health check del servicio books|
| GET    | `/api/public/books/library/front-cover/:id` | Obtener portada guardada |

### Rutas Protegidas (requieren autenticación)
| Método | Ruta                           | Descripción                          |
|--------|--------------------------------|--------------------------------------|
| GET    | `/api/books/search`            | Buscar libros en OpenLibrary        |
| GET    | `/api/books/last-search`       | Obtener historial de búsquedas      |
| POST   | `/api/books/my-library`        | Guardar libro en biblioteca personal |
| GET    | `/api/books/my-library`        | Obtener biblioteca personal          |
| GET    | `/api/books/my-library/:id`    | Obtener libro específico             |
| PUT    | `/api/books/my-library/:id`    | Actualizar reseña y calificación     |
| DELETE | `/api/books/my-library/:id`    | Eliminar libro de biblioteca         |
| POST   | `/api/auth/logout`             | Cerrar sesión                        |
| GET    | `/api/auth/me`                 | Obtener usuario actual               |

> Todas las rutas aceptan y responden con JSON. Las rutas protegidas requieren token JWT en el header Authorization: Bearer <token>

## Características Principales ✨
- 🔐 **Autenticación JWT completa** con registro, login y logout
- 🔍 **Búsqueda de libros** integrada con OpenLibrary API
- 📚 **Biblioteca personal** con reseñas y calificaciones (1-5 estrellas)
- 🖼️ **Gestión de portadas** con almacenamiento en base64
- 📝 **Reseñas de hasta 500 caracteres**
- 🔄 **Historial de búsquedas** (últimas 5 búsquedas)
- 📊 **Filtros avanzados** por título, autor, calificación
- 🏗️ **Arquitectura de microservicios** escalable

## Despliegue 🌐
Accede a la API desplegada en la siguiente URL:

🔗 [API Principal](https://book-reviews-backend-3b7d.onrender.com/api)

Y para la documentación interactiva de la API:

🔗 [Documentación de la API (Swagger)](https://book-reviews-backend-3b7d.onrender.com/api-docs)

### Frontend Desplegado:
🔗 [Book Reviews App](https://book-reviews-frontend-d15k.onrender.com/)

## Autores ✒️
- **Everto Farías** ❤️

*Desarrollado con 💚 usando Moleculer y Node.js*


