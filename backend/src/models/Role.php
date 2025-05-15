<?php

namespace src\models;

class Role {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAll() {
        $query = "SELECT * FROM roles";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM roles WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getByName($name) {
        $query = "SELECT * FROM roles WHERE name = :name";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO roles (name, description) VALUES (:name, :description)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE roles SET name = :name, description = :description WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':description', $data['description']);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM roles WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getPermissions($roleId) {
        $query = "SELECT p.* FROM permissions p 
                 INNER JOIN role_permissions rp ON p.id = rp.permission_id 
                 WHERE rp.role_id = :role_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':role_id', $roleId);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function assignPermission($roleId, $permissionId) {
        $query = "INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :permission_id)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':role_id', $roleId);
        $stmt->bindParam(':permission_id', $permissionId);
        return $stmt->execute();
    }

    public function removePermission($roleId, $permissionId) {
        $query = "DELETE FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':role_id', $roleId);
        $stmt->bindParam(':permission_id', $permissionId);
        return $stmt->execute();
    }
} 