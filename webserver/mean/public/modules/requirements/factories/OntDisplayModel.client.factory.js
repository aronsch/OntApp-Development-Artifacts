'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntDisplayModel', OntDisplayModelFactory);

OntDisplayModelFactory.$inject = ['OntPropertyGroup'];
function OntDisplayModelFactory (OntPropertyGroup) {

    /*
     Display Model
     */
    function OntDisplayModel(ontModelData) {

        //angular.forEach(self.Properties, propertyDisplaySettings);
        ontModelData.Properties = OntPropertyGroup(ontModelData.Properties);

        ontModelData.extendInstance = function (target) {
            angular.forEach(target.Properties, propertyDisplaySettings);
            angular.forEach(this.Properties, extendProperties);

            // using properties from the display model,
            // extend an instance of a Requirement
            function extendProperties(p, key) {
                var targetP = target.Properties[key];
                if (angular.isUndefined(targetP)) {
                    target.Properties[key] = p;
                } else {
                    angular.forEach(p, function (item, key) {
                        if (angular.isUndefined(targetP[key])) {
                            targetP[key] = item;
                        }
                    });
                }
            }
        };
    }

    /**
     * DisplayModel Property Settings
     * Sets properties used to hint at UI presentation and layout.
     * @param p
     */
    function propertyDisplaySettings(p) {
        if (p.Label == 'Name' || p.Label == 'Description') {
            p.$$alwaysDisplay = true;
            p.$$isDetailProperty = false;
        } else {
            p.$$alwaysDisplay = false;
            p.$$isDetailProperty = true;
        }
    }

    return OntDisplayModel;
}



