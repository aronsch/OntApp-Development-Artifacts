'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').service('ViewModels', ViewModels);
angular.module('requirements').factory('RequirementModel', RequirementModelFactory);
angular.module('requirements').factory('SearchFormModel', SearchFormModelFactory);

ViewModels.$inject = ['$q', '$http', '$rootScope', 'moduleSettings', 'Authentication', 'OntPropertyGroup', 'OntSearchModel',
    'RequirementModel', 'SearchFormModel'];
function ViewModels($q, $http, $rootScope, settings, Authentication, OntPropertyGroup, OntSearchModel, RequirementModel, SearchFormModel) {
    var self = this,
        reqSettings = requestSettings();

    this.display = {};
    this.edit = {};
    this.create = {};
    this.search = {};
    this.subtypes = {};
    this.resolved = false;

    reload(); // load models on start

    $rootScope.$on('user-login', reload); // load models on authentication

    this.reload = reload;

    /**
     * Trigger reload of all view models
     * @return Promise
     */
    function reload() {
        if (!Authentication.user) return;

        self.promise = $q.all(
            [
                $http(reqSettings.displayModel).then(function (res) {
                    self.display = res.data
                }),
                $http(reqSettings.editModel).then(function (res) {
                    self.edit = res.data
                }),
                $http(reqSettings.createModel).then(function (res) {
                    self.create = res.data
                }),
                $http(reqSettings.searchModel).then(function (res) {
                    self.search = res.data
                }),
                $http(reqSettings.subtypes).then(function (res) {
                    self.subtypes = res.data;
                    self.subtypes._ready = true;
                })
            ]
        );

        self.promise.then(function () {
            self.resolved = true;
        });

        return self.promise;
    }

    this.extendForDisplay = extendForDisplay;
    /**
     * For a single requirement, extend displayed properties with any missing property keys
     * @param requirement
     */
    function extendForDisplay(requirement) {
        self.promise.then(function () {
            requirement.Properties.extendWithDisplayModel(self.display);
        });
    }

    this.newSearchModel = newSearchModel;

    function newSearchModel() {
        return new OntSearchModel(this.search);
    }

    // Extend instance properties by converting them
    // into ontDisplayProperty objects
    function transformResult(data) {
        data.Properties = new OntPropertyGroup(data.Properties);

        return data;
    }

    function transformDisplayModel(data) {
        data.Properties = new OntPropertyGroup(data.Properties);
        return data;
    }

    function transformSearchModel(data) {
        return new OntSearchModel(data);
    }

    function parseJSON(data) {
        return JSON.parse(data);
    }

    function setResolved(data) {
        data.$resolved = true;
        return data;
    }

    /**
     * Replace with Requirement Model object
     * @param data
     * @returns {*}
     */
    function modelConvert(data) {
        return new RequirementModel(data);
    }

    function searchModelConvert(data) {
        return new SearchFormModel(data);
    }

    function requestSettings() {
        var extended = angular.copy(settings.modelReqSettings);

        extended.displayModel.transformResponse = [parseJSON, transformDisplayModel, modelConvert, setResolved];
        extended.createModel.transformResponse = [parseJSON, transformDisplayModel, modelConvert, setResolved];
        extended.editModel.transformResponse = [parseJSON, transformDisplayModel, modelConvert, setResolved];
        extended.searchModel.transformResponse = [parseJSON, transformSearchModel, searchModelConvert, setResolved];

        return extended;
    }
}

RequirementModelFactory.$inject = ['OntPropertyGroup'];
function RequirementModelFactory(OntPropertyGroup) {

    function RequirementModel(ontModelData) {
        angular.extend(this, ontModelData);
        this.Properties = new OntPropertyGroup(ontModelData.Properties);
    }

    RequirementModel.prototype.extendInstance = function extendInstance(target) {

        // If target has already been extended by model, return
        if (target.$$ready) return;

        // Extend instance with model
        if (angular.isUndefined(target.Properties)) {
            target.Properties = angular.copy(this.Properties);
            return;
        }
        angular.forEach(this.Properties, extendProperties);

        // set ready state
        target.$$ready = true;

        // using properties from the display model,
        // extend an instance of a Requirement
        function extendProperties(p, key) {
            var targetP = target.Properties[key], val;

            if (angular.isUndefined(targetP)) {
                targetP = target.Properties[key] = p;
            } else {
                //val = targetP.Value;
                //angular.merge(targetP, p);
                //targetP.Value = val;
                angular.forEach(p, function(item, key) {
                    if (angular.isUndefined(targetP[key])) {
                        targetP[key] = item;
                    }
                });
            }

            // If property with enumerated options is returned with string as value,
            // set corresponding option object to value
            if (targetP.hasEnumeration() && angular.isString(targetP.Value) && key !== 'RelatedRequirements') {
                angular.forEach(targetP.Enum, function (e) {
                    if (e.Label === targetP.Value) {
                        targetP.Value = e;
                    }
                });
            }
        }
    };

    return RequirementModel;
}

SearchFormModelFactory.$inject = ['RequirementModel', 'OntSearchProperty'];
function SearchFormModelFactory(RequirementModel, OntSearchProperty) {
    function SearchFormModel(ontModelData) {

        if (angular.isUndefined(ontModelData.Properties.GeneralSearchTerm)) {
            ontModelData.Properties.GeneralSearchTerm = {
                Label: 'Search Term',
                Value: '',
                $$alwaysDisplay: true
            }
        }

        // Subclass/inherits from RequirementModel
        RequirementModel.call(this, ontModelData);

        _.mapObject(this.Properties, function (p) {
           return new OntSearchProperty(p);
        });

    }

    return SearchFormModel;
}
