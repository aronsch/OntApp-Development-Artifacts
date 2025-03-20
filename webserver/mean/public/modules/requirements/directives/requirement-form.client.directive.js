'use strict';

angular.module('requirements').directive('requirementForm', requirementForm);
angular.module('requirements').directive('reqFormLabel', requirementFormLabel);

requirementForm.$inject = ['moduleSettings'];
function requirementForm(settings) {
    return {
        templateUrl: 'modules/requirements/views/requirement-form.client.view.html',
        restrict: 'E',
        controller: 'RequirementFormController',
        require: '^^requirement',
        link: function postLink(scope, element, attrs) {
            scope.form = undefined;
            scope.formName = attrs.formName;
            scope.settings = settings;
            scope.saveAction = scope[attrs.saveAction];
        }
    }
}

requirementFormLabel.$inject = ['$compile', 'moduleSettings'];
function requirementFormLabel($compile, settings) {
    return {
        template: '<label for="{{ key }}">' +
        '<i class="fa fa-fw {{ customIconClass.length ? customIconClass : settings.iconClass[key] }}" ng-hide="prepend"></i>{{ text }}' +
        '</label>',
        restrict: 'E',
        scope: {
            text: '@',
            key: '@',
            customIconClass: '@',
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
