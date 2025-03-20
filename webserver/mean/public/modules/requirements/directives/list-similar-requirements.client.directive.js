'use strict';

(function () {
	angular.module('requirements').directive('listSimilarRequirements', listSimilarRequirements);

	function listSimilarRequirements() {
		return {
			restrict: 'E',
			templateUrl: 'modules/requirements/views/list-similar-requirements.client.view.html',
            controller: 'findSimilarController',
            require: '^^requirement'
		};
	}
})();

