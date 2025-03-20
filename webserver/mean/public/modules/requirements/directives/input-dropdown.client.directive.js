'use strict';

(function () {

    angular.module('requirements').directive('inputDropdown', inputDropdown);

    function inputDropdown() {
        return {
            restrict: 'E',
            templateUrl: 'modules/requirements/views/input-dropdown.client.view.html'
        };
    }

})();