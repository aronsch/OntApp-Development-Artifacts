'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('AnalysisResponse', AnalysisResponseFactory);

AnalysisResponseFactory.$inject = [];
function AnalysisResponseFactory() {

    /*
     Display Model
     */
    function AnalysisResponse(response) {
        this.analyzed = true;
        this.issues = response;
        this.dismissed = false;
        // check if response is empty object
        // if response is *not* empty, issues exist
        this.hasIssues = !angular.equals(response, {});
    }

    return AnalysisResponse;
}



