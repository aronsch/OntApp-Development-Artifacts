'use strict';

// Requirements Search controller
angular.module('requirements').controller('InterrogateController', InterrogateController);

InterrogateController.$inject = ['$scope', '$stateParams', 'extendedRequirements', 'moduleSettings', 'ViewModels',
    'Requirement', '$filter'];
function InterrogateController($scope, $stateParams, requirements, settings, ViewModels, Requirement, $filter) {
    $scope.requirement = undefined;
    $scope.searchEnabled = angular.isUndefined($stateParams.name);
    $scope.showSearch = true;
    $scope.pickerVisible = false;
    $scope.state = $stateParams;
    $scope.settings = settings;
    $scope.getRelated = getRelated;

    ViewModels.promise.then(function () {
        $scope.subtypes = ViewModels.subtypes
    });

    $scope.addRelatedRequirement = addRelatedRequirement;

    if ($stateParams.name) setReqName($stateParams.name);

    $scope.setReqName = setReqName;
    $scope.colSize = colClasses;
    $scope.showPicker = function () {
        $scope.showPicker = true
    };
    $scope.hidePicker = function () {
        $scope.showPicker = false
    };

    /**
     * Request any related requirements that are attached to the current requirement
     * @returns {*|{url, transformResponse, isArray}}
     */
    function getRelated() {
        angular.forEach($scope.requirement.Properties.RelatedRequirements.Value, function (related) {
            Requirement.getIri({name: $filter('namePathFormat')(related.Label)}).$promise.then(function (req) {
                related.Properties = req.Properties;
            });
        });
    }

    function setReqName(name) {
        if (name === $scope.name) return;

        $scope.name = name;
        $scope.showSearch = false;
        $scope.requirement = requirements.findOneForDisplay(name);
    }

    /**
     * Add related requirement and update backend.
     * @param added
     * @param relation
     * @param subtype
     */
    function addRelatedRequirement(added, relation, subtype) {
        $scope.requirement.Properties.addRelatedRequirement(added, relation, subtype);
    }

    function handleReqChange(newName, oldName) {
        if (newName !== oldName && newName.length) {
            setReqName(newName)
        }
    }

    function handleDirty(dirty) {
        if (!dirty) return;

        if ($scope.saving || !$scope.requirement.$resolved) {
            // defer next update if save in progress
            $scope.requirement.$promise.then(function () {
                handleDirty(true);
            });
        } else if ($scope.requirement
            && $scope.requirement.$$ready
            && !$scope.saving) {
            $scope.saving = true;
            $scope.requirement.$update({}, function (data) {
                if (!data.error) {
                    $scope.$$ready = false;
                    requirements.extendForDisplay($scope.requirement);
                    $scope.requirement.Properties.clean();
                } else {
                    $scope.error = data.error;
                }
                $scope.saving = false;
            }, function () {
                $scope.error = 'Could not save changes.'
                $scope.saving = false;
            });
        }
    }


    function arraysEqual(a, b) {
        // http://stackoverflow.com/a/16436975
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function colClasses() {
        var cols = {search: '', content: '', picker: ''};

        if (!$scope.searchEnabled && !$scope.pickerVisible) {
            // requirement specified, picker hidden
            cols.search = 'hidden-xs hidden-sm hidden-md hidden-lg';
            cols.content = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
            cols.picker = 'hidden-xs hidden-sm hidden-md hidden-lg';
        } else if (!$scope.searchEnabled && $scope.pickerVisible) {
            // requirement specified, picker visible
            cols.search = 'hidden-xs hidden-sm hidden-md hidden-lg';
            cols.content = 'hidden-xs col-sm-8 col-md-8 col-lg-10';
            cols.picker = 'col-xs-12 col-sm-4 col-md-4 col-lg-2';
        } else if (!$scope.requirement && $scope.searchEnabled
            && $scope.showSearch && !$scope.pickerVisible) {
            // requirement NOT specified and not yet searched,
            // search expanded and picker hidden
            cols.search = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
            cols.content = 'hidden-xs hidden-sm hidden-md hidden-lg';
            cols.picker = 'hidden-xs hidden-sm hidden-md hidden-lg';
        } else if ($scope.searchEnabled && $scope.showSearch && !$scope.pickerVisible) {
            // requirement NOT specified, search expanded and picker hidden
            cols.search = 'col-xs-12 col-sm-4 col-md-4 col-lg-2';
            cols.content = 'hidden-xs col-sm-8 col-md-8 col-lg-10';
            cols.picker = 'hidden-xs hidden-sm hidden-md hidden-lg';
        } else if ($scope.searchEnabled && !$scope.showSearch && !$scope.pickerVisible) {
            // requirement NOT specified, search collapsed and picker hidden
            cols.search = 'col-xs-12 col-sm-2 col-md-2 col-lg-2';
            cols.content = 'col-xs-12 col-sm-10 col-md-10 col-lg-10';
            cols.picker = 'hidden-xs hidden-sm hidden-md hidden-lg';
        } else if ($scope.searchEnabled && !$scope.showSearch && $scope.pickerVisible) {
            // requirement NOT specified, search collapsed and picker hidden
            cols.search = 'col-xs-12 col-sm-2 col-md-2 col-lg-2';
            cols.content = 'hidden-xs col-sm-6 col-md-6 col-lg-6';
            cols.picker = 'col-xs-12 col-sm-4 col-md-4 col-lg-4';
        } else if ($scope.searchEnabled && $scope.showSearch && $scope.pickerVisible) {
            // requirement NOT specified, search collapsed and picker hidden
            cols.search = 'col-xs-12 col-sm-4 col-md-4 col-lg-4';
            cols.content = 'hidden-xs col-sm-8 col-md-4 col-lg-4';
            cols.picker = 'hidden-xs hidden-sm col-md-4 col-lg-4';
        }


        return cols;
    }

    $scope.$watch('name', handleReqChange);
    $scope.$watch('state.name', handleReqChange);
    $scope.$watch('requirement.Properties._dirty', handleDirty);


    return $scope;
}
