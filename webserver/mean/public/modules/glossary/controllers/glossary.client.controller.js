'use strict';

angular.module('glossary').controller('GlossaryController', GlossaryController);

GlossaryController.$inject = ['$scope', '$stateParams', '$location', '$timeout',
    '$filter', 'Authentication', 'GlossaryEntry', 'RequirementModal'];
function GlossaryController($scope, $stateParams, $location, $timeout,
                            $filter, Authentication, GlossaryEntry, requirementModal) {

    $scope.user = Authentication.user;


    // Controller Public Functions
    $scope.glossary = GlossaryEntry.list({name: $stateParams.name});
    $scope.grouped = {};
    $scope.froalaOptions = {
        toolbarBottom: true,
        key: window.reqsFroalaLicense
    };
    $scope.create = create;
    $scope.remove = remove;
    $scope.update = update;
    $scope.findOne = findOne;
    $scope.findOneForEdit = findOneForEdit;
    $scope.openRequirementModal = requirementModal.openModal;

    // Controller scope state
    $scope.user = Authentication.user;
    $scope.glossaryEntry = undefined;
    $scope.adding = false;
    $scope.filterText = '';

    $scope.toggleAdding = function () {
        $scope.adding = !$scope.adding;
    };

    $scope.cancelAdding = function () {
        $scope.glossaryEntry = undefined;
        $scope.adding = false;
    };

    /**
     * Always perform after glossary query
     */
    $scope.glossary.$promise.then(function (data) {
        GlossaryEntry.transformAllResults($scope.glossary);
        groupEntries();
        buildTextIndex();
    });

    $scope.initGlossaryEntry = function initGlossaryEntry() {
        $scope.glossaryEntry = new GlossaryEntry({
            Class: 'GlossaryEntry',
            UserName: $scope.user.username,
            Name: '',
            Value: ''
        });
    };

    $scope.filter = function handleFilterEvent(e) {
        groupEntries();
    };

    function activeEntries() {
        return _.where($scope.glossary, {Active: 'true', Plural: 'false'});
    }

    function buildTextIndex() {
        // concatenate text for each entry and key by IRI
        $scope.textIndex = activeEntries().map(function (g) {
            return {
                iri: g.IRI,
                text: g.Name + '|'
                + g.Value.replace(/<.*?>/g, '')
                    .replace(/[\.,]/g, '|')
            }
        });
    }

    function filteredTextIndexIris() {
        return _.filter($scope.textIndex, function (item) {
            // test for filter text
            return item.text.indexOf($scope.filterText) !== -1;
        }).map(function (item) {
            return item.iri;
        });
    }

    function groupEntries() {
        var active = activeEntries();
        if ($scope.filterText.length) {
            var filteredIris = filteredTextIndexIris();
            $scope.grouped = $filter('groupByLetter')(
                _.reject(active, function (g) {
                    // reject entries if IRI not present in filtered list
                    return filteredIris.indexOf(g.IRI) === -1;
                })
                , 'Name');
        } else {
            $scope.grouped = $filter('groupByLetter')(active, 'Name');
        }
    }

    /**
     * Create new GlossaryEntry
     */
    function create() {
        // Create new GlossaryEntry object

        var glossaryEntry = new GlossaryEntry(angular.copy($scope.glossaryEntry));

        // optimistic addition to glossaryentry display list
        $scope.glossary.push(GlossaryEntry.transformResult(angular.copy($scope.glossaryEntry)));

        glossaryEntry.$save(function (response) {
            response.$resolved = true;
            response = GlossaryEntry.transformResult(response);
            $scope.glossary.splice(_.indexOf($scope.glossary, glossaryEntry), 1, response);
            handleSaved();
            buildTextIndex();
            groupEntries();
            $scope.adding = false;
        }, function (errorResponse) {
            // restore glossaryentry field content
            $scope.glossaryEntry = glossaryEntry;
            $scope.glossaryEntry.$error = errorResponse || {data: 'Glossary entry save failed'};
            console.error(errorResponse);
            // remove optimistically added glossaryentry
            $scope.glossary.splice(_.indexOf($scope.glossary, glossaryEntry), 1);
            buildTextIndex();
            groupEntries();
        });

        groupEntries();

        // always:
        // clear error state
        glossaryEntry.$error = undefined;
        // set glossaryentry user
        glossaryEntry.user = $scope.user;
        // clear glossaryentry input
        $scope.glossaryEntry.Name = '';
        $scope.glossaryEntry.Value = '';
    }

    function handleSaved() {
        $scope.saved = true;
        $timeout(function () {
            $scope.saved = false;
        }, 1000);
    }


    /**
     * Remove existing GlossaryEntry
     * @param glossaryentry
     */
    function remove(glossaryentry) {
        // TODO
    }

    /**
     * Update existing glossaryentry.
     */
    function update(entry) {
        entry.user = Authentication.user;
        GlossaryEntry.update(entry)
            .$promise.then(function () {
            entry.finishEditing();
            groupEntries();
        })
            .catch(function (errorResponse) {
                console.error(errorResponse);
            });
    }

    /**
     * Queries ontology using provided properties to find glossary.
     * @param searchProperties
     * @returns {query|glossaryentryResource.query|{method, url, transformRequest, transformResponse, isArray}}
     */
    function query(searchProperties) {
        return new GlossaryEntry.query('', searchProperties);
    }

    /**
     * Browse to the specified IRI.
     * @param iri
     */
    function openIRI(iri) {
        $location.search({iri: iri});
        $location.path('/glossary/iri');
    }

    /**
     * Retrieve a single glossaryentry using IRI or database ID.
     * TODO: retire DB ids
     * TODO: rename this - setGlossaryEntry
     */
    function findOne() {
        if ($stateParams.iri) {
            $scope.glossaryEntry = GlossaryEntry.getIri({iri: $stateParams.iri})
        } else if ($stateParams.glossaryentryId) {
            $scope.glossaryEntry = GlossaryEntry.get({
                glossaryentryId: $stateParams.glossaryentryId
            });
        }
    }

    function findOneForEdit() {
        if ($stateParams.name) {
            $scope.glossaryEntry = extendedGlossary.findOneForEdit($stateParams.name);
        }
        $scope.glossaryEntry.$promise.then(handleGlossaryEntryResolved);
    }


    function findOneForEditByIRI() {
        if ($stateParams.name) {

            var req = GlossaryEntry.getIri({name: name});
            req.$promise.then(function (data) {
                req.$$ready = true;
            });

            $scope.glossaryEntry = req;

        }
        $scope.glossaryEntry.$promise.then(handleRequirementResolved);
    }


    /**
     * For the current selected glossaryentry, extend displayed properties with any missing property keys
     */
    function handleGlossaryEntryResolved() {
        if ($scope.glossaryEntry && $scope.glossaryEntry.$resolved) {
            $scope.models.extendGlossaryEntry($scope.glossaryEntry);
        }
    }

    $scope.undefinedCount = function undefinedCount() {
        var i, count = 0;
        for (i = 0; i < $scope.glossary.length; i++) {
            if ($scope.glossary[i].Value.length) count++;
        }
        return $scope.glossary.length - count;
    };

    /**
     * Escape URLs/URIs
     * @param input
     * @returns {string}
     */
    function escape(input) {
        return window.encodeURIComponent(input);
    }
}
