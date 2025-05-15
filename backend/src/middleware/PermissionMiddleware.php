<?php

namespace src\middleware;

class PermissionMiddleware {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function hasPermission($userId, $permissionName) {
        $query = "SELECT COUNT(*) as count 
                 FROM user_roles ur 
                 INNER JOIN role_permissions rp ON ur.role_id = rp.role_id 
                 INNER JOIN permissions p ON rp.permission_id = p.id 
                 WHERE ur.user_id = :user_id AND p.name = :permission_name";
        
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':permission_name', $permissionName);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        return $result['count'] > 0;
    }

    public function handle($request, $permission) {
        // Obtener el usuario del token JWT
        $token = $request->getHeader('Authorization');
        if (!$token) {
            return [
                'status' => 'error',
                'message' => 'No token provided',
                'code' => 401
            ];
        }

        // Decodificar el token y obtener el ID del usuario
        $token = str_replace('Bearer ', '', $token);
        $decoded = \Firebase\JWT\JWT::decode($token, $_ENV['JWT_SECRET'], ['HS256']);
        $userId = $decoded->sub;

        // Verificar si el usuario tiene el permiso requerido
        if (!$this->hasPermission($userId, $permission)) {
            return [
                'status' => 'error',
                'message' => 'Permission denied',
                'code' => 403
            ];
        }

        return null; // Permiso concedido
    }
} 