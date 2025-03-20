'use strict';
/**
 * Directive that highlights terms in Description that are shared by
 * other requirements.
 */
angular.module('requirements').directive('requirementDescription', requirementDescription);

requirementDescription.$inject = ['$compile', '$templateCache'];
function requirementDescription($compile, $templateCache) {

    /**
     * Generate and cache a template for term link
     * popover content.
     * @param term
     */
    function template(term) {
        // Generate filename for cache
        var fakeFileId = 'term-link-template-' + term.Term + '.html';

        // Store filename in term object
        term.template = fakeFileId;

        // add template to template cache service
        $templateCache.put(fakeFileId,
            '<ul class="term-link-list list-unstyled">' +
            '<li class="term-link-list-item" ' +
            'ng-repeat="item in terms[\'' + term.Term + '\'].AlsoContainsTerm">' +
            '<a ng-click="openRequirementModal(item.Name)">{{ item.Name }}</a>' +
            '</li>' +
            '</ul>');
    }

    /**
     * Wrap a term in a link that opens a popover
     * list of requirements that also use the term.
     * @param token
     * @param term
     * @returns {string}
     */
    function wrapToken(token, term) {
        return '<a class="term-link" '
            + 'tabindex="0" '
            + 'title="Show other requirements that use this term" '
            + 'uib-popover-template="terms[\'' + term.Term + '\'].template" '
            + 'popover-trigger="focus"'
            + 'popover-title="Requirements with this term" '
            + 'popover-placement="bottom" '
            + '>'
            + token
            + '</a>';
    }

    return {
        restrict: 'E',
        scope: false,
        link: function preLink(scope, iElement, attrs) {
            scope.requirement = scope.requirement || scope.$parent.requirement;
            scope.template = scope.requirement.Properties.Description.Value;
            scope.terms = {};

            scope.template = scope.template
                .replace('contenteditable="true"', '')
                .replace('class="atwho-inserted"', '')
                .replace(/data-atwho-at-query=".*?"/ig, '');

            // split into tokens, keeping hyphenated words together as a single token
            // We retain whitespace and punctuation so the string can be joined together
            // after the tokens have been processed.
            scope.tokenized = scope.template.split(/([^-\w]|\s)/);

            angular.forEach(scope.requirement.Properties.Description.TermAnnotation, function (term, index) {
                // case insensitive RegEx matching entire string
                var re = new RegExp('\^' + term.Term + '\$', 'i');

                scope.terms[term.Term] = term;

                // generate popover template for term
                template(term);

                // Iterate through the tokens, wrapping
                // tokens that match the term in a link
                // tag that opens a popover with a list
                // of requirements that also use the term.
                angular.forEach(scope.tokenized, function (token, index) {
                    if (re.test(token)) {
                        scope.tokenized[index] = wrapToken(token, term);
                    }
                });
            });

            // Join all tokens to create the final template.
            scope.template = scope.tokenized.join("");
            // Compile and append the template
            iElement.append($compile('<p>' + scope.template + '</p>')(scope));
        }
    };
}
