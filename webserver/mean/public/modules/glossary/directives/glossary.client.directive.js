'use strict';

(function () {
	angular.module('glossary').directive('glossary', glossary);
    glossary.$inject = [];
	function glossary() {
		return {
			restrict: 'E',
			templateUrl: 'modules/glossary/views/glossary.client.view.html',
            scope: true,
			controller: 'GlossaryController'
		};
	}
})();

