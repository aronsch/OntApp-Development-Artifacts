'use strict';

(function () {
	angular.module('requirements').directive('buttonSimilar', buttonSimilar);
    angular.module('requirements').controller('findSimilarController', findSimilarController);

    function buttonSimilar() {
        return {
            restrict: 'E',
            templateUrl: 'modules/requirements/views/button-similar.client.view.html',
            controller: 'findSimilarController',
            require: '^^requirement'
        };
    }

    findSimilarController.$inject = ['$scope', 'Requirement', 'RequirementModal'];
    function findSimilarController ($scope, Requirement, RequirementModal) {
        $scope.findSimilar = findSimilar;
        $scope.openRequirementModal = openRequirementModal;

        function findSimilar(requirement) {
            $scope.similar = [];
            $scope.similar = Requirement.getSimilar(angular.copy(requirement));
        }

        function openRequirementModal(name) {
            RequirementModal.openModal(name);
        }
    }
})();

