'use strict';

angular.module('users').controller('AuthenticationController', AuthenticationController);

AuthenticationController.$inject = ['$scope', '$http', '$location', 'Authentication', '$rootScope', '$state'];
function AuthenticationController($scope, $http, $location, Authentication, $rootScope, $state) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) $location.path('/');

    $scope.signup = function () {
        $http.post('/auth/signup', $scope.credentials)
            .then(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response.data;

                // And redirect to the index page
                $location.path('/');
                handleLogin($scope.authentication.user);
            })
            .catch(function (response) {
                $scope.error = response.data.message;
            });
    };

    $scope.signin = function () {
        clearError();
        $http.post('/auth/signin', $scope.credentials)
            .then(function (response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response.data;

                // And redirect to the index page
                $location.path('/');
                handleLogin($scope.authentication.user);
            })
            .catch(function (response) {
                $scope.error = response.data.message;
            });
    };

    $scope.$watch('credentials.username', clearError);
    $scope.$watch('credentials.password', clearError);

    function clearError() {
        delete $scope.error
    }

    function handleLogin(user) {
        $rootScope.$broadcast('user-login', user)
    }
}