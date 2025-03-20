'use strict';

(function () {
	angular.module('requirements').directive('relatedListInteractive', relatedListInteractive);

	function relatedListInteractive() {
		return {
			restrict: 'E',
            templateUrl: 'modules/requirements/views/related-list-interactive.client.view.html'
		};
	}
})();

