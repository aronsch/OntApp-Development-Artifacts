'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntSearchModel', OntSearchModelFactory);

OntSearchModelFactory.$inject = ['OntPropertyGroup', 'OntSearchProperty'];
function OntSearchModelFactory (OntPropertyGroup, OntSearchProperty) {

    /**
     * Search Model
     * @param ontModelData
     * @constructor
     */
    function OntSearchModel(ontModelData) {
        var self = this;
        angular.extend(this, angular.copy(ontModelData));

        this.Properties.GeneralSearchTerm = {
            Label: 'General Search Term',
            Value: ''
        };

        if (this.Properties.SuperRequirement) {
            this.Properties.SuperRequirement.Format = 'text'
        }
        if (this.Properties.SubRequirement) {
            this.Properties.SubRequirement.Format = 'text'
        }
        if (ontModelData.Properties.RelatedRequirements) {
            delete ontModelData.Properties.RelatedRequirements;
        }
        // extend properties
        angular.forEach(this.Properties, function (p, key) {
            self.Properties[key] = new OntSearchProperty(p, key)
        });

        this.reset = function () {
            resetModelPropertyValues(this.Properties);
        };
    }

    OntSearchModel.prototype.isDirty = function () {
        return _(this.Properties).any(function (p) {
            return p.$$dirty === true
        });
    };

    return OntSearchModel;
}



