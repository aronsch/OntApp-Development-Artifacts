'use strict';

angular.module('requirements').directive('interrogate', interrogate);

interrogate.$inject = [];
function interrogate() {
    return {
        restrict: 'AE',
        controller: 'InterrogateController'
    }
}
