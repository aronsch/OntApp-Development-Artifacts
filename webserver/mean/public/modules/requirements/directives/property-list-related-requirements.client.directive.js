'use strict';

angular.module('requirements').directive('propertyListRelatedRequirements', propertyListRelatedRequirements);

propertyListRelatedRequirements.$inject = [];
function propertyListRelatedRequirements() {

	return {
		restrict: 'E',
		templateUrl: 'modules/requirements/views/property-list-related-requirements.client.view.html'
	};
}
