'use strict';

// Configuring the Articles module
angular.module('requirements').run(['Menus',
    function (Menus) {



        // Set top bar menu items
        Menus.addMenuItem({
            menuId: 'topbar',
            menuItemTitle: 'Search',
            menuItemURL: 'search',
            faIcon: 'fa fa-fw fa-search',
            menuItemType: null,
            menuItemUIRoute: null,
            isPublic: false,
            viewList: ['requirements.canView'],
            position: null
        });

        Menus.addMenuItem({
            menuId: 'topbar',
            menuItemTitle: 'New',
            menuItemURL: 'create',
            faIcon: 'fa fa-fw fa-file',
            menuItemType: null,
            menuItemUIRoute: null,
            isPublic: false,
            viewList: ['requirements.canCreate'],
            position: null
        });

        Menus.addMenuItem({
            menuId: 'topbar',
            menuItemTitle: 'Interrogator',
            menuItemURL: 'interrogate',
            faIcon: 'fa fa-fw fa-user-secret',
            menuItemType: null,
            menuItemUIRoute: null,
            isPublic: false,
            viewList: ['requirements.canCreate', 'requirements.canEdit'],
            position: null
        });
    }
]);

