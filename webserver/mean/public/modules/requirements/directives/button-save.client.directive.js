'use strict';

(function () {
    angular.module('requirements').directive('saveButton', saveButton);

    function saveButton() {
        return {
            templateUrl: 'modules/requirements/views/button-save.client.view.html',
            restrict: 'E',
            require: '^^requirement'
        };
    }

})();

