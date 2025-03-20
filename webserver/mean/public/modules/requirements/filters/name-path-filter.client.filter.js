'use strict';

angular.module('core').filter('namePathFormat', [
    function() {
        return function(input, format) {
            return input.replace(/\s/g,'');
        };
    }
]);
