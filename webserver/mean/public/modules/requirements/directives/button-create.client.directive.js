'use strict';

(function () {
	angular.module('requirements').directive('buttonCreate', buttonCreate);

	function buttonCreate() {
		return {
			restrict: 'E',
			templateUrl: 'modules/requirements/views/button-create.client.view.html',
            require: '^^requirement'
		};
	}
})();

