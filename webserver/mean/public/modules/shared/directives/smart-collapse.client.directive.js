'use strict';

(function () {
    angular.module('shared').directive('smartCollapse', smartCollapse);

    smartCollapse.$inject = ['$timeout', '$compile'];
    function smartCollapse($timeout, $compile) {
        return {
            restrict: 'A',
            scope: {
                collapsible: '=',
                updateCollapsibleOn: '='
            },
            link: function (scope, element, attrs) {
                $timeout(function () {
                    scope.$watch('updateCollapsibleOn', function () {
                        $timeout(function () {
                            if (element[0].offsetHeight < attrs.collapseTriggerSize) {
                                scope.collapsible.$$collapsed = false;
                            } else {
                                scope.collapsible.$$collapsed = true;
                                $(element)
                                    .append(
                                        '<div class="smart-collapse-expander text-center" ' +
                                        '   ng-click="collapsible.toggleCollapsed()">' +
                                        '<span class="smart-collapse-icon smart-collapse-ellipses">' +
                                        '<i class="fa fa-lg fa-ellipsis-h"></i></span>' +
                                        '<span class="smart-collapse-icon smart-collapse-caret">' +
                                        '<i class="fa fa-lg" ' +
                                        '   ng-class="collapsible.$$collapsed ? \'fa-caret-down\' : \'fa-caret-up\'"></i></span>' +
                                        '</div>'
                                    );
                                $(element).append(
                                    '<div class="gradient" ' +
                                    'ng-click="collapsible.toggleCollapsed()" />'
                                );
                                $compile(element.contents())(scope);
                            }
                        });
                    });
                }, 100);
            }
        };
    }

})();