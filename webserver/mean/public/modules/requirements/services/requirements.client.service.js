'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('Requirement', requirementService);
angular.module('requirements').service('extendedRequirements', extendedRequirements);

requirementService.$inject = ['$resource', 'Authentication', 'moduleSettings', 'AnalysisResponse', 'ViewModels', 'OntPropertyGroup', '$log', 'EventsService'];
function requirementService($resource, Authentication, settings, AnalysisResponse, ViewModels, OntPropertyGroup, $log, EventsService) {
    var requirementResource = $resource('api/requirements/:name', {
        name: '@_namePath'
    }, {
        update: {
            method: 'PUT',
            transformRequest: [settings.transformForTransport, encodeJSON],
            transformResponse: [parseJSON, transformResult, emitGlossaryUpdateNeeded]
        },
        save: {
            method: 'POST',
            transformRequest: [settings.transformForTransport, encodeJSON],
            transformResponse: [parseJSON, transformResult, emitGlossaryUpdateNeeded]
        },
        query: {
            method: 'POST',
            url: 'api/search',
            transformRequest: [settings.transformForTransport, encodeJSON],
            transformResponse: [parseJSON, transformAllResults],
            isArray: true
        },
        get: {
            url: 'api/requirements/',
            transformResponse: [parseJSON, transformResult]
        },
        getIri: {
            transformResponse: [parseJSON, transformResult],
            isArray: false
        },
        analyze: {
            method: 'POST',
            url: 'api/analyze',
            transformRequest: [settings.transformForTransport, encodeJSON],
            transformResponse: [parseJSON, transformAnalysis]
        },
        getSimilar: {
            method: 'POST',
            url: 'api/similar',
            transformRequest: [settings.transformForTransport, encodeJSON],
            transformResponse: [parseJSON, transformAllResults],
            isArray: true
        },
        lock: {
            method: 'POST',
            url: 'api/requirements/lock/:name',
            transformResponse: [parseJSON, transformResult]
        }
    });

    /*
     Request Tranformations
     */

    function setOrganizationUrl(formModel) {
        formModel.OrganizationURL = Authentication.user.organizationURL;
        return formModel;
    }

    function encodeJSON(payload) {
        return JSON.stringify(payload);
    }


    /*
     Response Transformations
     */

    function parseJSON(data, headerFn, status) {
        try {
            if (status === 200) {
                return JSON.parse(data);
            } else {
                return data;
            }
        } catch (e) {
            $log.error(
                'Invalid response from server\r\n', e, '\r\n\r\n',
                'Invalid response data:\r\n;', data
            );
        }
    }

    function transformAllResults(data, headerFn, status) {
        if (status === 200 && _.isArray(data)) {
            _.each(data, transformResult);
            _.each(data, ViewModels.extendForDisplay);
        }

        return data;
    }


    // Extend instance properties by converting them
    // into ontDisplayProperty objects
    function transformResult(data, header, status) {
        if (!angular.isNumber(status) || status === 200) {
            data.Properties = new OntPropertyGroup(data.Properties);
            data._namePath = data.Properties.namePath();
        }
        if (angular.isDefined(data.Active)) {
            data.Active = JSON.parse(data.Active);
            console.log(data);
        }
        return data;
    }

    function transformAnalysis(data) {
        return new AnalysisResponse(data);
    }

    /**
     * Passthrough: emit Glossary Update Needed event
     * @param data
     * @returns {*}
     */
    function emitGlossaryUpdateNeeded(data) {
        EventsService.glossary.needsUpdate();
        return data;
    }

    // return resource object
    return requirementResource;
}

// TODO: fold this into first Requirement resource service, make it the interface
extendedRequirements.$inject = ['ViewModels', 'Requirement'];
function extendedRequirements(ViewModels, Requirement) {

    this.findOneForEdit = function (name, callback) {
        var req = Requirement.getIri({name: name, forEditing: true});
        req.$promise.then(function (data) {
            ViewModels.promise.then(function () {
                ViewModels.edit.extendInstance(data);
                req.$$ready = true;
            });
        });

        return req;
    };

    this.findOneForDisplay = function (name) {
        var req = Requirement.getIri({name: name});
        req.$promise.then(function (data) {
            ViewModels.promise.then(function () {
                ViewModels.display.extendInstance(data);
                req.$$ready = true;
            });
        });

        return req;
    };

    this.getAll = function () {
        return this.findForDisplay({GeneralSearchTerm: ''});
    };

    this.findForDisplay = function (searchProperties) {
        var req = Requirement.query('', searchProperties);
        req.$promise.then(function (data) {
            angular.forEach(data, function (item) {
                ViewModels.promise.then(function () {
                    ViewModels.display.extendInstance(data);
                    req.$$ready = true;
                });
            });
        });

        return req;
    };

    this.newRequirement = function () {
        var req = new Requirement;

        ViewModels.promise.then(function () {
            // Extend requirement resource with ViewModel
            ViewModels.create.extendInstance(req);
            req = angular.extend(req, ViewModels.create);
            req.$$ready = true;
        });

        return req;
    };

    this.extendForDisplay = function (req) {
        ViewModels.promise.then(function () {
            ViewModels.display.extendInstance(req);
            req.$$ready = true;
        });
    }


}