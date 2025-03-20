'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntDisplayProperty', OntDisplayPropertyFactory);

OntDisplayPropertyFactory.$inject = ['OntProperty'];
function OntDisplayPropertyFactory (OntProperty) {

    /**
     * Display Property prototype
     * Inherits from OntProperty
     * @param p
     * @constructor
     */
    function OntDisplayProperty(p, key) {
        OntProperty.call(this, p, key);
        propertyDisplaySettings(this);
    }

    OntDisplayProperty.prototype = new OntProperty();

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

    return OntDisplayProperty;
}



