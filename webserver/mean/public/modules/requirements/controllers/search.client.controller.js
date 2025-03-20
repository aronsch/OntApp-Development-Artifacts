'use strict';

// Requirements Search controller
angular.module('requirements').controller('SearchController', SearchController);

SearchController.$inject = ['$scope', '$location', 'Authentication',
    'SearchState', 'moduleSettings', 'RequirementModal'];
function SearchController($scope, $location, Authentication,
                          SearchState, settings, RequirementModal) {

    $scope.authentication = Authentication;
    // Search state manager setup
    $scope.searchState = SearchState.register($scope.searchName || 'searchPage', $location.search().term);
    $scope.glossary = $scope.searchState.glossary;
    $scope.$watch('searchState.error', function (error) {
        $scope.error = error;
    });
    $scope.$watch('searchState.form.$dirty', function ($dirty) {
        if ($dirty) {
            $scope.searchState.searchModel.current = false;
        }
    });

    if($location.search().searchAll) {
        $scope.searchState.search();
    }

    // Controller scope state
    $scope.settings = settings;

    $scope.resetSearch = resetSearch;
    $scope.openRequirementModal = openRequirementModal;
    $scope.escape = escape;

    function resetSearch() {
        $scope.searchState.resetAll();
        $scope.searchState.form.$setPristine();
    }


    /**
     * Open a requirement in a modal popover.
     * @param iri
     * @param name
     */
    function openRequirementModal(iri, name) {
        RequirementModal.openModal(iri, name);
    }

    /**
     * Browse to the specified IRI.
     * @param iri
     */
    function openIRI(iri) {
        $location.search({iri: iri});
        $location.path('/requirements/iri');
    }

    function escape(input) {
        return window.encodeURIComponent(input);
    }

    return $scope; // return scope object so child directives can interface
}
