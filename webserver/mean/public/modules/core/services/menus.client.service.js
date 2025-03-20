'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', Menus);

function Menus() {
    // Define a set of default roles
    this.defaultViewList = ['*'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
        var userViewList;
        if (user) {
            userViewList = user.permissions.viewList();
            if (!!~this.viewList.indexOf('*')) {
                return true;
            } else {
                for (var userViewIndex in userViewList) {
                    for (var viewIndex in this.viewList) {
                        if (this.viewList[viewIndex] === userViewList[userViewIndex]) {
                            return true;
                        }
                    }
                }
            }
        } else {
            return this.isPublic;
        }

        return false;
    };

    // Validate menu existance
    this.validateMenuExistence = function (menuId) {
        if (menuId && menuId.length) {
            if (this.menus[menuId]) {
                return true;
            } else {
                throw new Error('Menu does not exist');
            }
        } else {
            throw new Error('MenuId was not provided');
        }

        return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
        // Validate that the menu exists
        this.validateMenuExistence(menuId);

        // Return the menu object
        return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, viewList) {
        // Create the new menu
        this.menus[menuId] = {
            isPublic: isPublic || false,
            viewList: viewList || this.defaultViewList,
            items: [],
            shouldRender: shouldRender
        };

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
        // Validate that the menu exists
        this.validateMenuExistence(menuId);

        // Return the menu object
        delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (options) {
        // Validate that the menu exists
        this.validateMenuExistence(options.menuId);

        // Push new menu item
        this.menus[options.menuId].items.push({
            title: options.menuItemTitle,
            link: options.menuItemURL,
            faIcon: options.faIcon,
            menuItemType: options.menuItemType || 'item',
            menuItemClass: options.menuItemType,
            uiRoute: options.menuItemUIRoute || ('/' + options.menuItemURL),
            isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
            viewList: ((options.viewList === null || typeof options.viewList === 'undefined') ? this.menus[menuId].viewList : options.viewList),
            position: options.position || 0,
            items: [],
            shouldRender: shouldRender
        });

        // Return the menu object
        return this.menus[options.menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, viewList, position) {
        // Validate that the menu exists
        this.validateMenuExistence(menuId);

        // Search for menu item
        for (var itemIndex in this.menus[menuId].items) {
            if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
                // Push new submenu item
                this.menus[menuId].items[itemIndex].items.push({
                    title: menuItemTitle,
                    link: menuItemURL,
                    uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                    isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
                    viewList: ((viewList === null || typeof viewList === 'undefined') ? this.menus[menuId].items[itemIndex].viewList : viewList),
                    position: position || 0,
                    shouldRender: shouldRender
                });
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
        // Validate that the menu exists
        this.validateMenuExistence(menuId);

        // Search for menu item to remove
        for (var itemIndex in this.menus[menuId].items) {
            if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                this.menus[menuId].items.splice(itemIndex, 1);
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
        // Validate that the menu exists
        this.validateMenuExistence(menuId);

        // Search for menu item to remove
        for (var itemIndex in this.menus[menuId].items) {
            for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                    this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                }
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar');
}