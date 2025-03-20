'use strict';

angular.module('shared').service('openRequirement', openRequirementService);

openRequirementService.$inject = ['$location', '$filter'];
function openRequirementService($location, $filter) {

    return function open(name, params) {
        $location.path('/requirements/' + $filter('namePathFormat')(name));
        if (params) $location.search(params.param, params.value);
    }

}
