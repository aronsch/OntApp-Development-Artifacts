'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var admin = require('../../app/controllers/admin.server.controller');

    // Requirements Routes

    // Full list of admin
    app.route('/admin/users/:userId?')
        .all(users.requiresLogin)
        .get(admin.users.canView, admin.users.isModelRequest, admin.users.list)
        .put(admin.users.canEdit, admin.users.update)
        .post(admin.users.canCreate, admin.users.create);

    app.route('/admin/roles/:roleId?')
        .all(users.requiresLogin)
        .get(admin.roles.canView, admin.roles.isModelRequest, admin.roles.list)
        .put(admin.roles.canEdit, admin.roles.update)
        .post(admin.roles.canCreate, admin.roles.create)
        .delete(admin.roles.canDeleteRole, admin.roles.remove);

    app.route('/admin/export/')
        .all(users.requiresLogin)
        .get(admin.data.canExport, admin.data.export, admin.data.returnBlob)
};