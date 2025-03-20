'use strict';

angular.module('requirements').filter('ontDate', [
	function() {
		return function(input, format) {
			// Ont date filter directive logic
			// Format 	YYYY-MM-DDTHH:mm:ssZ
			// Example	2014-07-22T18:28:00Z

			// Strip "T" character
			input = input.replace(/(T|Z(.*))/g, "");
			// convert to moment.js date
			input = moment.utc(input, 'YYYY-MM-DDHH:mm:ss:SS');

			// format date using provided format, default if
			// no format provided
			input = input.format(format || 'M/D/YY h:mma');

			return input;
		};
	}
]);

angular.module('requirements').filter('ontDateFromNow', [
    function() {
        return function(input, format) {
            // Ont date filter directive logic
            // Format 	YYYY-MM-DDTHH:mm:ssZ
            // Example	2014-07-22T18:28:00Z

            // Strip "T" character
            input = input.replace(/(T|Z(.*))/g, "");
            // convert to moment.js date
            input = moment.utc(input, 'YYYY-MM-DDHH:mm:ss:SS');

            // format date using provided format, default if
            // no format provided
            input = input.fromNow();

            return input;
        };
    }
]);
