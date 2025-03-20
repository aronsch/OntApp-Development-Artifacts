'use strict';

angular.module('shared').filter('nonBreakingSpace', ['$sce',
    function($sce) {
        return function(input) {
            return $sce.trustAsHtml(input.replace(/\s/g,'&nbsp;'));
        };
    }
]);
