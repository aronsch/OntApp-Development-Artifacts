'use strict';

// Configuring the Articles module
angular.module('requirements').run(['Menus',
    function (Menus) {
        // Set top bar menu item
        Menus.addMenuItem({
            menuId: 'topbar',
            menuItemTitle: 'Admin',
            menuItemURL: 'admin',
            faIcon: 'fa fa-fw fa-gear',
            menuItemType: null,
            menuItemUIRoute: null,
            isPublic: false,
            viewList: ['users.canView', 'users.canEdit', 'users.canCreate',
                'roles.canView', 'roles.canEdit', 'roles.canCreate'],
            position: null
        });
    }
]);

