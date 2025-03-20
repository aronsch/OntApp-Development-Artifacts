'use strict';

(function () {
	angular.module('requirements').directive('buttonAnalyze', buttonAnalyze);

	function buttonAnalyze() {
		return {
			restrict: 'E',
            controller: 'AnalyzeController',
            require: '^^requirement',
			templateUrl: 'modules/requirements/views/button-analyze.client.view.html'
		};
	}
})();

