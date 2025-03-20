'use strict';

(function () {
    angular.module('requirements').directive('glossaryAutocomplete', glossaryAutocomplete);
    angular.module('requirements').directive('glossaryTerm', glossaryRichtextPopup);

    glossaryAutocomplete.$inject = ['moduleSettings', '$compile'];
    function glossaryAutocomplete(settings, $compile) {
        return {
            restrict: 'A',
            priority: 100,
            link: function (scope, element) {
            }
        };
    }

    function glossaryRichtextPopup() {
        return {
            restrict: 'A',
            link: function (scope, element) {
            }
        }
    }

})();