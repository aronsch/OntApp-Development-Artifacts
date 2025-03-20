'use strict';

angular.module('requirements').directive('searchRequirementForm', searchRequirementForm);
searchRequirementForm.$inject = [];
function searchRequirementForm() {
    return {
        templateUrl: 'modules/requirements/views/requirement-search-form.client.view.html',
        restrict: 'E',
        scope: false
    };
}
