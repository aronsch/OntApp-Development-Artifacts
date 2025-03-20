'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('requirements').factory('OntProperty', OntPropertyFactory);

OntPropertyFactory.$inject = ['$filter', '$sce', 'moduleSettings'];
function OntPropertyFactory($filter, $sce, settings) {

    /**
     * Base OntProperty prototype
     * @param p
     * @param key
     * @constructor
     */
    function OntProperty(p, key) {
        angular.extend(this, p);
        propertyFormatObj(this);
        this.$$key = key;
    }

    OntProperty.prototype.set = function (val) {
        // ignore unchanged value
        if (this.Value === val) return;

        // set value and mark dirty
        this.Value = val;
        this.$$dirty = true;
    };

    OntProperty.prototype.isDefined = angular.isDefined;
    OntProperty.prototype.isUndefined = angular.isUndefined;

    OntProperty.prototype.toString = function toString(arrNewLineHTML) {
        var seperator = arrNewLineHTML ? '<br />' : ', ';

        if (this.isDate()) {
            return $filter('ontDate')(this.Value)
        } else if (this.isSmallText() || this.isLargeText()) {
            return this.Value;
        } else if (this.$$key === 'RelatedRequirements') {
            return _.sortBy(this.Value.map(function (rel) {
                return (rel.Relation === 'SuperRequirement' ?
                        '⬆ ' : '⬇ ') + rel.Label;
            }), 'Relation').join(seperator);
        } else if (this.hasEnumeration()) {
            return this.Value.Label || this.Value;
        }else if (this.isList() || this.isArray()) {
            return this.Value.join(seperator);
        }
    };

    OntProperty.prototype.defaultValue = function () {
        return this.$$format.defaultValue;
    };

    OntProperty.prototype.hasDefaultValue = function () {
        return this.isDefined(this.$$format.defaultValue);
    };

    OntProperty.prototype.htmlValue = function () {
        return $sce.trustAsHtml(this.toString(true));
    };

    OntProperty.prototype.dateValue = function () {
        return moment.utc(this.Value, 'YYYY-MM-DD-HH:mm:ss:SS-Z');
    };
    OntProperty.prototype.isSmallText = function isSmallText() {
        return this.$$format.string && !this.$$format.large && !this.hasEnumeration();
    };

    OntProperty.prototype.isLargeText = function isLargeText() {
        return this.$$format.string && this.$$format.large;
    };

    OntProperty.prototype.isDate = function isDate() {
        return this.$$format.date;
    };

    OntProperty.prototype.isBoolean = function isBoolean() {
        return this.$$format.boolean;
    };

    OntProperty.prototype.isReadOnly = function isReadonly() {
        return this.$$format.readonly || settings.isReadOnlyKey(this.$$key);
    };

    OntProperty.prototype.isHidden = function isHidden() {
        return this.$$format.hidden;
    };

    OntProperty.prototype.isRequired = function isRequired() {
        return this.$$format.required;
    };
    OntProperty.prototype.isPrimary = function isPrimary() {
        return this.$$format.primary;
    };
    OntProperty.prototype.isList = function isList() {
        return this.$$format.list;
    };

    OntProperty.prototype.isAlwaysVisible = function isAlwaysVisible() {
        return this.$$alwaysDisplay
    };
    OntProperty.prototype.isArray = function isArray() {
        return _.isArray(this.Value);
    };

    OntProperty.prototype.hasValue = function hasValue() {
        return settings.propertyHasValue(this);
    };

    OntProperty.prototype.hasEnumeration = function hasEnumeration() {
        return angular.isDefined(this.Enum) && this.Enum.length > 0;
    };

    /**
     * Single selection enums - set selected Enum as property value.
     * TODO: remove this if nothing uses it
     * @param idx
     */
    OntProperty.prototype.select = function (idx) {
        this.Enum[idx].$$selected = true;
        this.value = this.textValue();
    };

    /**
     * Multiselection enums - add selected Enum items to array of selected values.
     * TODO: remove this if nothing uses it
     * @param idxs {Array}
     */
    OntProperty.prototype.multiselectAdd = function (idxs) {
        var idx;
        if (!this.isArray()) {
            this.Value = [];
        }
        for (idx = 0; i < idxs.length; i++) {
            this.Enum[idx].$$selected = true;
            this.Value.push(this.Enum[idx]);
        }
    };

    /**
     * Remove Enum items at indices from array of selected values.
     * @param idxArr {Array}
     */
    OntProperty.prototype.multiselectRemove = function (idxArr) {
        var idx;

        // Sort indices in ascending order
        idxArr.sort();

        // To prevent array index changes while splicing, remove indices
        // in descending order
        for (idx = idxArr.length - 1; i >= 0; i--) {
            this.Value.splice(idx, 1);
        }
    };

    // Todo: is this needed?
    OntProperty.prototype.getSelected = function () {
        return _.where(this.Enum, {$$selected: true});
    };

    OntProperty.prototype.selectByLabel = function (label) {
        var enumItem = _.find(this.Enum, function (e) {
            return e.Label === label
        });
        enumItem.$$selected = true;
        this.value = this.textValue();
    };

    OntProperty.prototype.textValue = function () {
        return _.pluck(this.getSelected(), 'Label').join(', ')
    };

    OntProperty.prototype.options = function () {
        var opts = [];
        _.each(this.Enum, function (e) {
            opts.push({label: e.Label, value: e.Label});
        });

        return opts;
    };

    OntProperty.prototype.range = function parseRange() {
        return {min: this.$$format.min, max: this.$$format.max};
    };

    /**
     * Construct format information object by parsing `Format` key string.
     * @param p
     */
    function propertyFormatObj(p) {
        var formatStr = p.Format,
            formatParsing = {
                simpleKeys: [
                    {re: /text/, key: 'string'},
                    {re: /large/, key: 'large'},
                    {re: /integer/, key: 'integer'},
                    {re: /decimal/, key: 'decimal'},
                    {re: /float/, key: 'float'},
                    {re: /(date)(?!(time))/, key: 'date'}, // checks to ensure 'date' string is distinct from 'datetime'
                    {re: /datetime/, key: 'datetime'},
                    {re: /boolean/, key: 'boolean'},
                    {re: /readonly/, key: 'readonly'},
                    {re: /required/, key: 'required'},
                    {re: /hidden/, key: 'hidden'},
                    {re: /primary/, key: 'primary'},
                    {re: /list/, key: 'list'}],
                complexKeys: {
                    rangeRe: /range\[[\d,]+]/,
                    lengthRe: /maxlength\[[\d,]+]/,
                    booleanDefRe: /boolean\[(true|false)\]/
                }
            },
            formatObj = {},
            simpleKeys,
            cmplxKeys = {};

        simpleKeys = formatParsing.simpleKeys;
        cmplxKeys.rangeRe = formatParsing.complexKeys.rangeRe;
        cmplxKeys.lengthRe = formatParsing.complexKeys.lengthRe;
        cmplxKeys.booleanDefRe = formatParsing.complexKeys.booleanDefRe;

        // Iterate through simple format keys, matching RegEx
        // for each key. Then add the key with boolean indicating
        // whether it was found.
        angular.forEach(simpleKeys, parseSimpleKey, this);


        // Determine if selection range is provided
        // and parse if present.
        if (cmplxKeys.rangeRe.test(formatStr)) {
            formatObj.range = true;
            parseRange(formatStr.match(cmplxKeys.rangeRe));
        } else {
            formatObj.range = false;
        }

        if (cmplxKeys.rangeRe.test(formatStr)) {
            formatObj.lengthRe = true;
            parseMaxLength(formatStr.match(cmplxKeys.lengthRe));
        } else {
            formatObj.range = false;
        }

        if (cmplxKeys.booleanDefRe.test(formatStr)) {
            formatObj.defaultValue = formatStr.match(cmplxKeys.booleanDefRe)[1] === "true";
        }

        /**
         * Test formatStr for format Regex
         * @param format Regex to test
         */
        function parseSimpleKey(format) {
            formatObj[format.key] = format.re.test(formatStr);
        }

        function parseMaxLength(format) {
            formatObj.maxLength = parseInt(format.match(/\d+/));
        }

        function parseRange(format) {
            var rangeLimits = format.match(/\d+,\d+/).split(',');
            formatObj.min = parseInt(rangeLimits[0]);
            formatObj.max = parseInt(rangeLimits[1]);
        }

        p.$$format = formatObj;

    }

    return OntProperty;
}



