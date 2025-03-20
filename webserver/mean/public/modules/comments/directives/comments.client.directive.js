'use strict';

(function () {
	angular.module('comments').directive('comments', comments);
    comments.$inject = [];
	function comments() {
		return {
			restrict: 'E',
			templateUrl: 'modules/comments/views/comments.client.view.html',
            scope: {
			    requirement: '='
            },
			controller: 'CommentsController'
		};
	}
})();

