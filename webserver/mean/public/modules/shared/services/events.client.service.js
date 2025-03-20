'use strict';

angular.module('shared').service('EventsService', eventsService);
angular.module('shared').constant('eventNames', eventNameConst());

eventsService.$inject = ['$rootScope', 'eventNames'];
function eventsService($rootScope, en) {

    function broadcast(eventKey, data) {
        $rootScope.$broadcast(eventKey, data)
    }

    function subscribe(eventKey, callbackFn) {
        $rootScope.$on(eventKey, callbackFn);
    }

    return {
        glossary: {
            hasUpdated: function () {
                broadcast(en.glossary.update.updated)
            },
            onUpdated: function (callbackFn) {
                subscribe(en.glossary.updated, callbackFn);
            },
            needsUpdate: function () {
                broadcast(en.glossary.updateNeeded)
            },
            onNeedsUpdate: function (callbackFn) {
                subscribe(en.glossary.updateNeeded, callbackFn);
            }
        }
    }
}

function eventNameConst() {
    return {
        glossary: {
            updated: 'ontapp.glossary.update.done',
            updateNeeded: 'ontapp.glossary.update.needed'
        }
    }
}