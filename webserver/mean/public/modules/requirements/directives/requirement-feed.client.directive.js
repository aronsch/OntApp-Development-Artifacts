'use strict';

(function () {
    angular.module('requirements').directive('requirementFeed', requirementFeed);

    function requirementFeed() {
        return {
            restrict: 'E',
            controller: 'RequirementFeedController',
            templateUrl: 'modules/requirements/views/requirement-feed.client.view.html'
        };
    }
})();

