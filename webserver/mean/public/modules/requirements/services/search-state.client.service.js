'use strict';

angular.module('requirements').service('SearchState', SearchState);

SearchState.$inject = ['ViewModels', 'Requirement', 'GlossaryReference', '$timeout'];
function SearchState(ViewModels, Requirement, GlossaryReference, $timeout) {
    var service = this,
        defaults = {
            sorting: {
                sortByKey: 'Name',
                sortAscending: true,
                sortKeys: ['Name', 'CreatedDateTime', 'LastModified']
            },
            advanced: false
        };

    // Public Properties
    this.sessions = {};

    // Public Functions
    this.register = register;
    this.clear = clearAllState;

    /**
     * @public
     * Register a search session and return a state object. If the `sessionId` exists,
     * return the existing state object.
     * @param sessionId
     * @param immediateSearchTerm
     * @returns {*}
     */
    function register(sessionId, immediateSearchTerm) {
        var session;
        // If sessions exists, return existing state object
        if (angular.isDefined(service.sessions[sessionId])) {
            session = service.sessions[sessionId];
        } else {
            // otherwise create and return a new Session state instance.
            service.sessions[sessionId] = new Session(sessionId);
            session = service.sessions[sessionId];
        }

        setImmediateSearch(session, immediateSearchTerm);

        return session;
    }

    // if a search term has been provided, perform a search as soon as the session is ready
    function setImmediateSearch(session, term) {
        if (term) {
            session.onReady(function () {
                session.simpleSearch(term, true)
            });
        }
    }

    // Clear all Session states
    function clearAllState() {
        service.sessions = {};
    }

    /**
     * Tracks the state of a search session.
     * @param sessionId
     * @constructor
     */
    function Session(sessionId) {
        var self = this;
        this.sessionId = sessionId;
        self.typeahead = [];
        self.glossary = [];

        // When the model resolves, replace it with a copy
        // so the original blank model can be copied
        this.models.promise.then(function () {
            self.searchModel = self.models.newSearchModel();
            angular.copy(self.models.display, self.sortModel);
            self.sortModel = pickProperties(defaults.sorting.sortKeys, self);
            self.subtypes = self.models.subtypes;
        });

        GlossaryReference.$promise.then(function (data) {
            self.typeahead = data.map(function (term) {
                return term.Name;
            });
            self.glossary = data;
        });

    }

    Session.prototype.models = ViewModels;
    Session.prototype.requirements = undefined;
    // default sorting state
    Session.prototype.sorting = angular.copy(defaults.sorting);
    Session.prototype.searchModel = {};
    Session.prototype.sortModel = {};
    Session.prototype.showAdvanced = false;
    Session.prototype.error = null;
    Session.prototype.form = null;
    Session.prototype.advancedPropsList = [];
    Session.prototype.updateAdvancedPropsList = function () {
        var props = [];
        angular.forEach(this.searchModel.Properties, function (prop, key) {
            // exclude fields that should always have a value
            if (key === 'GeneralSearchTerm') return;
            // exclude properties still set to their default value
            if (prop.hasDefaultValue() && prop.Value.toString() === prop.defaultValue().toString()) return;

            props.push({
                key: key,
                name: prop.Label,
                value: propValueToString(prop.Value)
            });
        });
        this.advancedPropsList = props;
    };
    Session.prototype.advanced = function advanced() {
        var props = this.advancedPropsList;
        for (var i = 0; i < props.length; i++) {
            if (propValueToString(props[i].value).length > 0) {
                return true;
            }
        }
        // else
        return false;
    };
    Session.prototype.clearAdvanced = function () {
        var self = this;
        _.each(_.keys(self.searchModel.Properties), function (key) {
            if (key === 'GeneralSearchTerm') return;
            self.clearAdvancedProperty(key);
        }, this);

        // clear current search results
        if (this.current()) {
            // this.search();
        }
    };
    Session.prototype.clearAdvancedProperty = function (key, triggerSearch) {
        this.searchModel.Properties[key].resetValue();
        this.updateAdvancedPropsList();
        if (triggerSearch) {
            $timeout(this.search.bind(this, true), 0);
        }
    };
    Session.prototype.current = function () {
        return this.searchModel.current;
    };

    function propValueToString(val) {
        if (angular.isString(val)) {
            return val;
        } else if (angular.isObject(val) && !angular.isArray(val) && val.Label) {
            return val.Label;
        } else if (angular.isArray(val)) {
            return val.map(function (item) {
                return item.Label || item;
            }).join(' |&nbsp;')
        } else {
            return val.toString();
        }
    }

    Session.prototype.resetAll = resetAll;
    Session.prototype.sort = sortRequirements;
    Session.prototype.pickProperties = pickProperties;
    Session.prototype.showAllRelated = showRelated;
    Session.prototype.hideAllRelated = hideRelated;
    Session.prototype.relatedVisibleCount = relatedVisibleCount;
    Session.prototype.relatedHiddenCount = relatedHiddenCount;
    Session.prototype.showAllProperties = showProperties;
    Session.prototype.hideAllProperties = hideProperties;
    Session.prototype.propertiesVisibleCount = propertiesVisibleCount;
    Session.prototype.propertiesHiddenCount = propertiesHiddenCount;
    Session.prototype.toggleShowAdvanced = toggleAdvanced;
    Session.prototype.onReady = onReady;
    Session.prototype.setForm = setForm;

    // register onReady handlers
    function onReady(fn) {
        this.models.promise.then(fn);
    }

    // store reference to search form
    function setForm(form) {
        this.form = form;
    }

    /**
     * @public
     * Completely reset search state
     */
    function resetAll() {
        // un-define existing requirements key
        // todo: make sure this isn't very stupid
        this.requirements = undefined;
        // replace current sorting state with copy
        // of original default state
        this.sorting = angular.copy(defaults.sorting);
        // replace current model with pristine
        // copy of original
        this.searchModel = this.models.newSearchModel();
    }

    /**
     * @public
     * Sort requirements list
     * @param sortByKey
     */
    function sortRequirements(sortByKey) {
        var self = this;
        if (this.requirements) {
            // Check if sorting key has changed
            if (angular.isDefined(sortByKey) && sortByKey === this.sorting.sortByKey) {
                // if the key hasn't changed, reverse the sort direction
                // for the current key
                this.sorting.sortAscending = !this.sorting.sortAscending;
            } else if (angular.isDefined(sortByKey)) {
                // reset sorting if sort key has changed
                this.sorting.sortAscending = true;
                this.sorting.sortByKey = sortByKey;
            }
            // If the sort key is undefined, we sort using the current
            // state

            // sort ascending
            if (this.sorting.sortAscending) {
                this.requirements.sorted = sorted();
            } else {
                // else sort descending
                this.requirements.sorted = sorted().reverse();
            }
        }

        // Return sorted Requirements
        function sorted() {
            return _.sortBy(self.requirements, sortPredicate);
        }

        // Return Property value for sorting
        function sortPredicate(requirement) {
            if (requirement.Properties[self.sorting.sortByKey]) {
                return requirement.Properties[self.sorting.sortByKey].Value;
            } else {
                return '';
            }
        }
    }

    /**
     * @public
     * Return a Requirement Properties object with only
     * the requested property keys.
     * @param {Array} keys
     * @param {Array} addPropKeys
     * @returns {*}
     */
    function pickProperties(keys, selfRef) {
        if (selfRef.sortModel.picked) return;

        angular.forEach(keys, function (key) {
            if (angular.isUndefined(selfRef.sortModel.Properties[key])) {
                selfRef.sortModel.Properties[key] = {Label: key, Value: ''}
            }
        });

        return {
            Properties: _.pick(selfRef.sortModel.Properties, keys),
            picked: true
        };
    }


    function propertiesHiddenCount() {
        return displayCount('showProperties', this).hidden;
    }

    function propertiesVisibleCount() {
        return displayCount('showProperties', this).visible;
    }

    function relatedHiddenCount() {
        return displayCount('showRelated', this).hidden;
    }

    function relatedVisibleCount() {
        return displayCount('showRelated', this).visible;
    }

    function showRelated() {
        updateAll('showRelated', true, this);
    }

    function hideRelated() {
        updateAll('showRelated', false, this);
    }

    function showProperties(extendedKey) {
        updateAll('showProperties', true, this);
    }

    function hideProperties(extendedKey) {
        updateAll('showProperties', false, this);
    }


    function updateAll(key, value, selfRef, extendedKey) {
        _.each(selfRef.requirements, function (r) {
            if (extendedKey) {
                r.extended[extendedKey].Properties[key] = value
            } else {
                r.Properties[key] = value
            }
        });
    }

    function displayCount(boolKey, self) {
        var i, counter = {visible: 0, hidden: 0};
        for (i = 0; i < selfRef.requirements.length; i++) {
            if (selfRef.requirements[i].Properties[boolKey] === bool) {
                counter.visible += 1;
            } else {
                counter.hidden += 1;
            }
        }
        return counter;
    }

    function toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
    }

    Session.prototype.isLoading = function () {
        return this.requirements && !this.requirements.$resolved;
    };

    Session.prototype.isUpdating = function () {
        return this.requirements && this.requirements.updating;
    };

    Session.prototype.isReady = function () {
        return !this.requirements ||
            (this.requirements && this.requirements.$resolved);
    };

    Session.prototype.resultCount = function () {
        return this.requirements ? this.requirements.length : 0;
    };

    Session.prototype.search = search;
    /**
     * Find requirements based on property values of model.
     * @param model
     */
    function search(keepCurrent) {
        this.onReady(function () {
            var self = this,
                searchProperties,
                newQuery;

            self.updateAdvancedPropsList();

            if (self.form) {
                self.form.$setPristine();
                self.form.$setUntouched();
            }

            if (self.advanced()) {
                // Copy current search model state
                searchProperties = {Properties: self.searchModel.Properties};
                console.log(searchProperties);
            } else {
                // if form is shortened, search only general search term
                searchProperties = {
                    Properties: {
                        GeneralSearchTerm: self.searchModel.Properties.GeneralSearchTerm || ''
                    }
                }
            }


            newQuery = query(searchProperties);
            if (!keepCurrent) {
                // immediately define or overwrite requirements value
                self.requirements = newQuery;
            } else if (self.requirements) {
                self.requirements.updating = true;
            }
            self.error = null; // clear errors on search trigger

            newQuery.$promise.then(function () {
                if (keepCurrent) self.requirements = newQuery; // if previous results were not cleared, now replace
                self.searchModel.current = true;
                self.updateAdvancedPropsList();
                self.showAdvanced = false;
                self.sort();
            });

            newQuery.$promise.catch(function (error) {
                self.error = {
                    status: error.status,
                    message: error.data
                };
            });
        }.bind(this));
    }


    Session.prototype.simpleSearch = simpleSearch;

    function simpleSearch(term, updateInput) {
        if (angular.isDefined(term)) {
            this.search({Properties: {GeneralSearchTerm: {Value: term}}});
        } else {
            this.search(this.searchModel);
        }
        if (updateInput) {
            this.searchModel.Properties.GeneralSearchTerm.Value = term;
        }
    }

    /**
     * Queries ontology using provided properties to find requirements.
     * @param searchProperties
     * @returns {query|requirementResource.query|{method, url, transformRequest, transformResponse, isArray}}
     */
    function query(searchProperties) {
        return new Requirement.query('', searchProperties);
    }

}
