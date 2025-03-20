'use strict';

(function () {
	angular.module('requirements').directive('searchInline', searchInline);

    function searchInline() {
        return {
            restrict: 'E',
            controller: 'SearchController',
            scope: {
                resultSelectAction: '='
            },
            templateUrl: 'modules/requirements/views/search-inline.client.view.html',
            link: function postLink(scope, element, attrs, interrogateCtrl) {
                scope.searchName = 'inlineSearch';
            }
        };
    }
})();

