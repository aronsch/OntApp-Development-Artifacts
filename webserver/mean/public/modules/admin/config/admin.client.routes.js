'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
    function stateProviderConfig($stateProvider) {
        // Requirements state routing
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'modules/admin/views/admin.client.view.html',
                controller: 'AdminController',
                resolve: {authenticate: authenticate}
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: 'modules/admin/views/admin-users.client.view.html',
                controller: 'AdminUsersController',
                resolve: {authenticate: authenticate}
            })
            .state('admin.roles', {
                url: '/roles',
                templateUrl: 'modules/admin/views/admin-roles.client.view.html',
                controller: 'AdminRolesController',
                resolve: {authenticate: authenticate}
            })
            .state('admin.createUser', {
                url: '/create-user',
                templateUrl: 'modules/admin/views/admin-create-user.client.view.html',
                controller: 'AdminUsersController',
                resolve: {authenticate: authenticate}
            })
            .state('admin.backup', {
                url: '/backup',
                templateUrl: 'modules/admin/views/admin-backup.client.view.html',
                controller: 'AdminBackupController',
                resolve: {authenticate: authenticate}
            });

        function authenticate($q, Authentication, $state, $timeout) {
            // http://stackoverflow.com/a/28267504/1971295
            if (Authentication.user._id) {
                // Resolve the promise successfully
                return $q.when();
            } else {
                // The next bit of code is asynchronously tricky.

                $timeout(function () {
                    // This code runs after the authentication promise has been rejected.
                    // Go to the log-in page
                    $state.go('home')
                });

                // Reject the authentication promise to prevent the state from loading
                return $q.reject();
            }
        }
    }]);
