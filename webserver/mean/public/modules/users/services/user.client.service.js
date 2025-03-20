'use strict';

angular.module('users').factory('User', UserService);

// TODO: refactor away from Service
UserService.$inject = ['$resource', 'PermissionsObj'];
function UserService($resource, PermissionsObj) {
    var users = $resource('users/', {
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
        me: {
            method: 'GET',
            url: 'users/me',
            transformResponse: [parseJSON, transformResponse]
        }
    });

    function transformResponse(user) {
        user.permissions = new PermissionsObj(user.permissions);
        return user;
    }

    return users;

}