'use strict';

(function () {
	angular.module('requirements').directive('requirement', requirement);

    /**
     * Directive that attaches an instance of RequirementController. Encapsulating this in
     * a directive allows child directives to require it.
     * @returns {{restrict: string, controller: string}}
     */
	function requirement() {
		return {
			restrict: 'A',
            controller: 'RequirementController'
		};
	}
})();

