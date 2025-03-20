'use strict';

angular.module('admin').factory('roles', roleService);

// TODO: refactor away from Service
roleService.$inject = ['$resource', 'PermissionsObj'];
function roleService($resource, PermissionsObj) {
    return $resource('admin/roles/:roleId', {
        roleId: '@_id'
    }, {
        get: {
            transformResponse: [parseJSON, transformResponse]
        },
        update: {
            method: 'PUT',
            transformResponse: [parseJSON, transformResponse]
        },
        save: {
            method: 'POST',
            transformResponse: [parseJSON, transformResponse]
        },
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: [parseJSON, transformAllResults]
        },
        model: {
            method: 'GET',
            params: {model: true},
            transformResponse: [parseJSON, transformResponse]
        }
    });

    function transformResponse(role) {
        role.permissions = new PermissionsObj(role.permissions);
        return role;
    }

    function transformAllResults(results) {
        return results.map(function (role) {
            return transformResponse(role);
        })
    }
}