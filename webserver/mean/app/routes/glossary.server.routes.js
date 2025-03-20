'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var glossary = require('../../app/controllers/glossary.server.controller');

    // Requirements Routes

    // Full list of glossary
    app.route('/glossary')
        .all(users.requiresLogin)
        .get(glossary.list, glossary.ontologySync)
        .post(glossary.create, glossary.syncInstance);

    // Get Comments for Requirement by Requirement IRI
    app.route('/glossary/requirement/:name?')
        .all(users.requiresLogin)
        .get(glossary.relatedIriFromName, glossary.list, glossary.ontologySync)
        .put(glossary.relatedIriFromName, glossary.update, glossary.syncInstance)
        .post(glossary.create, glossary.syncInstance);

};
