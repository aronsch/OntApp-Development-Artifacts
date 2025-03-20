'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').constant('moduleSettings', {
    search: {
        advancedSearchMultiselect: false,
        forceDropdownElForKeys: /(sub|super)requirement/i
    },
    iconClass: {
        Active: 'fa-power-off',
        SuperRequirement: 'fa-arrow-up',
        SubRequirement: 'fa-share-alt fa-rotate-90',
        SubRequirements: 'fa-share-alt fa-rotate-90',
        RelatedRequirements: 'fa-share-alt fa-rotate-90',
        Name: '',
        Description: '',
        Rationale: 'fa-question-circle',
        'Rationale-Assumptions': 'fa-question-circle',
        TestType: 'fa-bullseye',
        RequirementType: 'fa-folder',
        RequirementSource: 'fa-arrow-circle-right',
        Project: 'fa-folder-open',
        Version: 'fa-map-signs',
        Priority: 'fa-clone',
        Customer: 'fa-users',
        Capability: 'fa-cogs',
        Author: 'fa-user',
        State: 'fa-stethoscope',
        LastModified: 'fa-pencil',
        LastModifiedDateTime: 'fa-pencil',
        CreatedDateTime: 'fa-calendar'
    },
    colClass: {
        propertyList: 'col-xs-6 col-sm-3 col-md-3 col-lg-2',
        propertyListLargeText: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        largeTextKeyRegEx: /rationale/i
    },
    formClass: {
        label: 'col-xs-12 col-sm-3 col-md-3 col-lg-2',
        input: 'col-xs-12 col-sm-9 col-md-9 col-lg-10',
        inputOffset: 'col-xs-12 col-sm-9 col-sm-offset-3 col-md-offset-3 col-lg-offset-2'
    },
    isPrimaryKey: function isPrimaryKey(key) {
        return ['Name',
                'Description',
                'Rationale',
                'Glossary']
                .indexOf(key) > -1;
    },
    propertyHasValue: function propertyHasValue(target) {
        // predicate determining whether a property has a value set.
        // true if Value is defined (and) 
        // Value is an object (or) Value has a length (array, string)
        return (angular.isDefined(target.Value) &&
        (
            (angular.isObject(target.Value) && !angular.isArray(target.Value))
            || target.Value.length > 0
        ));
    },
    isHiddenKey: function isHiddenKey(key) {
        return ['Author',
                'CreatedDateTime',
                'Comment',
                'Comments',
                'GlossaryEntry',
                'Glossary',
                'RelatedRequirements',
                'LastModified',
                'SubRequirement',
                'SuperRequirement']
                .indexOf(key) > -1;
    },
    isReadOnlyKey: function isReadOnlyKey(key) {
        return ['LastModified',
                'CreatedDateTime',
                'Created',
                'Author']
                .indexOf(key) > -1;
    },
    requirementSubTypes: ['Who', 'What', 'When', 'Where'],
    noValidationIconClass: function () {
        var alts = angular.copy(this.iconClass);
        alts.Name = '';
        alts.Description = '';

        return alts;
    },
    transformForTransport: transformForTransport,
    modelReqSettings: {
        displayModel: {
            method: 'GET',
            url: 'api/models/requirement',
            isArray: false,
            cache: true
        },
        createModel: {
            method: 'GET',
            url: 'api/models/requirement/create',
            isArray: false,
            cache: true
        },
        editModel: {
            method: 'GET',
            url: 'api/models/requirement/edit',
            isArray: false,
            cache: true
        },
        searchModel: {
            method: 'GET',
            url: 'api/models/requirement/search',
            isArray: false,
            cache: true
        },
        subtypes: {
            method: 'GET',
            url: 'api/models/requirement/subtypes',
            isArray: false,
            cache: true
        }

    }
});

function transformForTransport(data) {
    var cleanProps = {};

    // because OntServer can't currently deal with primitive boolean values
    if (angular.isDefined(data.Active)) data.Active = data.Active.toString();

    // clean any ng keys that didn't get removed for some reason
    stripPrivateKeys(data);


    data.Class = 'Requirement';

    // strip everything but the values out of the properties object

    if (angular.isUndefined(data)) return cleanProps;

    angular.forEach(data.Properties, function (p) {

        if (p.$$key === "GeneralSearchTerm") {
            cleanProps[p.$$key] = p.Value;
            return;
        }

        if (p.$$key === "Comments" || p.$$key === "Glossary") {
            return;
        }

        // Add property key to payload if the value is filled
        if (p.Value && !p.hasEnumeration() && p.$$key !== 'RelatedRequirements') {
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value,
                IRI: p.IRI
            };
        } else if (p.$$key === 'RelatedRequirements' && p.Value.length) {

            angular.forEach(p.Value, function (r, i) {
                p.Value[i] = {
                    Label: r.Label,
                    IRI: r.IRI,
                    Relation: r.Relation,
                    Subtype: r.Subtype
                }
            });

            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value
            };

        } else if (p.Value && p.isBoolean()) {
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value.toString(),
                IRI: p.IRI
            };
        } else if (p.Value && p.hasEnumeration() && angular.isObject(p.Value) && !angular.isArray(p.Value)) {
            // if value is filled with a single enum selection,
            // set the property value to selection label
            // and property IRI to the selection IRI
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value.Label,
                IRI: p.Value.IRI
            };
        } else if (p.Value && p.hasEnumeration() && angular.isString(p.Value)) {
            // if value is filled with a single enum selection,
            // set the property value to selection label
            // and property IRI to the selection IRI
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value,
                IRI: p.IRI
            };
        } else if (p.Value && p.hasEnumeration() && p.Value === '') {
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: '',
                IRI: ''
            }
        } else if (p.Value && p.hasEnumeration() && angular.isArray(p.Value) && p.Value.length) {
            // if value is filled with a multiple enum selections,
            // send array as Value
            cleanProps[p.$$key] = {
                Label: p.Label,
                Value: p.Value,
                IRI: p.IRI
            }
        }
    });

    data.Properties = cleanProps;

    return data;
}

function stripPrivateKeys(obj) {
    Object.keys(obj).map(function (k) { if(/^(\$\$?|_)/.test(k)) delete obj[k]});
}

function transformResult(data) {
    data.Properties = new OntPropertyGroup(data.Properties);

    return data;
}

function transformDisplayModel(data) {
    data.Properties = new OntPropertyGroup(data.Properties);
    return data;
}

function transformSearchModel(data) {
    return new OntSearchModel(data);
}

function parseJSON(data) {
    return JSON.parse(data);
}
