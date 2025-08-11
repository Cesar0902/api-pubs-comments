# API de Publicaciones y Comentarios - Documentación

Esta API RESTful permite a los usuarios crear publicaciones tipo blog y comentar en ellas. Incluye autenticación JWT, control de permisos, validaciones y protección contra XSS.

## 📡 Base URL

```
http://localhost:5000
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas, incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 📋 Endpoints

### 🔑 Autenticación

| Método | Ruta | Descripción | Protegido | Request Body |
|--------|------|-------------|-----------|--------------|
| `POST` | `/auth/register` | Registro de usuario | ❌ | `{ nombre, email, password }` |
| `POST` | `/auth/login` | Inicio de sesión | ❌ | `{ email, password }` |

#### `POST /auth/register`
**Descripción:** Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombre": "string (mín: 2 caracteres)",
  "email": "string (formato email válido)",
  "password": "string (8-20 chars, 1 mayúscula, 1 número, 1 especial)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Usuario registrado correctamente",
    "usuario": {
      "id": "uuid",
      "nombre": "string",
      "email": "string"
    }
  }
}
```

**Errores:**
- `400` - Datos inválidos o faltantes
- `409` - Email ya registrado

---

#### `POST /auth/login`
**Descripción:** Autentica un usuario y devuelve un token JWT.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_string",
    "usuario": {
      "id": "uuid",
      "nombre": "string",
      "email": "string"
    }
  }
}
```

**Errores:**
- `400` - Datos faltantes
- `401` - Credenciales inválidas

---

### 📝 Publicaciones

| Método | Ruta | Descripción | Protegido | Query Params | Request Body |
|--------|------|-------------|-----------|--------------|--------------|
| `GET` | `/publicaciones` | Listar publicaciones con paginación | ❌ | `page, limit, searchWord` | - |
| `GET` | `/publicaciones/:id` | Ver publicación específica | ❌ | - | - |
| `POST` | `/publicaciones` | Crear nueva publicación | ✅ | - | `{ titulo, contenido }` |
| `PUT` | `/publicaciones/:id` | Editar publicación (solo autor) | ✅ | - | `{ titulo, contenido }` |
| `DELETE` | `/publicaciones/:id` | Eliminar publicación (solo autor) | ✅ | - | - |

#### `GET /publicaciones`
**Descripción:** Lista todas las publicaciones con paginación y búsqueda opcional.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1, mín: 1)
- `limit` (opcional): Elementos por página (default: 10, mín: 1, máx: 100)
- `searchWord` (opcional): Palabra clave para buscar en título/contenido

**Ejemplo:**
```
GET /publicaciones?page=1&limit=5&searchWord=API
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "publicaciones": [
      {
        "id": "uuid",
        "titulo": "string",
        "contenido": "string",
        "fecha_creacion": "datetime",
        "fecha_actualizacion": "datetime",
        "usuario_id": "uuid",
        "nombre_usuario": "string"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 23,
      "itemsPerPage": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### `GET /publicaciones/:id`
**Descripción:** Obtiene una publicación específica por su ID.

**Parameters:**
- `id` (required): UUID de la publicación

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "titulo": "string",
    "contenido": "string",
    "fecha_creacion": "datetime",
    "fecha_actualizacion": "datetime",
    "usuario_id": "uuid",
    "nombre_usuario": "string"
  }
}
```

**Errores:**
- `400` - ID inválido (no es UUID)
- `404` - Publicación no encontrada

---

#### `POST /publicaciones`
**Descripción:** Crea una nueva publicación. Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "titulo": "string (1-100 caracteres)",
  "contenido": "string (1-500 caracteres)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Publicación creada",
    "id": "uuid"
  }
}
```

**Errores:**
- `400` - Datos inválidos o faltantes
- `401` - Token inválido o faltante

---

#### `PUT /publicaciones/:id`
**Descripción:** Edita una publicación existente. Solo el autor puede editarla.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (required): UUID de la publicación

**Request Body:**
```json
{
  "titulo": "string (1-100 caracteres)",
  "contenido": "string (1-500 caracteres)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Publicación actualizada"
  }
}
```

**Errores:**
- `400` - Datos inválidos o ID inválido
- `401` - Token inválido o faltante
- `403` - No tienes permisos para editar esta publicación
- `404` - Publicación no encontrada

