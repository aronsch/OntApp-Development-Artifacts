'use strict';

angular.module('admin').controller('AdminUsersController', AdminUsersController);

AdminUsersController.$inject = ['$scope', 'Authentication', 'users', 'roles', '$location'];
function AdminUsersController($scope, Authentication, Users, Roles, $location) {
    $scope.authentication = Authentication;

    // Controller scope state
    $scope.adminUser = Authentication.user;

    $scope.users = [];
    $scope.userModel = Users.model();
    $scope.roles = Roles.list({'active': true});
    $scope.selected = null;
    $scope.searchValues = {
        all: ''
    };

    $scope.searchUsers = function searchUsers() {
        var search;
        if ($scope.searchValues.all.length) {
            search = Users.list({all: $scope.searchValues.all});
        } else {
            search = Users.list({});
        }

        $scope.users = search;
    };

    $scope.select = function selectUser(user) {
        if ($scope.selected && $scope.selected._id === user._id) {
            $scope.deselect();
        } else {
            $scope.selected = angular.copy(user);
        }
    };

    $scope.deselect = function deselectUser() {
        $scope.selected = null;
    };

    $scope.update = function updateUser(deselect) {
        $scope.selected.$update().then(function (updatedUser) {
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].id === updatedUser.id) {
                    $scope.users.splice(i, 1, updatedUser);
                    break;
                }
            }
            if (deselect) $scope.deselect();
        }).catch(handleErrors)
    };

    $scope.create = function createUser() {
        delete $scope.errors;

        $scope.selected.$save().then(function (user) {
            $location.path('/admin/users');
        }).catch(handleErrors);
    };

    function handleErrors(response) {
        $scope.errors = response.data.errors
    }

    $scope.canDeactivate = function canDeactivateRole() {
        return $scope.adminUser.permissions.users.canDeactivate;
    };

    $scope.deactivate = function deactivate() {
        $scope.selected.active = false;
        $scope.update();
    };

    $scope.activate = function activate() {
        $scope.selected.active = true;
        $scope.update();
    };

    $scope.toggleRole = function toggleRole(role, form) {
        if (role.isDefault || $scope.roleLockedForAdmin(role)) return;

        if ($scope.hasRole(role)) {
            $scope.removeRole(role);
            form.$setDirty();
        } else {
            $scope.addRole(role);
            form.$setDirty();
        }
    };

    $scope.initNewUser = function initNewUser() {
        $scope.userModel.$promise.then(function () {
            $scope.selected = new Users(angular.copy($scope.userModel));
            $scope.roles.$promise.then(function () {
                // populate with default roles
                $scope.selected.roles = _.where($scope.roles, {isDefault: true});
            });
        });
    };

    $scope.addRole = function addRole(role) {
        if (!$scope.hasRole(role)) {
            $scope.selected.roles.push(role);
        }
    };

    $scope.removeRole = function removeRole(role) {
        if ($scope.hasRole(role) && !role.isDefault) {
            // remove role with matching id
            $scope.selected.roles = _.reject($scope.selected.roles, function (r) {
                return r._id === role._id;
            });
        }
    };

    $scope.hasRole = function hasRole(role) {
        return $scope.roleNamesForUser($scope.selected).indexOf(role.name) !== -1;
    };

    $scope.canModifyRole = function canModifyRole(role) {
        return !role.isDefault;
    };

    $scope.roleLockedForAdmin = function roleLockedForAdmin(role) {
        if (Authentication.user._id === $scope.selected._id) {
            return !role.removable && _.find(Authentication.user.roles, {_id: role._id});
        } else return false;
    };

    $scope.roleNamesForUser = function roleNamesForUser(user) {
        if (user) {
            return user.roles.map(function (role) {
                return role.name;
            });
        } else {
            return [];
        }
    }


}
