'use strict';

(function () {
    angular.module('requirements').directive('buttonInterrogate', buttonInterrogate);

    function buttonInterrogate() {
        return {
            restrict: 'E',
            require: '^^requirement',
            template: '<a class="btn btn-lg btn-default" style="vertical-align: top"' +
            ' title="Interrogate this requirement"' +
            ' ng-href="/#!/requirements/{{ requirement.Label | namePathFormat}}/interrogate">' +
            '<i class="fa fa-lg fa-user-secret"></i>' +
            '</a>'
        };
    }

    angular.module('requirements').directive('buttonInterrogateSm', buttonInterrogateSm);

    function buttonInterrogateSm() {
        return {
            restrict: 'E',
            require: '^^requirement',
            template: '<a class="btn btn-sm btn-default" style="vertical-align: top"' +
            ' title="Interrogate this requirement"' +
            ' ng-href="/#!/requirements/{{ requirement.Label | namePathFormat}}/interrogate">' +
            '<i class="fa fa-lg fa-user-secret"></i>' +
            '</a>'
        };
    }
})();

