'use strict';

// Configuring the Articles module
angular.module('glossary').run(['Menus',
    function (Menus) {
        // Set top bar menu item
        Menus.addMenuItem({
            menuId: 'topbar',
            menuItemTitle: 'Glossary',
            menuItemURL: 'glossary',
            faIcon: 'fa fa-fw fa-book',
            menuItemType: null,
            menuItemUIRoute: null,
            isPublic: false,
            viewList: ['glossary.canView', 'glossary.canEdit', 'glossary.canCreate', 'glossary.canDeactivate'],
            position: null
        });
    }
])
    .run(function () {
        $.FroalaEditor.DefineIcon('termIcon', {NAME: 'hashtag'});
        $.FroalaEditor.RegisterCommand('addTerm', {
            title: 'Add Term',
            icon: 'termIcon',
            focus: false,
            undo: true,
            refreshAfterCallback: false,
            callback: function () {
                // manually trigger at.js dropdown
                this.html.insert('#');
                var keyUp = $.Event('keyup');
                keyUp.shiftKey = true;
                keyUp.which = '#'.charCodeAt(0);
                keyUp.key = "#";
                keyUp.keyCode = '#'.charCodeAt(0);
                this.$el.trigger(keyUp);
            }
        });
    });
