'use strict';

(function () {
    angular.module('requirements').directive('inputDropdownButtons', inputDropdownButtons);

    function inputDropdownButtons() {
        return {
            restrict: 'E',
            templateUrl: 'modules/requirements/views/input-dropdown-buttons.client.view.html'
        };
    }

})();