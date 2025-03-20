'use strict';

angular.module('requirements').directive('requirementAnalysis', requirementAnalysis);

requirementAnalysis.$inject = [];
function requirementAnalysis() {

	return {
		restrict: 'E',
		templateUrl: 'modules/requirements/views/requirement-analysis.client.view.html'
	};
}
