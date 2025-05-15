<?php

namespace src\controllers;

use src\models\Role;
use src\models\Permission;

class RoleController {
    private $roleModel;
    private $permissionModel;

    public function __construct($db) {
        $this->roleModel = new Role($db);
        $this->permissionModel = new Permission($db);
    }

    public function getAllRoles() {
        try {
            $roles = $this->roleModel->getAll();
            return [
                'status' => 'success',
                'data' => $roles
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function getRole($id) {
        try {
            $role = $this->roleModel->getById($id);
            if (!$role) {
                return [
                    'status' => 'error',
                    'message' => 'Role not found',
                    'code' => 404
                ];
            }
            return [
                'status' => 'success',
                'data' => $role
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function createRole($data) {
        try {
            if (empty($data['name'])) {
                return [
                    'status' => 'error',
                    'message' => 'Role name is required',
                    'code' => 400
                ];
            }

            $result = $this->roleModel->create($data);
            return [
                'status' => 'success',
                'message' => 'Role created successfully',
                'data' => $result
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function updateRole($id, $data) {
        try {
            if (empty($data['name'])) {
                return [
                    'status' => 'error',
                    'message' => 'Role name is required',
                    'code' => 400
                ];
            }

            $result = $this->roleModel->update($id, $data);
            return [
                'status' => 'success',
                'message' => 'Role updated successfully',
                'data' => $result
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function deleteRole($id) {
        try {
            $result = $this->roleModel->delete($id);
            return [
                'status' => 'success',
                'message' => 'Role deleted successfully'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function getRolePermissions($roleId) {
        try {
            $permissions = $this->roleModel->getPermissions($roleId);
            return [
                'status' => 'success',
                'data' => $permissions
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function assignPermission($roleId, $permissionId) {
        try {
            $result = $this->roleModel->assignPermission($roleId, $permissionId);
            return [
                'status' => 'success',
                'message' => 'Permission assigned successfully'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function removePermission($roleId, $permissionId) {
        try {
            $result = $this->roleModel->removePermission($roleId, $permissionId);
            return [
                'status' => 'success',
                'message' => 'Permission removed successfully'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
} 