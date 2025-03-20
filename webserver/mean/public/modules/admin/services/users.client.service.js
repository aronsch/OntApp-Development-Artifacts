'use strict';

angular.module('admin').factory('users', usersService);

// TODO: refactor away from Service
usersService.$inject = ['$resource', 'PermissionsObj'];
function usersService($resource, PermissionsObj) {
    var users = $resource('admin/users/:userId', {
        userId: '@_id'
    }, {
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
            transformResponse: [parseJSON, transformResults]
        },
        model: {
            method: 'GET',
            params: {model: true}
        }
    });

    function transformResponse(user) {
        user.permissions = new PermissionsObj(user.permissions);
        return user;
    }

    function transformResults(results) {
        return results.map(function(user) {
            return transformResponse(user);
        });
    }

    return users;

}