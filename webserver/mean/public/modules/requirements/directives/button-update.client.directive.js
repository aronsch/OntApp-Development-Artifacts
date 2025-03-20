'use strict';

(function () {
	angular.module('requirements').directive('buttonUpdate', buttonUpdate);

	function buttonUpdate() {
		return {
			restrict: 'E',
			templateUrl: 'modules/requirements/views/button-update.client.view.html',
            require: '^^requirement'
		};
	}
})();

