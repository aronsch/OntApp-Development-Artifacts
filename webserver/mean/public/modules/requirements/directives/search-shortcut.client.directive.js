'use strict';

angular.module('requirements').directive('searchShortcut', searchShortcut);

// Add functions and model allowing you to jump to search page with search term already entered
searchShortcut.$inject = ['$location', '$window'];
function searchShortcut($location, $window) {
    return {
        restrict: 'A',
        link: function postLink(scope) {
            scope.searchTerm = '';
            scope.searchWithTerm = function () {
                // browse to Search
                $window.location = scope.searchPath();
            };
            scope.searchPath = function () {
                return '#!/search' + (scope.searchTerm.length ? '?term=' + scope.searchTerm : '?searchAll=true');
            }
        }
    }
}
