'use strict';

(function () {
    angular.module('requirements').directive('propertyDisplay', propertyDisplayFilter);


    propertyDisplayFilter.$inject = ['$filter'];
    function propertyDisplayFilter($filter) {
        return {
            //template: '',
            restrict: 'E',
            templateUrl: 'modules/requirements/views/property-list.client.view.html'
        };
    }
})();

