'use strict';

(function () {
    angular.module('requirements').directive('labelCol', labelCol);

    labelCol.$inject = ['moduleSettings'];
    function labelCol(settings) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.addClass(settings.formClass.label);
            }
        };
    }

})();