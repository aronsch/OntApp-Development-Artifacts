'use strict';

angular.module('core').controller('HeaderController', HeaderController);

HeaderController.$inject = ['$scope', '$state', 'Authentication', 'Menus', 'PermissionsObj'];
function HeaderController($scope, $state, Authentication, Menus, PermissionsObj) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.$state = $state;

    $scope.toggleCollapsibleMenu = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
        $scope.isCollapsed = false;
    });

    $scope.$watch('authentication.user', function (user) {
        // Extend user permissions object on user login
        if (user) {
            user.permissions = new PermissionsObj(user.permissions);
        }
    })
}