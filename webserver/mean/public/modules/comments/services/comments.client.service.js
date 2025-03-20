'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('comments').factory('Comment', commentService);

// TODO: refactor away from Service
commentService.$inject = ['$resource', 'Authentication', 'CommentObj'];
function commentService($resource, Authentication, CommentObj) {
    var commentResource = $resource('comments/requirement/:name', {
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
            url: '/comments',
            transformResponse: [parseJSON, transformResult]
        }
    });

    commentResource.transformAllResults = transformAllResults;
    commentResource.transformResult = transformResult;

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
        return data;
    }

    // Extend instance properties by converting them
    // into ontDisplayProperty objects
    function transformResult(data) {
        data = new CommentObj(data);
        return data;
    }

    // return resource object
    return commentResource;
}
