'use strict';

/*
 * COPEID FROM GlossaryEntrys.client.factory.js
 *
 * comments --> glossary
 * comment  --> glossaryentry
 * GlossaryEntry  --> GlossaryEntry
 */

//Requirements service used to communicate Requirements REST endpoints
angular.module('glossary').factory('GlossaryEntryObj', GlossaryEntryFactory);

GlossaryEntryFactory.$inject = [];
function GlossaryEntryFactory () {

    /**
     * Base GlossaryEntry prototype
     * @param glossaryentryObj
     * @constructor
     */
    function GlossaryEntry(glossaryentryObj) {
        angular.merge(this, glossaryentryObj);
        this.Class = "GlossaryEntry";
    }

    GlossaryEntry.prototype.$$editing = false;

    GlossaryEntry.prototype.editing = function () {
        return this.$$editing;
    };

    GlossaryEntry.prototype.edit = function () {
        this.$$editing = true;
        this.$$previous = this.Value;

    };

    GlossaryEntry.prototype.active = function () {
        return Boolean(this.Active);
    };

    GlossaryEntry.prototype.finishEditing = function () {
        this.$$editing = false;
        delete this.$$previous;
    };

    GlossaryEntry.prototype.cancelEditing = function () {
        this.$$editing = false;
        this.Value = this.$$previous;
        delete this.$$previous;
    };

    GlossaryEntry.prototype.hasDefinition = function () {
        return angular.isDefined(this.Value) && this.Value.length > 0;
    };

    GlossaryEntry.prototype.needsDefinition = function () {
        return !this.hasDefinition();
    };

    GlossaryEntry.prototype.createdDate = function () {
        return dateFrmStr(this.CreatedDateTime);
    };

    GlossaryEntry.prototype.relatedCount = function relatedCount() {
        return this.containsTerm ? this.containsTerm.length : 0;
    };
    GlossaryEntry.prototype.$$showRelated = false;
    GlossaryEntry.prototype.toggleRelated = function toggleRelated() {
        return this.$$showRelated = !this.$$showRelated;
    };
    GlossaryEntry.prototype.$$collapsed = false;
    GlossaryEntry.prototype.toggleCollapsed = function toggleRelated() {
        return this.$$collapsed = !this.$$collapsed;
    };

    function dateFrmStr (dateStr) {
        return moment.utc(dateStr, 'YYYY-MM-DD-HH:mm:ss:SS');
    }

    return GlossaryEntry;
}



