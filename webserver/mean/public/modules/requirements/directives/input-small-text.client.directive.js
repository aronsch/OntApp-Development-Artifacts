'use strict';

(function () {
    angular.module('requirements').directive('smallTextInput', smallTextInput);

    function smallTextInput() {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                title: '@',
                placeholder: '@',
                spellcheck: '@'
            },
            template: '<input type="text" ng-model="model" title="{{ title }}" ' +
            'class="form-control" placeholder="{{ placeholder }}" spellcheck="{{ spellcheck }}">'
        };
    }
})();