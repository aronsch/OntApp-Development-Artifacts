'use strict';
// DERIVED FROM requirements/directives/button-save.client.directive.js 

(function () {
    angular.module('glossary').directive('saveGlossaryentyButton', saveGlossaryentyButton);

    function saveGlossaryentyButton() {
        return {
            templateUrl: 'modules/glossary/views/button-glossaryenty-save.client.view.html',
            restrict: 'E',
            require: '^^GlossaryEntry'
        };
    }

})();

