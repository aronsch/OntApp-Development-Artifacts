'use strict';

// Requirements Search controller
angular.module('requirements').controller('RequirementFormController', RequirementFormController);

RequirementFormController.$inject = ['$scope', 'moduleSettings', '$location', '$timeout', 'GlossaryReference'];
function RequirementFormController($scope, settings, $location, $timeout, GlossaryReference) {

    $scope.glossary = GlossaryReference;
    $scope.froalaOptions = {
        key: window.reqsFroalaLicense,
        toolbarButtons: ['show', 'addTerm', 'bold', 'italic', 'underline', 'undo', 'redo'],
        toolbarButtonsSM: ['addTerm', 'bold', 'italic', 'underline', 'undo', 'redo'],
        toolbarButtonsXS: ['addTerm', 'bold', 'italic', 'undo', 'redo'],
        events: {
            'froalaEditor.initialized': froalaExtend
        }
    };

    // predicate functions for determining input priority and placement
    $scope.isPrimaryKey = settings.isPrimaryKey;
    $scope.isHiddenKey = settings.isHiddenKey;

    $scope.showMore = false;
    $scope.toggleMore = function toggleMore() {
        $scope.showMore = !$scope.showMore;
    };

    $scope.showRelated = false;
    $scope.toggleRelated = function toggleRelated() {
        console.log($scope.requirement);
        $scope.showRelated = !$scope.showRelated;
    };

    $scope.jumpToOption = function jumpToOption(key) {
        $timeout(function () {
            $location.hash('input-' + key);
        }, 170);
    };

    function froalaExtend(e, editor) {
        // add at.js autocomplete after Froala init
        $scope.glossary.$promise.then(function (glossary) {
            $scope.glossary.terms = glossary.map(function (term) {
                return {name: term.Name, content: term.IRI};
            });
            // Add At.JS
            editor.$el.atwho({
                // key char for observing such as `@`
                // at: '`',
                at: '#',
                data: $scope.glossary.terms,
                displayTpl: '<li>${name}</li>',
                insertTpl: '${name}',
                startWithSpace: true,
                highlightFirst: true,
                editableAtwhoQueryAttrs: {
                    'glossary-term': true
                }
            });

            // insert space after term
            editor.$el.on('inserted.atwho', function () {
                // editor.html.insert(' ');
                editor.markers.remove();
            });

            editor.events.on('keydown', function (e) {
                if (e.which == $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
                    return false;
                }
            }, true);

            editor.button.bulkRefresh();
        });

    }

}
