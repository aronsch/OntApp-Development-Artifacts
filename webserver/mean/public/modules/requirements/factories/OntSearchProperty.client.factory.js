'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntSearchProperty', OntSearchPropertyFactory);

OntSearchPropertyFactory.$inject = ['OntProperty'];
function OntSearchPropertyFactory (OntProperty) {

    /**
     * Search Property
     * Inherits from OntProperty
     * @param p
     * @constructor
     */
    function OntSearchProperty(p, key) {
        OntProperty.call(this, p, key);
        propertySearchSettings(this);

        // init Value as array for multiselect
        if (this.isMultiselect()) this.Value = [];
        if (this.hasDefaultValue()) {
            this.Value = this.defaultValue();
        }

    }

    OntSearchProperty.prototype = new OntProperty();

    OntSearchProperty.prototype.resetValue = function resetValue() {
        this.IRI = '';
        this.Value = this.isMultiselect() ? [] : '';
    };

    OntSearchProperty.prototype.isMultiselect = function isMultiselect() {
        return this.hasEnumeration() && !this.isSingleSelect();
    };

    OntSearchProperty.prototype.isSingleSelect = function isSingleSelect() {
        return this.hasEnumeration() &&
            (/(super|sub)\s?requirement/i.test(this.Label) || /author/i.test(this.Label));
    };

    OntSearchProperty.prototype.isEnumItemSelected = function isEnumItemSelected(item) {
        if (this.isSingleSelect()) {
            return item === this.Value;
        } else if (this.isMultiselect()) {
            return _.contains(this.Value.map(function (v) {return v.Label}), item.Label);
        }
    };

    OntSearchProperty.prototype.toggleEnumItemSelected = function toggleEnumItemSelected(item) {
        if (_.contains(this.Value, item)) {
            this.Value = _.without(this.Value, item);
        } else {
            this.Value.push(item);
        }
    };

    /**
     * SearchModel Property Settings
     * Sets properties used to hint at UI presentation and layout.
     * @param p
     */
    function propertySearchSettings(p) {
        p.$$searchable = true; // TODO: am I using this?
        if (_.contains(['Name', 'Description', 'Comment', 'Glossary', 'Search Term'], p.Label)) {
            p.$$alwaysDisplay = false;
            p.$$isDetailProperty = false;
        } else {
            p.$$alwaysDisplay = false;
            p.$$isDetailProperty = true;
        }
    }

    return OntSearchProperty;
}



