'use strict';

// Present Requirement in modal window and track state while browsing within modal.
angular.module('requirements').service('RequirementModal', RequirementModal);

RequirementModal.$inject = ['$uibModal', '$filter', 'extendedRequirements', 'ViewModels', 'Authentication', 'moduleSettings'];
function RequirementModal($uibModal, $filter, extendedRequirements, ViewModels, Authentication, settings) {
    var self = this,
        currentModal;
    this.openModal = openModal;
    this.openModalWithHistory = openModalWithHistory;
    this.openRequirementModal = openRequirementModal;
    this.modalState = {
        max: 10,
        count: function modalCount() {
            return this.history.length;
        },
        opened: function modalOpened(name) {
            this.history.push({
                name: name
            });
        },
        previous: function previous() {
            if (this.count() > 0) {
                return this.history[this.history.length - 2];
            }
        },
        popPrevious: function popPrevious() {
            if (this.count() > 0) {
                return {
                    current: this.history.pop(), // pop current off stack
                    previous: this.history.pop() // pop previous off stack
                }
            }
        },
        canOpen: function openAllowed() {
            return this.count() <= this.max;
        },
        clearHistory: function () {
            this.history.length = 0;
        },
        history: []
    };


    function openModal(name) {
        self.modalState.clearHistory();
        self.openRequirementModal(name, false);
    }

    // TODO: remove
    function openModalWithHistory(name) {
        self.openRequirementModal(name, true)
    }

    /**
     * Open a Requirement in a modal popover.
     * @param {String} name The requirement name for display in breadcrumbs
     * @param {Boolean} [track=true]
     */
    function openRequirementModal(name, track) {
        if (currentModal) currentModal.close();

        currentModal = $uibModal.open({
            animation: true,
            templateUrl: 'modules/requirements/views/view-requirement-modal.client.view.html',
            controller: modalController,
            size: 'lg',
            resolve: {
                modalRequirement: function () {
                    return extendedRequirements.findOneForDisplay($filter('namePathFormat')(name));
                },
                models: function () {
                    return ViewModels;
                },
                authentication: function () {
                    return Authentication;
                },
                modalState: function () {
                    return self.modalState;
                },
                //back: function () {
                //    return self.back;
                //}
                getIri: function () {
                    return extendedRequirements.findOneForDisplay;
                },
                settings: function () {
                    return settings;
                }
            }
        });

        // If modal navigation history tracking is enabled, add the modal's
        // properties to the modal browsing history.
        if (track || angular.isUndefined(track)) {
            self.modalState.opened(iri, name);
            // If a modal is dismissed by clicking on the backdrop,
            // assumed browsing is done and clear history
            currentModal.result.catch(function (reason) {
                if (reason === "backdrop click") self.modalState.clearHistory();
            });
        }

        // If a modal is dismissed by browsing to the requirements url,
        // clear the browsing history.
        currentModal.result.then(function (reason) {
            if (reason === "browse to requirement") self.modalState.clearHistory();
        }, _.noop);

    }

    function modalController($scope, $uibModalInstance, modalRequirement,
                             models, authentication, modalState, getIri, settings) {

        $scope.isModal = true;
        $scope.settings = settings;
        $scope.requirement = modalRequirement;
        $scope.authentication = authentication;
        $scope.models = models;
        $scope.displayModel = models.display;
        $scope.modalState = modalState;
        $scope.close = close;
        $scope.back = back;
        $scope.openRequirementModal = openInCurrentModal;


        $scope.requirement.$promise
            .then(function () {
            $scope.resolved = true;
        }, function (errRes) {
            console.error(errRes);
        });

        function close() {
            $uibModalInstance.close();
        }

        function back() {
            if ($scope.modalState.count() > 0) {
                $scope.resolved = false;
                var history = $scope.modalState.popPrevious(),
                    prev = history.previous;

                $scope.requirement = extendedRequirements.findOneForDisplay($filter('namePathFormat')(prev.name));
            }
        }

        /**
         * Open a requirement in the current modal window
         * @param iri
         * @param name
         */
        function openInCurrentModal(name) {
            var prev = $scope.modalState.previous();
            if (prev && name === prev.name) {
                // if a link leads to the previous requirement
                // in the modal browsing history, we use the back
                // function instead of adding to history.
                $scope.back();
            } else {
                // otherwise load the requirement and add
                // it to the history stack
                $scope.requirement = extendedRequirements.findOneForDisplay($filter('namePathFormat')(name));
                $scope.modalState.opened(name);
            }
        }
    }
}