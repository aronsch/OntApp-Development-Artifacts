'use strict';

(function () {
    angular.module('requirements').directive('searchButton', searchButton);

    function searchButton() {
        return {
            templateUrl: 'modules/requirements/views/button-search.client.view.html',
            restrict: 'E',
            scope: false
        };
    }
})();

