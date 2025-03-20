'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var comments = require('../../app/controllers/comments.server.controller');

    // Requirements Routes

    // Full list of comments
    app.route('/comments')
        .all(users.requiresLogin)
        .get(comments.list, comments.ontologySync)
        .post(comments.create, comments.syncInstance);

    // Get Comments for Requirement by Requirement IRI
    app.route('/comments/requirement/:name?')
        .all(users.requiresLogin)
        .get(comments.relatedIriFromName, comments.list, comments.ontologySync)
        .put(comments.relatedIriFromName, comments.update, comments.syncInstance)
        .post(comments.create, comments.syncInstance);

};