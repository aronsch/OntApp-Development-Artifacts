'use strict';

angular.module('admin').controller('AdminController', AdminController);

AdminController.$inject = ['$scope', 'Authentication', '$state'];
function AdminController($scope, Authentication, $state) {
    $scope.authentication = Authentication;

    $scope.user = Authentication.user;

    $scope.isActive = function isActive(name) {
        return $state.current.name === name;
    }


}
