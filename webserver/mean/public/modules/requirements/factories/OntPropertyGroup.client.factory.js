'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntPropertyGroup', OntPropertyGroupFactory);

OntPropertyGroupFactory.$inject = ['OntDisplayProperty', '$filter'];
function OntPropertyGroupFactory(OntDisplayProperty, $filter) {

    /**
     * PropertyGroup objects extends `Property` object from Ontology.
     * @param propObj
     * @constructor
     */
    function OntPropertyGroup(propObj) {
        angular.forEach(propObj, function (p, key) {
            this[key] = new OntDisplayProperty(p, key);
            this[key].$$key = key;
        }, this);

        // make sure RelatedRequirement values is an array.
        if (angular.isDefined(this.RelatedRequirements) && !angular.isArray(this.RelatedRequirements.Value)) {
            this.RelatedRequirements.Value = [];
        }
    }

    /**
     *
     * @param model
     */
    OntPropertyGroup.prototype.extendWithDisplayModel = function (model) {
        angular.forEach(this, propertyDisplaySettings, this);
        angular.forEach(model.Properties, extendProperties, this);

        // using properties from the display model,
        // extend an instance of a Requirement
        function extendProperties(p, key) {
            var targetP = this[key];
            if (angular.isUndefined(targetP)) {
                this[key] = p;
            } else {
                angular.forEach(p, function (item, key) {
                    if (angular.isUndefined(targetP[key])) {
                        targetP[key] = item;
                    }
                });
            }
        }
    };

    OntPropertyGroup.prototype.sortedByLabel = function sortedByLabel() {
        return _.sortBy(this, 'Label');
    };

    OntPropertyGroup.prototype.detailsSortedByLabel = function sortedByLabel() {
        return _.sortBy(this.secondaryProperties(false, true), 'Label')
    };

    OntPropertyGroup.prototype.modified = function () {
        return this.LastModified && this.LastModified.Value !== this.CreatedDateTime.Value;
    };

    OntPropertyGroup.prototype.modifiedDate = function () {
        return this.LastModified ? this.LastModified.Value : this.CreatedDateTime.Value;
    };

    OntPropertyGroup.prototype.modifiedDateString = function () {
        return this.LastModified ? this.LastModified.toString() : this.CreatedDateTime.toString();
    };

    OntPropertyGroup.prototype.modifiedDateDesc = function () {
        return $filter('ontDateFromNow')(this.modifiedDate());
    };

// Requirement static content visibility
    OntPropertyGroup.prototype.showProperties = false;
    OntPropertyGroup.prototype.toggleProperties = function () {
        this.showProperties = !this.showProperties;
    };
    OntPropertyGroup.prototype.showRelated = false;
    OntPropertyGroup.prototype.toggleRelated = function () {
        this.showRelated = !this.showRelated;
    };

    OntPropertyGroup.prototype.showDescription = false;
    OntPropertyGroup.prototype.toggleDescription = function () {
        this.showDescription = !this.showDescription;
    };

    OntPropertyGroup.prototype.hasName = function () {
        return this.Name.Value.length;
    };

    OntPropertyGroup.prototype.hasDescription = function () {
        return this.Description.Value.length;
    };

    OntPropertyGroup.prototype.canAnalyze = function () {
        return this.hasDescription();
    };

    OntPropertyGroup.prototype.canFindSimilar = function () {
        return this.hasName() && this.hasDescription();
    };


    OntPropertyGroup.prototype.isValid = function () {
        return this.hasName() && this.hasDescription();
    };

    OntPropertyGroup.prototype.namePath = function () {
        return $filter('namePathFormat')(this.Name.Value);
    };

    /**
     * Return array of comments
     * @returns {Array}
     */
    OntPropertyGroup.prototype.comments = function () {
        return this.Comments ? this.Comments.Value : [];
    };

    /**
     * Return comment count
     * @returns {Number}
     */
    OntPropertyGroup.prototype.commentCount = function () {
        return this.comments().length;
    };

    OntPropertyGroup.prototype.toggleComments = function () {
        this.showComments = !this.showComments;
    };

    OntPropertyGroup.prototype.showComments = false;


    /**
     * Returns an array of the Requirements super/parent requirements
     * @returns {Array}
     */
    OntPropertyGroup.prototype.superRequirement = function () {
        if (angular.isDefined(this.SuperRequirement)) {
            return this.SuperRequirement;
        }
    };

    /**
     * Returns an array of the Requirements super/parent requirements
     * TODO: confirm that there will never be more than one super-requirement, then remove this
     * @returns {Array}
     */
    OntPropertyGroup.prototype.superRequirements = function () {
        if (angular.isDefined(this.RelatedRequirements)) {
            // return array elements where Relation key value is "SuperRequirement"
            return _.where(this.RelatedRequirements.Value, {Relation: 'SuperRequirement'});
        } else {
            // if the RelatedRequirements key is not defined, return empty array
            return [];
        }
    };

    /**
     * Returns an array of Requirement's sub-requirements
     * @returns {Array}
     */
    OntPropertyGroup.prototype.subRequirements = function () {
        if (angular.isDefined(this.RelatedRequirements)) {
            // return array elements where Relation key value is "SubRequirement"
            return _.where(this.RelatedRequirements.Value, {Relation: 'SubRequirement'});
        } else {
            // if the RelatedRequirements key is not defined, return empty array
            return [];
        }
    };

    /**
     * Returns an array of Requirement's sub-requirements with the provided subtype
     * @param subtype {String}
     * @returns {Array}
     */
    OntPropertyGroup.prototype.subRequirementsWithSubtype = function (subtype) {
        if (angular.isDefined(this.RelatedRequirements)) {
            // return array elements where Relation key value is "SubRequirement"
            return _.where(this.RelatedRequirements.Value, {Relation: 'SubRequirement', Subtype: subtype});
        } else {
            // if the RelatedRequirements key is not defined, return empty array
            return [];
        }
    };

    /**
     * Returns an array of Requirement's sub-requirements that have no subtype defined.
     * @returns {Array}
     */
    OntPropertyGroup.prototype.subRequirementsWithoutSubtype = function () {
        if (angular.isDefined(this.RelatedRequirements)) {
            // return subrequirements with no subtype defined
            return _.where(this.RelatedRequirements.Value, {Relation: 'SubRequirement', Subtype: ''});
        } else {
            // if the RelatedRequirements key is not defined, return empty array
            return [];
        }
    };

    OntPropertyGroup.prototype.relatedRequirements = function (relation, subtype) {
        if (relation && subtype) {
            return _.filter(this.RelatedRequirements.Value, {
                'Relation': relation,
                'Subtype': subtype
            });
        } else if (relation) {
            return _.filter(this.RelatedRequirements.Value, {
                'Relation': relation
            });
        } else {
            return this.RelatedRequirements.Value;
        }

    };

    /**
     * Organize related requirements by type in keyed object.
     * @returns {{}}
     */
    OntPropertyGroup.prototype.relatedRequirementsGrouped = function () {
        var relationships,
            relatedGrouped = {},
            self = this;

        // group by Relation type
        relatedGrouped = _.groupBy(self.RelatedRequirements.Value, 'Relation');

        // Iterate through Relation types and organize into Relation Subtype groups
        angular.forEach(relatedGrouped, function (relatedItems, key) {
            relatedGrouped[key] = _.groupBy(relatedItems, 'Subtype');
        });

        return relatedGrouped;
    };

    /**
     * Remove provided Requirement from the RelatedRequirements Value array.
     * @param removed
     */
    OntPropertyGroup.prototype.removeRelatedRequirement = function (removed) {
        var related = this.RelatedRequirements.Value;
        this.RelatedRequirements.Value = _.without(related, removed);
        this.dirty();
    };

    OntPropertyGroup.prototype.dirty = function () {
        this._dirty = true
    };
    OntPropertyGroup.prototype.clean = function () {
        this._dirty = false
    };

    OntPropertyGroup.prototype.addRelatedRequirement = function (added, relation, subtype) {
        var newRelated = {
            IRI: added.IRI,
            Label: added.Label,
            Relation: added.Relation || relation,
            Subtype: added.Subtype || subtype || '',
            Properties: added.Properties,
            _dirty: true
        };

        if (this.hasRelatedRequirement(added)) {
            // if requirement is already attached, update
            // in place in collection
            this.updateRelatedRequirement(newRelated);
        } else {
            // add the related requirement to collection
            this.RelatedRequirements.Value.push(newRelated);
        }
        this.dirty();
    };

    OntPropertyGroup.prototype.removeRelatedRequirementSubtype = function (requirement) {
        requirement.Subtype = '';
        this.updateRelatedRequirement(requirement);
        this.dirty();
    };

    OntPropertyGroup.prototype.updateRelatedRequirement = function (requirement) {
        this.RelatedRequirements.Value[this.getRelatedRequirementIdx(requirement)] = requirement;
    };

    /**
     *  Clear all Values in this model.
     */
    OntPropertyGroup.prototype.resetValues = function () {
        resetModelPropertyValues(this);
    };

    /**
     *  return Boolean indicating whether the provider requirement exists in the related requirements value array
     * @param requirement
     * @returns {boolean}
     */
    OntPropertyGroup.prototype.hasRelatedRequirement = function (requirement) {
        var hasRequirement = false;
        angular.forEach(this.RelatedRequirements.Value, function (relation) {
            if (requirement.IRI === relation.IRI) {
                hasRequirement = true;
            }
        });
        return hasRequirement;
    };

    /**
     * Return Boolean indicating whether provided requirement is the same as the super requirement.
     * @param requirement
     * @returns {boolean}
     */
    OntPropertyGroup.prototype.hasSuperRequirement = function (requirement) {
        if (angular.isDefined(this.superRequirement())) {
            return requirement.IRI === this.superRequirement().IRI;
        } else {
            return false;
        }
    };

    /**
     * Return Boolean indicating whether provided requirement is NOT the same as the super requirement.
     * @param requirement
     * @returns {boolean}
     */
    OntPropertyGroup.prototype.lacksSuperRequirement = function (requirement) {
        return !this.hasSuperRequirement(requirement);
    };

    /**
     * Get index of a Requirement in the RelatedRequirements Value array.
     * @param requirement
     * @returns {boolean}
     */
    OntPropertyGroup.prototype.getRelatedRequirementIdx = function (requirement) {
        var idx = false;
        angular.forEach(this.RelatedRequirements.Value, function (relation, index) {
            if (requirement.IRI === relation.IRI) {
                idx = index;
            }
        });
        return idx;
    };

    OntPropertyGroup.prototype.isSecondaryProperty = function isSecondaryProperty(p, includeRelated, includeReadOnly) {
        var omit = /Comment/i;
        return (
            (p.$$isDetailProperty
            && !p.isHidden()
            && (includeReadOnly ? true : !p.isReadOnly())
            && (includeRelated ? true : p.$$key !== 'RelatedRequirements')
            && !omit.test(p.$$key))
        );
    };


    OntPropertyGroup.prototype.secondaryProperties = function secondaryProperties(includeRelated, includeReadOnly) {
        return _.filter(this, function (p, key, self) {
            return self.isSecondaryProperty(p, includeRelated, includeReadOnly);
        });
    };

    /**
     *
     * @param requirement
     * @returns {boolean}
     */
    OntPropertyGroup.prototype.lacksRelatedRequirement = function (requirement) {
        return !this.hasRelatedRequirement(requirement);
    };

    /**
     * Reset all Property `Value`s to blank or empty state.
     */
    function resetModelPropertyValues(properties) {
        angular.forEach(properties, function (p) {
            // If Value is array, replace with array
            if (angular.isDefined(p.Value) && _.isArray(p.Value)) {
                p.Value = [];
            } else {
                // Otherwise, replace with empty string
                p.Value = '';
            }
        });
    }

    /**
     * DisplayModel Property Settings
     * Sets properties used to hint at UI presentation and layout.
     * // TODO: remove duplication of this function
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

    return OntPropertyGroup;
}



