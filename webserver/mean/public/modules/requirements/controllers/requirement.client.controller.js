'use strict';

// Requirement controller
angular.module('requirements').controller('RequirementController', RequirementController);

RequirementController.$inject = ['$scope', '$stateParams', '$location', 'Authentication',
    'Requirement', 'ViewModels', 'RequirementModal', 'moduleSettings',
    'extendedRequirements', '$filter', 'openRequirement'];
function RequirementController($scope, $stateParams, $location, Authentication,
                               Requirement, ViewModels, RequirementModal, settings,
                               extendedRequirements, $filter, openRequirement) {

    $scope.authentication = Authentication;

    // Controller scope state
    $scope.settings = settings;
    $scope.models = ViewModels;
    $scope.displayModel = ViewModels.display;
    $scope.editModel = ViewModels.edit;
    $scope.createModel = ViewModels.create;
    $scope.editModel = ViewModels.edit;
    $scope.related = {};
    $scope.subtypes = ViewModels.subtypes;


    // Controller Public Functions
    $scope.openRequirementModal = openRequirementModal;
    $scope.create = create;
    $scope.remove = remove;
    $scope.update = update;
    $scope.toggleActive = toggleActive;
    $scope.findOne = findOne;
    $scope.findOneForEdit = findOneForEdit;
    $scope.findOneForDisplay = findOneForDisplay;
    $scope.getRelated = getRelated;
    $scope.findSimilar = findSimilar;
    $scope.escape = escape;
    $scope.openIRI = openRequirement;
    $scope.emptyRequirement = emptyRequirement;
    $scope.cleanPastedHtml = cleanPastedHtml;

    setAnyErrors();
    /**
     * Open a requirement in a modal popover.
     * @param iri
     * @param name
     */
    function openRequirementModal(iri, name) {
        RequirementModal.openModal(iri, name);
    }

    /**
     * Create new Requirement
     */
    function create() {
        // Create new Requirement object
        $scope.requirement.IRI = '';
        $scope.requirement.Label = $scope.requirement.Properties.Name.Value;
        $scope.requirement.$submitted = true;

        var requirement = new Requirement(angular.copy($scope.requirement));
        // Redirect after save
        requirement.$save(function (response) {
            $scope.requirement.$submitted = false;
            // reload view models
            ViewModels.reload();
            // open new requirement
            openRequirement(response._namePath);
            // Clear form fields
            $scope.name = '';
        }, function (errorResponse) {
            console.error(errorResponse);
            $scope.requirement.$submitted = false;
            $scope.error = {
                status: errorResponse.status,
                message: errorResponse.data
            };
        });
    }

    /**
     * Remove existing Requirement
     * @param requirement
     */
    function remove(requirement) {
        if (requirement) {

            requirement.$remove();
            // reload view models
            $scope.models.reload();
            // open requirement view
            for (var i in $scope.searchState.requirements) {
                // Update existing Requirement
                if ($scope.searchState.requirements[i] === requirement) {
                    $scope.searchState.requirements.splice(i, 1);
                }
            }
        } else {
            $scope.requirement.$remove(function () {
                $location.path('search');
            });
        }
    }

    /**
     * Update existing requirement.
     */
    function update() {
        $scope.requirement.user = Authentication.user;
        $scope.requirement.$update(function (data) {
            // open requirement view
            openRequirement(data._namePath);
        }, function (error) {
            $scope.requirement.$submitted = false;
            handleErrorResponse(error);
        });
    }

    /**
     * Deactivate current requirement
     */
    function toggleActive() {
        $scope.requirement.Active = !$scope.requirement.Active;
        $scope.update();
    }

    /**
     * Queries ontology using provided properties to find requirements.
     * @param searchProperties
     * @returns {query|requirementResource.query|{method, url, transformRequest, transformResponse, isArray}}
     */
    function query(searchProperties) {
        return new Requirement.query('', searchProperties);
    }

    /**
     * Set scope requirement to a new blank requirement.
     */
    function emptyRequirement() {
        $scope.requirement = extendedRequirements.newRequirement();
    }

    /**
     * Retrieve a single requirement using IRI or database ID.
     */
    function findOne() {
        if ($stateParams.name) {
            $scope.requirement = Requirement.get({name: $stateParams.name})
        }

        $scope.requirement.$promise.then(handleRequirementResolved);
        $scope.requirement.$promise.catch(handleErrorResponse);

    }

    function handleErrorResponse(err) {
        $scope.error = {
            status: err.status,
            message: JSON.parse(err.data).message || JSON.parse(err.data)
        };
    }

    function findOneForEdit() {
        if ($stateParams.name) {
            $scope.requirement = extendedRequirements.findOneForEdit($stateParams.name);
            $scope.requirement.$promise.catch(function (error) {
                var errRef = setSessionError(error);

                $location.replace();
                openRequirement($stateParams.name, {param: 'error', value: errRef});

                handleErrorResponse(error);
                if (error.status) $scope.error.status = error.status;
            });

            // redirect to view mode if record is locked
            $scope.requirement.$promise.then(function (res) {
                if (res._locked) {
                    var errRef = setSessionError({
                        status: 403,
                        statusText: 'locked',
                        data: '{ "message": "Edit failed - this record is being edited by another user" }'
                    });
                    openRequirement($stateParams.name, {param: 'error', value: errRef});
                } else {
                    sessionStorage.setItem('editing', JSON.stringify(res));
                }
            })
        }

    }

    function setSessionError(error) {
        var errRef = error.statusText + Date.now();

        sessionStorage.setItem(errRef, JSON.stringify({
            status: error.status,
            message: JSON.parse(error.data).message
        }));

        return errRef;
    }

    // display any errors stored by previous action
    function setAnyErrors() {
        var error = $location.search().error || null;
        if (error) {
            //retrieve error from session storage
            $scope.error = JSON.parse(sessionStorage.getItem(error));
            // remove error from sessionStorage once attached to scope
            sessionStorage.removeItem($stateParams.error);
            // remove error param from displayed path
            $location.search('error', undefined);
        }
    }

    function findOneForDisplay(name) {
        if ($stateParams.name) {
            $scope.requirement = extendedRequirements.findOneForDisplay($stateParams.name);
        }
        $scope.requirement.$promise.catch(handleErrorResponse)
    }

    /**
     * Request any related requirements that are attached to the current requirement
     * @returns {*|{url, transformResponse, isArray}}
     */
    function getRelated() {
        angular.forEach($scope.requirement.Properties.RelatedRequirements.Value, function (related) {
            Requirement.getIri({name: $filter('namePathFormat')(related.Label)}).$promise.then(function (req) {
                related.Properties = req.Properties;
            });
        });
    }


    /**
     * Find Requirements that share common language or properties.
     * @param requirement
     */
    //The user shall be able to create an author
    function findSimilar(requirement) {
        $scope.similar = [];
        $scope.similar = Requirement.getSimilar(angular.copy(requirement));
        $scope.similarLoading = true;
        $scope.similar.$promise.then(function () {
            $scope.similarLoading = false
        });
    }

    /**
     * For the current selected requirement, extend displayed properties with any missing property keys
     */
    function handleRequirementResolved() {
        if ($scope.requirement && $scope.requirement.$resolved) {
            $scope.related = $scope.requirement.Properties.relatedRequirements();

            $scope.$watchCollection('requirement.Properties.RelatedRequirements.Value', function () {
                var relatedUpdate = $scope.requirement.Properties.relatedRequirements();
                angular.forEach($scope.related, function (related, key) {
                    $scope.related[key] = relatedUpdate[key];
                });
            });

            // get any requirements attached to this requirements
            if ($scope.requirement.Properties.relatedRequirements().length) {
                $scope.getRelated();
            }
        }
    }


    /**
     * Escape URLs/URIs
     * @param input
     * @returns {string}
     */
    function escape(input) {

        return window.encodeURIComponent(input);
    }

    /**
     *
     * @param responseData
     */
    function checkFormValidity(responseData) {
        angular.forEach(responseData.Properties, function (p, key) {
            if (angular.isDefined(p.Error)) {
                $scope.form.$valid = false;
                setFormError(p.Error, key);
                setRequirementError(p.Error, key);
            }
        });
    }

    /**
     *
     * @param err
     * @param propertyKey
     */
    function setFormError(err, propertyKey) {
        if (angular.isUndefined($scope.form.$error[err.token])) {
            $scope.form.$error[err.token] = [];
        }

        $scope.form.$error[err.token].push(propertyKey);
    }

    /**
     *
     * @param err
     * @param propertyKey
     */
    function setRequirementError(err, propertyKey) {
        $scope.requirement.Properties[propertyKey].$$error = err.message;
    }


    /**
     * Strip absolutely everything out of pasted content.
     * @param html
     * @returns {String}
     */
    function cleanPastedHtml(htmlStr) {
        // attempt to parse
        try {
            // parse html from editor, wrap in parent element so we
            // return modified content easily.
            var parsed = $('<div />').append($(htmlStr));

            // remove unwanted elements
            parsed.find('head, style, :empty, img, iframe').remove();

            // strip unwanted tags by replacing them with
            // their content text.
            parsed.find('a, span, ul, li, ol, pre').each(function () {
                $(this).replaceWith($(this).text());
            });

            // strip even more unwanted tags
            parsed.find('div, table, tr, td, h1, h2, h3, h4, h5, h6').each(function () {
                $(this).replaceWith($(this).text().replace(/["'‘’]/, ''));
            });

            // strip attributes from any remaining elements
            parsed.find('*').each(function () {
                var el = this,
                    attributes = _.pluck(el.attributes, 'name');

                angular.forEach(attributes, function (attr) {
                    $(el).removeAttr(attr);
                });

                // strip out quotation marks
                $(el).text($(el).text().replace(/["“”'‘’]/g, ''))
            });

            // return modified content
            return parsed[0].innerHTML;
        } catch (e) {
            return htmlStr;
        }
    }

    function clearRelatedDetails() {
        $scope.requirement.Properties.RelatedRequirements.Value.map(function (item) {
            delete item.Properties;
        });
    }

    return $scope;

}
