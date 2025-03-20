'use strict';

(function () {
    angular.module('requirements').directive('inputOffset', inputOffset);

    inputOffset.$inject = ['moduleSettings'];
    function inputOffset(settings) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.addClass(settings.formClass.inputOffset);
            }
        };
    }

})();