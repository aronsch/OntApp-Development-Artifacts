'use strict';

(function () {
    // modified from http://stackoverflow.com/a/14837021/1971295
    angular.module('shared').directive('focusWhen', focusWhen);

    // focus on specified element when value is true
    function focusWhen($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusWhen, function (value, oldVal) {
                    if (value === true) {
                        $timeout(function () {
                            var el,
                                // case insensitive elem type name test
                                re = new RegExp(element[0].nodeName, 'i');

                            if (attrs.focusElement === 'froala') {
                                $(element).froalaEditor('events.focus');
                            } else if (attrs.focusElement) {
                                // if directive el doesn't match,
                                // find a child el that does
                                if (!re.test(attrs.focusElement)) {
                                    el = $(element).find(attrs.focusElement)[0];
                                }
                            } else {
                                // otherwise focus on directive element
                                el = element[0];
                            }
                            if (el) el.focus();
                        }, 0, false);
                    }
                });
            }
        };
    }

})();