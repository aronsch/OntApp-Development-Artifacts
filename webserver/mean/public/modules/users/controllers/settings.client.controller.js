'use strict';

angular.module('users').controller('SettingsController', SettingsController);
SettingsController.$inject = ['$scope', '$http', '$location', 'User', 'Authentication'];

function SettingsController($scope, $http, $location, User, Authentication) {
    $scope.user = Authentication.user;

    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
        for (var i in $scope.user.additionalProvidersData) {
            return true;
        }

        return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
        return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
        $scope.success = $scope.error = null;

        $http.delete('/users/accounts', {
            params: {
                provider: provider
            }
        }).then(function (response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.user = Authentication.user = response;
        }).error(function (response) {
            $scope.error = response.message;
        });
    };

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
        if (isValid) {
            $scope.success = $scope.error = null;
            var user = new User($scope.user);

            user.$update(function (response) {
                $scope.success = true;
                Authentication.user = response;
            }, function (response) {
                $scope.error = response.data.message;
            });
        } else {
            $scope.submitted = true;
        }
    };

    // Change user password
    $scope.changeUserPassword = function () {
        $scope.success = $scope.error = null;

        $http.post('/users/password', $scope.passwordDetails).then(function (response) {
            // If successful show success message and clear form
            $scope.success = true;
            $scope.passwordDetails = null;
        }, function (response) {
            $scope.error = response.message;
        });
    };
}