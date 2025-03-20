'use strict';

// Requirements Search controller
angular.module('requirements').controller('AnalyzeController', AnalyzeController);

AnalyzeController.$inject = ['$scope', '$sce', 'Requirement'];
function AnalyzeController($scope, $sce, Requirement) {

    $scope.analysis = {
        analyzed: false,
        hasIssues: false,
        issues: {}
    }; // analysis state

    $scope.analysisLoading = false;

    // Public function bindings
    $scope.analyze = analyze;

    // TODO: check highlighting
    /**
     * Analyze a requirement's Description property, checking for wording or phrasing that
     * that may indicate an ineffective, unclear or inappropriate project requirement.
     * @param requirement
     */
    function analyze(requirement) {
        Requirement.analyze(angular.copy(requirement)).$promise.then(function (analysis) {
            $scope.analysisLoading = false;
            // add analysis highlighing
            wrapOffenders(analysis, requirement);

            $scope.analysis = analysis;
            $scope.analysis.analyzed = true;

            /* Highlight words listed in each issue and remove elements that don't
             contain issue words */
            function wrapOffenders(analysis, requirement) {
                angular.forEach(analysis.issues, function (issue) {

                    // trim any whitespace from returned words
                    var words = issue.map(function (word) {
                        return word.trim()
                    });

                    /* Regex matching and all strings the words array, taking word boundaries into
                     account to prevent matches within other words. */
                    var re = new RegExp('(^|[\\s\\b>])(' + words.join('|') + ')(?=[\\s\\b\.\,<]|$)', 'gim');

                    /* Interpolation string that wraps match in a Span tag:
                     JS RegEx doesn't implement negative lookbehind, so we ensure a leading word boundary
                     by extracting that boundary as a capture group and then plopping it back in ahead
                     of the tag. */
                    var wrapStr = '$1<span class="text-danger requirement-analysis-offender">$2</span>';

                    // remove elements that don't contain issue words
                    issue.html = relevantContent(issue, requirement.Properties.Description.Value);

                    // match any matching words and wrap them in a highlighting span tag
                    issue.html = issue.html.replace(re, wrapStr);

                    // Set issue display html
                    issue.html = $sce.trustAsHtml(issue.html);
                });
            }

            // Return elements containing issue words
            function relevantContent(issue, content) {

                var contentEls = $(content),
                    textRe = new RegExp('(' + issue.join(')|(') + ')', 'gi'),
                    relevantEls;

                // filter elements to only those containing issue text
                relevantEls = contentEls.filter(function (idx, el) {
                    return textRe.test(el.innerText);
                });

                // return raw html string so that issue words can be wrapped easily
                return $('<div />').append(relevantEls).html();
            }
        });

        $scope.analysisLoading = true;
    }
}
