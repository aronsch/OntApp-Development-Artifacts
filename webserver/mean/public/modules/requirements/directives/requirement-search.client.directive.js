'use strict';

(function () {
	angular.module('requirements').directive('requirementSearch', requirementSearch);

    /**
     * Directive that attaches an instance of SearchController. Encapsulating this in
     * a directive allows child directives to require it.
     * @returns {{restrict: string, controller: string}}
     */
	function requirementSearch() {
		return {
			restrict: 'A',
            controller: 'SearchController'
		};
	}
})();

