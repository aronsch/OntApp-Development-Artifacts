'use strict';

angular.module('admin').controller('AdminRolesController', AdminRolesController);

AdminRolesController.$inject = ['$scope', 'Authentication', 'roles', 'PermissionsObj'];
function AdminRolesController($scope, Authentication, Role, PermissionsObj) {
    $scope.authentication = Authentication;

    // Controller scope state
    $scope.adminUser = Authentication.user;

    $scope.roles = Role.list({});
    $scope.roleModel = Role.model();
    $scope.selected = null;

    $scope.searchRoles = function searchRoles() {
        $scope.roles = Role.list({});
    };

    $scope.select = function selectRole(index) {
        if ($scope.selected === $scope.roles[index]) {
            $scope.deselect();
        } else {
            $scope.selected = angular.copy($scope.roles[index]);
        }
    };

    $scope.deselect = function deselectRole() {
        $scope.selected = undefined;
        $scope.newRole = undefined;
    };

    $scope.isSelected = function isSelected(role) {
        return $scope.selected && $scope.selected._id === role._id;
    };

    $scope.currentFocus = function currentFocus() {
        return $scope.selected || $scope.newRole;
    };

    $scope.initNewRole = function initNewRole() {
        $scope.deselect();
        $scope.newRole = new Role({
            name: '',
            permissions: angular.copy($scope.roleModel.permissions),
            isDefault: false
        });
    };

    $scope.update = function updateRole() {
        if ($scope.newRole) {
            $scope.create();
        } else {
            $scope.selected.$update().then(function (role) {
                for (var i = 0; i < $scope.roles.length; i++) {
                    if ($scope.roles[i]._id === role._id) {
                        $scope.roles.splice(i, 1, role);
                        break;
                    }
                }
                $scope.deselect();
            })
        }
    };

    $scope.deactivate = function deactivate() {
        $scope.selected.active = false;
        $scope.update();
    };

    $scope.delete = function deleteRole() {
        var deletion = $scope.selected.$delete();
        deletion.then(function () {
            handleRoleDeletion($scope.selected);
            $scope.deselect();
        });
    };

    function handleRoleDeletion(role) {
        for (var i = 0; i < $scope.roles.length; i++) {
            if ($scope.roles[i]._id === role._id) {
                $scope.roles.splice(i, 1);
                break;
            }
        }
    }

    $scope.activate = function activate() {
        $scope.selected.active = true;
        $scope.update();
    };

    $scope.canDeactivate = function canDeactivateRole() {
        return $scope.adminUser.permissions.roles.canDeactivate;
    };

    $scope.canDelete = function canDeleteRole() {
        return $scope.adminUser.permissions.roles.canDelete;
    };


    $scope.create = function createRole() {
        $scope.newRole.$save().then(function (role) {
            $scope.roles.push(role);
            $scope.deselect();
        })
    };


}
