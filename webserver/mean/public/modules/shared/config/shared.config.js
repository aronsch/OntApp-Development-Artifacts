'use strict';

// set scrollspy defaults
angular.module('REQS')
    .value('duScrollOffset', 65)
    .value('duScrollBottomSpy', true)
    .value('froalaConfig', {
        key: window.reqsFroalaLicense,
        toolbarInline: false,
        pastePlain: true,
        htmlAllowedTags: ['a', 'address', 'b', 'br', 'button', 'caption', 'code', 'col', 'colgroup', 'datalist',
            'dd', 'div', 'dl', 'dt', 'em', 'embed', 'form', 'hgroup', 'i', 'img', 'li', 'ol', 'p', 'pre', 'select',
            'small', 'span', 'strike', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead',
            'tr', 'u', 'ul'],
        htmlAllowedAttrs: ['alt', 'class', 'cols', 'colspan', 'content', 'contenteditable', 'default', 'href',
            'hreflang', 'id', 'name', 'rows', 'rowspan', 'title', 'value'],
        htmlExecuteScripts: false,
        shortcutsEnabled: ['show', 'addTerm', 'bold', 'italic', 'underline', 'undo', 'redo'],
        toolbarButtons: ['show', 'bold', 'italic', 'underline', 'undo', 'redo']
    });