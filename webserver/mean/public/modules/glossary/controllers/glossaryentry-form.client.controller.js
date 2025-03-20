'use strict';

// DERIVED FROM requirement-form.client.controller.js

// Glossary Entry Search controller
angular.module('glossary').controller('GlossaryEntryFormController', GlossaryEntryFormController);

GlossaryEntryFormController.$inject = ['$scope', 'moduleSettings'];
function GlossaryEntryFormController($scope, settings) {

    $scope.cleanPastedHtml = cleanPastedHtml;
    $scope.isPrimaryKey = settings.isPrimaryKey;
    $scope.isHiddenKey = settings.isHiddenKey;

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

}
