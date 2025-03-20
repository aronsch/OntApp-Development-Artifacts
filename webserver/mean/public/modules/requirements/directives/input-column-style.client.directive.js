'use strict';

(function () {
    angular.module('requirements').directive('inputCol', inputCol);

    inputCol.$inject = ['moduleSettings'];
    function inputCol(settings) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.addClass(settings.formClass.input);
            }
        };
    }

})();