---

#### `DELETE /publicaciones/:id`
**Descripción:** Elimina una publicación. Solo el autor puede eliminarla.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (required): UUID de la publicación

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Publicación eliminada"
  }
}
```

**Errores:**
- `400` - ID inválido
- `401` - Token inválido o faltante
- `403` - No tienes permisos para eliminar esta publicación
- `404` - Publicación no encontrada

---

### 💬 Comentarios

| Método | Ruta | Descripción | Protegido | Request Body |
|--------|------|-------------|-----------|--------------|
| `GET` | `/publicaciones/:id/comentarios` | Ver comentarios de una publicación | ❌ | - |
| `POST` | `/publicaciones/:id/comentarios` | Crear comentario en una publicación | ✅ | `{ contenido }` |

#### `GET /publicaciones/:id/comentarios`
**Descripción:** Lista todos los comentarios de una publicación específica.

**Parameters:**
- `id` (required): UUID de la publicación

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contenido": "string",
      "fecha_creacion": "datetime",
      "usuario_id": "uuid",
      "publicacion_id": "uuid",
      "nombre_usuario": "string"
    }
  ]
}
```

**Errores:**
- `400` - ID de publicación inválido
- `404` - Publicación no encontrada

---

#### `POST /publicaciones/:id/comentarios`
**Descripción:** Crea un nuevo comentario en una publicación. Requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (required): UUID de la publicación

**Request Body:**
```json
{
  "contenido": "string (1-200 caracteres)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Comentario creado",
    "id": "uuid"
  }
}
```

**Errores:**
- `400` - Datos inválidos, contenido vacío o ID inválido
- `401` - Token inválido o faltante
- `404` - Publicación no encontrada

---

## 🛡️ Seguridad

### Sanitización de HTML
- Todo el contenido de publicaciones y comentarios es sanitizado automáticamente para prevenir ataques XSS
- Se eliminan scripts y etiquetas HTML peligrosas

### Validaciones
- **Passwords:** Mínimo 8 caracteres, máximo 20, debe incluir mayúscula, número y carácter especial
- **Emails:** Formato válido requerido
- **UUIDs:** Validación estricta de formato
- **Contenido:** Límites de longitud aplicados

### Autenticación
- JWT con expiración configurable
- Middleware de verificación en rutas protegidas
- Control de permisos por autor en publicaciones

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Operación exitosa |
| `201` | Created - Recurso creado exitosamente |
| `400` | Bad Request - Datos inválidos o faltantes |
| `401` | Unauthorized - Token inválido o faltante |
| `403` | Forbidden - Sin permisos para la operación |
| `404` | Not Found - Recurso no encontrado |
| `409` | Conflict - Recurso ya existe (email duplicado) |
| `500` | Internal Server Error - Error del servidor |

---

## 🧪 Ejemplos de Uso

### 1. Registro y Login
```bash
# Registro
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "MiPassword123@"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "MiPassword123@"
  }'
```

### 2. Crear Publicación
```bash
curl -X POST http://localhost:5000/publicaciones \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi primera publicación",
    "contenido": "Contenido de la publicación..."
  }'
```

### 3. Listar Publicaciones con Búsqueda
```bash
curl "http://localhost:5000/publicaciones?page=1&limit=5&searchWord=API"
```

### 4. Crear Comentario
```bash
curl -X POST http://localhost:5000/publicaciones/{id}/comentarios \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "contenido": "Este es mi comentario..."
  }'
```

---

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=password
DB_NAME=nombre_base_datos
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h
PORT=5000
```

---

## 📁 Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── connection.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── comentarios.controller.js
│   │   └── publicaciones.controller.js
│   ├── middlewares/
│   │   └── auth_middleware.js
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── comentarios.model.js
│   │   └── publicacion.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── comentarios.routes.js
│   │   └── publicaciones.routes.js
│   ├── schemas/
│   │   ├── auth.schema.js
│   │   ├── comentarios.schema.js
│   │   ├── paginacion.schema.js
│   │   └── publicaciones.schema.js
│   └── utils/
│       ├── responseHandler.js
│       └── sanitizarHtml.js
├── test/
├── docker-compose.yml
├── package.json
└── server.js
```

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crea un issue en el repositorio del proyecto.
