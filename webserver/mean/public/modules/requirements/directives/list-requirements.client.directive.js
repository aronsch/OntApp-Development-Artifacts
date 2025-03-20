'use strict';

(function () {
	angular.module('requirements').directive('listRequirementsSmall', listRequirementsSmall);
	listRequirementsSmall.$inject = ['$filter'];
	function listRequirementsSmall($filter) {
		return {
			restrict: 'E',
			templateUrl: 'modules/requirements/views/list-requirements-small.client.view.html',
			controller: 'SearchController'
		};
	}
})();

