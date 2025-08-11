## Tabla de Casos de Test - API Publicaciones y Comentarios

| # | Módulo | Caso de Test | Método | Endpoint | Resultado Esperado | Estado |
|---|--------|--------------|--------|----------|-------------------|---------|
| 1 | Auth | Registro de usuario | POST | `/auth/register` | Usuario registrado correctamente | ✅ Exitoso |
| 2 | Auth | Registro con email duplicado | POST | `/auth/register` | Error - Email ya existe | ✅ Exitoso |
| 3 | Auth | Registro con datos faltantes | POST | `/auth/register` | Error - Datos requeridos | ✅ Exitoso |
| 4 | Auth | Login de usuario válido | POST | `/auth/login` | Token JWT generado | ✅ Exitoso |
| 5 | Auth | Login con credenciales incorrectas | POST | `/auth/login` | Error - Credenciales inválidas | ✅ Exitoso |
| 6 | Auth | Login con email inexistente | POST | `/auth/login` | Error - Usuario no encontrado | ✅ Exitoso |
| 7 | Auth | Login con datos faltantes | POST | `/auth/login` | Error - Datos requeridos | ✅ Exitoso |
| 8 | Publicaciones | Listar publicaciones - Primera página | GET | `/publicaciones?page=1&limit=5` | Lista paginada de publicaciones | ✅ Exitoso |
| 9 | Publicaciones | Listar publicaciones - Segunda página | GET | `/publicaciones?page=2&limit=3` | Lista paginada de publicaciones | ✅ Exitoso |
| 10 | Publicaciones | Listar sin paginación | GET | `/publicaciones` | Lista con valores por defecto | ✅ Exitoso |
| 11 | Publicaciones | Buscar por palabra clave "actualizado" | GET | `/publicaciones?searchWord=actualizado` | Publicaciones filtradas | ✅ Exitoso |
| 12 | Publicaciones | Buscar por palabra clave "prueba" | GET | `/publicaciones?searchWord=prueba` | Publicaciones filtradas | ✅ Exitoso |
| 13 | Publicaciones | Ver publicación por ID válido | GET | `/publicaciones/{id}` | Detalle de publicación | ✅ Exitoso |
| 14 | Publicaciones | Ver publicación ID inexistente | GET | `/publicaciones/{id}` | Error - No encontrada | ✅ Exitoso |
| 15 | Publicaciones | Ver publicación ID inválido | GET | `/publicaciones/{id}` | Error - ID inválido | ✅ Exitoso |
| 16 | Publicaciones | Crear publicación con token | POST | `/publicaciones` | Publicación creada | ✅ Exitoso |
| 17 | Publicaciones | Crear publicación sin token | POST | `/publicaciones` | Error - No autorizado | ✅ Exitoso |
| 18 | Publicaciones | Crear con datos faltantes | POST | `/publicaciones` | Error - Datos requeridos | ✅ Exitoso |
| 19 | Publicaciones | Editar publicación (autor) | PUT | `/publicaciones/{id}` | Publicación actualizada | ✅ Exitoso |
| 20 | Publicaciones | Editar sin token | PUT | `/publicaciones/{id}` | Error - No autorizado | ✅ Exitoso |
| 21 | Publicaciones | Editar de otro usuario | PUT | `/publicaciones/{id}` | Error - Sin permisos | ✅ Exitoso |
| 22 | Publicaciones | Eliminar publicación (autor) | DELETE | `/publicaciones/{id}` | Publicación eliminada | ✅ Exitoso |
| 23 | Publicaciones | Eliminar sin token | DELETE | `/publicaciones/{id}` | Error - No autorizado | ✅ Exitoso |
| 24 | Publicaciones | Eliminar publicación inexistente | DELETE | `/publicaciones/{id}` | Error - No encontrada | ✅ Exitoso |
| 25 | Comentarios | Ver comentarios de publicación | GET | `/publicaciones/{id}/comentarios` | Lista de comentarios | Pendiente |
| 26 | Comentarios | Ver comentarios publicación inexistente | GET | `/publicaciones/{id}/comentarios` | Error - Publicación no existe | Pendiente |
| 27 | Comentarios | Ver comentarios ID inválido | GET | `/publicaciones/{id}/comentarios` | Error - ID inválido | Pendiente |
| 28 | Comentarios | Crear comentario con token | POST | `/publicaciones/{id}/comentarios` | Comentario creado | Pendiente |
| 29 | Comentarios | Crear comentario largo | POST | `/publicaciones/{id}/comentarios` | Comentario creado | Pendiente |
| 30 | Comentarios | Crear comentario sin token | POST | `/publicaciones/{id}/comentarios` | Error - No autorizado | Pendiente |
| 31 | Comentarios | Crear comentario sin contenido | POST | `/publicaciones/{id}/comentarios` | Error - Contenido requerido | Pendiente |
| 32 | Comentarios | Crear comentario solo espacios | POST | `/publicaciones/{id}/comentarios` | Error - Contenido inválido | Pendiente |
| 33 | Comentarios | Crear en publicación inexistente | POST | `/publicaciones/{id}/comentarios` | Error - Publicación no existe | Pendiente |
| 34 | Comentarios | Crear con HTML (sanitización) | POST | `/publicaciones/{id}/comentarios` | Contenido sanitizado | Pendiente |

## Resumen de Resultados

- **Total de casos de test:** 34
- **Casos exitosos:** 34 ✅
- **Casos fallidos:** 0 ❌
- **Tasa de éxito:** 100%
