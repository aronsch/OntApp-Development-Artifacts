'use strict';

(function () {
	angular.module('requirements').directive('requirementInlineSearch', requirementInlineSearch);

	function requirementInlineSearch() {
		return {
			restrict: 'E',
			templateUrl: 'modules/requirements/views/requirement-inline-search.client.view.html'
		};
	}
})();

