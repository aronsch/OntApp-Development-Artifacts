'use strict';

//Setting up route
angular.module('requirements').config(['$stateProvider',
    function stateProviderConfig($stateProvider) {
        // Requirements state routing
        $stateProvider.state('searchRequirements', {
            url: '/search',
            templateUrl: 'modules/requirements/views/search-requirements.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('createRequirement', {
            url: '/create',
            templateUrl: 'modules/requirements/views/create-requirement.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('requirement', {
            url: '/requirements/:name',
            templateUrl: 'modules/requirements/views/view-requirement.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('edit', {
            url: '/requirements/:name/edit',
            templateUrl: 'modules/requirements/views/edit-requirement.client.view.html',
            resolve: {authenticate: authenticate},
            onExit: function ($http) {
                var editing;
                if (sessionStorage.editing) {
                    editing = JSON.parse(sessionStorage.editing);
                    $http.get('/api/unlock/requirement/' + editing._namePath);
                    delete sessionStorage.editing;
                }
            }
        }).state('interrogatePage', {
            url: '/interrogate',
            templateUrl: 'modules/requirements/views/interrogative-form.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('interrogateMode', {
            url: '/requirements/:name/interrogate',
            templateUrl: 'modules/requirements/views/interrogative-form.client.view.html',
            resolve: {authenticate: authenticate}
        }).state('interrogateIri', {
            url: '/interrogate/iri?iri=',
            templateUrl: 'modules/requirements/views/interrogative-form.client.view.html',
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
