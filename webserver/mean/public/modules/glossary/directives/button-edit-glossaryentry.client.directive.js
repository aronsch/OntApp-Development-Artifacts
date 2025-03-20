'use strict';

(function () {
    angular.module('glossary').directive('buttonEditGlossaryentry', buttonEditGlossaryentry);

    function buttonEditGlossaryentry() {
        return {
            restrict: 'E',
            require: '^^glossaryentry',
            template: '<a class="btn btn-sm btn-primary" style="vertical-align: top"' +
            ' title="edit entry"' +
            ' ng-href="/#!/glossary/{{ glossaryentry.Name | namePathFormat}}/edit">' +
            '<i class="fa fa-lg fa-pencil"></i>' +
            '</a>'
        };
    }

})();

