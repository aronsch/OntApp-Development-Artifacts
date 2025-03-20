'use strict';

angular.module('users').factory('PermissionsObj', PermissionsFactory);

PermissionsFactory.$inject = [];
function PermissionsFactory() {

    /**
     * @param permissionsObj
     * @constructor
     */
    function Permissions(permissionsObj) {
        angular.merge(this, permissionsObj);
    }

    Permissions.prototype.describe = function describePermissions() {
        var groups = [];
        angular.forEach(this, function (group, groupName) {
            // add group to descriptions if any permissions are true
            if (_.any(group)) {
                groups.push({
                    name: groupName,
                    permissionNames: []
                });
            }
            angular.forEach(group, function (permitted, name) {
                if (permitted) {
                    groups[groups.length - 1].permissionNames.push(describePermissionName(name))
                }
            });
        });
        return groups;
    };

    Permissions.prototype.viewList = function viewListFn() {
        var accessList = [];
        angular.forEach(this, function (group, groupName) {
            if (_.any(group)) {
                accessList.push(groupName + '.canView')
            }
            angular.forEach(group, function (permitted, action) {
                if (permitted) {
                    accessList.push(groupName + '.' + action);
                }
            });
        });
        return accessList;
    };

    Permissions.prototype.names = function names() {
        var nameObj = {};
        angular.forEach(this.permissions, function (group, groupName) {
            nameObj[groupName] = _.keys(group);
        });
        return nameObj;
    };

    Permissions.prototype.asArray = function asArray() {
        return _.map(this, function (group, key) {
            return {
                name: key,
                permissions: group,
                keyMaps: _.keys(group).map(function (key) {
                    var name = describePermissionName(key);
                    return {
                        key: key,
                        name: name,
                        labelClass: permissionLabelClass(name),
                        iconClass: permissionIconClass(name)
                    };
                })
            };
        })
    };

    Permissions.prototype.togglePermission = function togglePermission(group, name) {
        this[group][name] = !this[group][name];
    };

    function describePermissionName(name) {
        return name.replace(/([A-Z][a-z]+)/g, ' $1').replace(/^[a-z\s]+/, '');
    }

    Permissions.prototype.permissionLabelClass = permissionLabelClass;
    function permissionLabelClass(name) {
        var className;
        switch (name) {
            case 'Create':
            case 'Comment':
                className = 'label-success';
                break;
            case 'Edit':
                className = 'label-role-edit-permission';
                break;
            case 'Delete':
                className = 'label-danger';
                break;
            case 'Deactivate':
            case 'Moderate':
                className = 'label-warning';
                break;
            default:
                className = 'label-default';
        }
        return className;
    }

    Permissions.prototype.permissionIconClass = permissionIconClass;
    function permissionIconClass(name) {
        var className;
        switch (name) {
            case 'View':
                className = 'fa-eye';
                break;
            case 'Create':
                className = 'fa-pencil';
                break;
            case 'Comment':
                className = 'fa-comment';
                break;
            case 'Moderate':
                className = 'fa-comments';
                break;
            case 'Edit':
                className = 'fa-edit';
                break;
            case 'Delete':
                className = 'fa-trash';
                break;
            case 'Deactivate':
                className = 'fa-circle-o';
                break;
            default:
                className = '';
        }
        return className;
    }

    return Permissions;
}



