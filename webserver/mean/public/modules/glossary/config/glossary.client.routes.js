'use strict';

//Setting up route
angular.module('glossary').config(['$stateProvider',
    function stateProviderConfig($stateProvider) {
        // Requirements state routing
        $stateProvider.state('glossaryPage', {
            url: '/glossary',
            templateUrl: 'modules/glossary/views/glossary.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('updateglossary', {
            url: '/glossary/update',
            templateUrl: 'modules/glossary/views/edit-glossaryentry.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('editGlossaryEntry', {
            url: '/glossary/:name/edit',
            templateUrl: 'modules/glossary/views/edit-glossaryentry.client.view.html',
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
