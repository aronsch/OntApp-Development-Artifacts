'use strict';

// COPIED FROM requirement-form.client.directive.js

angular.module('glossary').directive('glossaryentryForm', glossaryentryForm);
angular.module('glossary').directive('glosFormLabel', glossaryentryFormLabel);

glossaryentryForm.$inject = ['moduleSettings'];
function glossaryentryForm(settings) {
    return {
        templateUrl: 'modules/glossary/views/glossaryentry-form.client.view.html',
        restrict: 'E',
        controller: 'GlossaryEntryFormController',
        require: '^^glossaryentry',
        link: function postLink(scope, element, attrs) {
            scope.settings = settings;
            scope.saveAction = scope[attrs.saveAction];
        }
    }
}

glossaryentryFormLabel.$inject = ['$compile', 'moduleSettings'];
function glossaryentryFormLabel($compile, settings) {
    return {
        template: '<label for="{{ key }}"><i class="fa fa-fw {{ settings.iconClass[key] }}" ng-hide="prepend"></i>{{ text }}</label>',
        restrict: 'E',
        scope: {
            text: '@',
            key: '@',
            reqValue: '=requiredValue'
        },
        link: function postLink(scope, element, attrs) {
            scope.prepend = angular.isDefined(attrs.requiredIconPrepend);
            scope.settings = settings;

            if (angular.isDefined(scope.reqValue)) {
                var icon = $('<i class="fa fa-fw ' +
                    'ng-class:{ \'text-success fa-check\': reqValue.length, ' +
                    '\'text-danger fa-asterisk\': !reqValue.length }"></i>');

                if (scope.prepend) {
                    $(element).prepend($compile(icon)(scope));
                } else {
                    $(element).append($compile(icon)(scope));
                }
            }
        }
    }
}
