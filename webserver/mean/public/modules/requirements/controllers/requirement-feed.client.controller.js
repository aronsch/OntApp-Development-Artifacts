'use strict';

// Requirement controller
angular.module('requirements').controller('RequirementFeedController', RequirementFeedController);

RequirementFeedController.$inject = ['$scope', '$stateParams', '$location', 'Authentication',
    'Requirement', 'RequirementModal', 'moduleSettings',
    'extendedRequirements', '$filter', 'openRequirement'];
function RequirementFeedController($scope, $stateParams, $location, Authentication,
    Requirement, RequirementModal, moduleSettings,
    extendedRequirements, $filter, openRequirement) {

    $scope.authentication = Authentication;

    $scope.requirements = extendedRequirements.getAll();

    $scope.sortedByLastActivity = function () {
        return _.sortBy($scope.requirements, function (r) {
            return r.Properties.modifiedDate();
        }).reverse();
    };

    $scope.open = function (name) {
        openRequirement(name);
    };

    return $scope;

}
