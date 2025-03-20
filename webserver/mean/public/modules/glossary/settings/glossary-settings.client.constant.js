'use strict';

angular.module('glossary').constant('glossarySettings', {
    typeahead: {
        minTriggerLength: 3, // number of consecutive keypresses
        maxTriggerInterval: 350, // all keypresses must occur within (n) ms
        delay: 350, // after triggering typeahead, interval before ui appears
        timeoutInterval: 2000 // dismiss if no further input after (n) ms
    }
});
