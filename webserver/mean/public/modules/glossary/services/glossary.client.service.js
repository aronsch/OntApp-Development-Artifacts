'use strict';

angular.module('glossary').factory('GlossaryEntry', glossaryentryService);
angular.module('glossary').service('GlossaryReference', glossaryReferenceService);

glossaryReferenceService.$inject = ['GlossaryEntry', 'EventsService'];
function glossaryReferenceService(GlossaryEntry, Events) {
    var glossaryReference = GlossaryEntry.list({});

    Events.glossary.onNeedsUpdate(function () {
        glossaryReference = GlossaryEntry.list({});
    });

    return glossaryReference;
}

glossaryentryService.$inject = ['$resource', '$filter', 'Authentication', 'GlossaryEntryObj'];
function glossaryentryService($resource, $filter, Authentication, GlossaryEntryObj) {
    var glossaryEntry = $resource('glossary/requirement/:name', {
        name: '@name'
    }, {
        update: {
            method: 'PUT',
            transformRequest: [setOrganizationUrl, encodeJSON]
        },
        save: {
            method: 'POST',
            transformRequest: [setOrganizationUrl, encodeJSON],
            transformResponse: [parseJSON, transformResult],
            isArray: false
        },
        list: {
            method: 'GET',
            transformResponse: [parseJSON, transformAllResults],
            isArray: true
        },
        get: {
            url: '/glossary',
            transformResponse: [parseJSON, transformResult]
        }
    });

    glossaryEntry.transformAllResults = transformAllResults;
    glossaryEntry.transformResult = transformResult;

    /*
     Request Tranformations
     */
    function setOrganizationUrl(obj) {
        obj.OrganizationURL = Authentication.user.organizationURL;
        return obj;
    }

    function encodeJSON(payload) {
        return JSON.stringify(payload);
    }

    /*
     Response Transformations
     */

    function parseJSON(data) {
        return JSON.parse(data);
    }

    function transformAllResults(data) {
        angular.forEach(data, function (item, idx) {
            data[idx] = transformResult(item);
        });
        data.grouped = $filter('groupByLetter')(data, 'Name');
        return data;
    }

    // Extend instance properties by converting them
    // into ontDisplayProperty objects
    function transformResult(data) {
        data = new GlossaryEntryObj(data);
        return data;
    }

    // return resource object
    return glossaryEntry;
}

extendedGlossary.$inject = ['GlossaryEntry'];
function extendedGlossary(GlossaryEntry) {
    this.findOneForEdit = function (name) {
        var req = GlossaryEntry.getIri({name: name});
        req.$promise.then(function (data) {
           req.$$ready = true;
        });

        return req;
    };
}
