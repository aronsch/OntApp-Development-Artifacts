'use strict';

(function () {

    angular.module('shared').directive('errorAlert', errorAlert);

    function errorAlert() {
        return {
            restrict: 'E',
            templateUrl: 'modules/core/views/error-alert.client.view.html'
        };
    }

})();