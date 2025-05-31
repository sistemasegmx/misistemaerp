# Sistema de Permisos (RBAC)

Este proyecto implementa un sistema de control de acceso basado en roles (RBAC - Role-Based Access Control) que permite gestionar de manera eficiente los permisos de los usuarios en la aplicación.

## Estructura de la Base de Datos

El sistema utiliza las siguientes tablas:

- **roles**: Almacena los roles del sistema
  ```sql
  CREATE TABLE roles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL UNIQUE,
      description TEXT
  )
  ```

- **permissions**: Almacena los permisos disponibles
  ```sql
  CREATE TABLE permissions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT
  )
  ```

- **role_permissions**: Relaciona roles con permisos
  ```sql
  CREATE TABLE role_permissions (
      role_id INT,
      permission_id INT,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (permission_id) REFERENCES permissions(id)
  )
  ```

- **user_roles**: Relaciona usuarios con roles
  ```sql
  CREATE TABLE user_roles (
      user_id INT,
      role_id INT,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (role_id) REFERENCES roles(id)
  )
  ```

## Roles y Permisos Predefinidos

El sistema viene con roles y permisos básicos preconfigurados:

### Roles
- **admin**: Administrador del sistema con acceso total
- **user**: Usuario regular con acceso limitado

### Permisos
Los permisos siguen el formato `recurso.acción`:
- `users.view`: Ver usuarios
- `users.create`: Crear usuarios
- `users.edit`: Editar usuarios
- `users.delete`: Eliminar usuarios
- `roles.view`: Ver roles
- `roles.create`: Crear roles
- `roles.edit`: Editar roles
- `roles.delete`: Eliminar roles

## Uso del Sistema de Permisos

### 1. Verificación de Permisos en Rutas

Puedes proteger tus rutas usando el middleware de permisos:

```php
$router->get('/ruta-protegida', function($request) {
    $middleware = new PermissionMiddleware($db);
    $result = $middleware->handle($request, 'nombre.permiso');
    
    if ($result !== null) {
        return $result; // Retorna error si no tiene permiso
    }
    
    // Continuar con la lógica de la ruta
});
```

### 2. Grupos de Rutas Protegidas

Para proteger múltiples rutas con el mismo permiso:

```php
$router->group('/ruta-protegida', function($router) {
    // Rutas protegidas aquí
}, function($request) {
    $middleware = new PermissionMiddleware($db);
    return $middleware->handle($request, 'nombre.permiso');
});
```

### 3. Verificación de Permisos en el Código

Para verificar permisos en cualquier parte del código:

```php
$middleware = new PermissionMiddleware($db);
if ($middleware->hasPermission($userId, 'nombre.permiso')) {
    // El usuario tiene el permiso
}
```

## API de Roles y Permisos

El sistema expone las siguientes rutas para gestionar roles y permisos:

### Roles
- `GET /roles`: Obtener todos los roles
- `GET /roles/{id}`: Obtener un rol específico
- `POST /roles`: Crear un nuevo rol
- `PUT /roles/{id}`: Actualizar un rol
- `DELETE /roles/{id}`: Eliminar un rol

### Permisos de Roles
- `GET /roles/{id}/permissions`: Obtener permisos de un rol
- `POST /roles/{id}/permissions/{permissionId}`: Asignar un permiso a un rol
- `DELETE /roles/{id}/permissions/{permissionId}`: Remover un permiso de un rol

## Seguridad

El sistema utiliza JWT (JSON Web Tokens) para la autenticación y verifica los permisos basándose en los roles asignados al usuario. Cada solicitud debe incluir un token JWT válido en el encabezado de autorización:

```
Authorization: Bearer <token>
```

## Ejemplo de Uso

1. **Asignar un Rol a un Usuario**
```php
// En tu controlador
$roleModel = new Role($db);
$roleModel->assignRole($userId, $roleId);
```

2. **Verificar Permiso**
```php
$middleware = new PermissionMiddleware($db);
if ($middleware->hasPermission($userId, 'users.create')) {
    // Permitir crear usuario
} else {
    // Denegar acceso
}
```

3. **Proteger una Ruta**
```php
$router->post('/users', function($request) {
    $middleware = new PermissionMiddleware($db);
    $result = $middleware->handle($request, 'users.create');
    
    if ($result !== null) {
        return $result;
    }
    
    // Crear usuario
});
```
