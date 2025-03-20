'use strict';
/**
 * Created by Aron on 1/10/16.
 * Server-side Validation for Ontology Classes
 */
var _ = require('lodash'),
    requirements = {
        // predicate functions used to determine if requirement is valid.
        validationPredicates: {
            hasName: function (props) {
                // Check if name value is filled
                if (isUndefined(props.Name) || hasZeroLength(props.Name)) {
                    setError('Name', props, 'required', 'Requirement must have a name.');
                    return false;
                } else {
                    return true;
                }
            },
            hasDescription: function (props) {
                // Check if description value is filled
                if (isUndefined(props.Description) || hasZeroLength(props.Description)) {
                    setError('Description', props, 'required', 'Requirement must have a description.');
                    return false;
                } else {
                    return true;
                }
            },
            isNotSelfReferencing: function (props) {
                // If a requirement has both SuperRequirements and SubRequirements,
                // Make sure the SuperRequirement is not also set as a SubRequirement.
                if (isDefined(props.RelatedRequirements) && isDefined(props.SuperRequirement)) {
                    var superIri = props.SuperRequirement.IRI;
                    // Test to see if the SuperRequirement matches any SubRequirements,
                    if (_.any(props.RelatedRequirements.Value,
                            {IRI: superIri, Type: 'SubRequirement'})) {

                        // If a SubRequirement matches, fail validation and set error description.
                        setError('RelatedRequirements', props, 'self-referential', 'SubRequirement cannot also be SuperRequirement.');
                        return false;
                    }
                } else {
                    return true;
                }
            }
        },
        validate: function (requirement) {
            // default passing status to True
            var passes = true,
                pred;

            for (pred in requirements.validationPredicates) {
                // if any validation predicate fails, the validation has failed
                if (requirements.validationPredicates[pred](requirement.Properties) === false) {
                    passes = false;
                }
                // even if validation fails, continue evaluating predicates so
                // all validation errors are captured.
            }
            return passes;
        }
    };

function isDefined(prop) {
    return !isUndefined(prop);
}

function isUndefined(prop) {
    return _.isUndefined(prop) || _.isUndefined(prop.Value)
}

function hasZeroLength(prop) {
    return prop.Value.length === 0;
}

function setError(key, props, errToken, errMsg) {
    // if propert key is missing, define it.
    if (_.isUndefined(props[key])) {
        props[key] = {}
    }
    props[key].Error = {
        message: errMsg,
        token: errToken
    };
}
exports.requirements = requirements;