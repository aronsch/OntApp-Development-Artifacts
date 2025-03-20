'use strict';

angular.module('requirements').directive('requirementPicker', requirementPicker);

requirementPicker.$inject = ['Requirement', 'SearchState', 'RequirementModal', 'moduleSettings', '$log'];
function requirementPicker(RequirementsSvc, SearchState, RequirementModal, settings, $log) {
    return {
        templateUrl: 'modules/requirements/views/requirement-picker.client.view.html',
        restrict: 'E',
        scope: {
            relation: '@',
            showRelatedList: '@',
            attachWithSubclass: '@'
        },
        link: function postLink(scope, element, attrs, controllers) {

            if (angular.isUndefined(scope.relation)) $log.error('RequirementPicker relation attribute not specified');

            scope.requirement = scope.$parent.requirement;
            scope.settings = settings;
            scope.searchState = SearchState.register(scope.relation + 'RequirementPicker');

            scope.openRequirementModal = function openRequirementModal(name) {
                RequirementModal.openModal(name);
            };

            // populate related requirement subtype dropdown
            scope.searchState.models.promise.then(function () {
                scope.subtypes = scope.searchState.models.subtypes;
            });
        }

    };
}