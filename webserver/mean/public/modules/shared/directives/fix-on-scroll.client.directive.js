'use strict';

angular.module('shared').directive('fixOnScroll', fixOnScroll);

fixOnScroll.$inject = ['$document', '$window'];
function fixOnScroll($document, $window) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            $document.on('scroll', function () {
                var maxHeight = $window.innerHeight - attrs.fixStart,
                    styleSet,
                    resetNavScroll;
                if ($document.scrollTop() >= attrs.fixStart) {
                    // reset vertical nav scroll position when
                    // we pass the fix position
                    resetNavScroll = !element.hasClass('fixed');
                    element.addClass('fixed');
                    styleSet = ['top:', attrs.fixStart, 'px;'].join('');

                } else {
                    resetNavScroll = element.hasClass('fixed');
                    element.removeClass('fixed');
                    styleSet = '';
                }
                // limit max height to viewport minus fix offset,
                // in case content height exceeds viewport height.
                element.attr('style', styleSet + ['max-height:' + maxHeight * 0.99 + 'px;'].join(''));
                if (resetNavScroll) element.scrollTop(0);
            });
        }
    }
}