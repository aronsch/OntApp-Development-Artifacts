'use strict';

angular.module('shared').filter('splitCamelCase', [
    function() {
        return function(input) {
            return input.replace(/([a-z])([A-Z])/g,'$1 $2');
        };
    }
]);
