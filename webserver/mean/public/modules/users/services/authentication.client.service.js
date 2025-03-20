'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['PermissionsObj',
    function (PermissionsObj) {
        var _this = this;

        if (window.user) {
            window.user.permissions = new PermissionsObj(user.permissions);
        }

        _this._data = {
            user: window.user
        };

        return _this._data;
    }
]);