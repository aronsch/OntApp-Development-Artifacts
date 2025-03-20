'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users.server.controller');
    var requirements = require('../../app/controllers/requirements.server.controller');

    // Requirements Routes
    app.route('/api*').all(users.requiresLogin);

    app.route('/api/requirements/:name?')
        .get(requirements.iriFromName,
            requirements.isLocked,
            requirements.getByIri,
            requirements.ontologySync)
        .put(requirements.canEdit,
            requirements.iriFromName,
            requirements.isLocked,
            requirements.update,
            requirements.unlock,
            requirements.ontologySync)
        .post(requirements.canCreate,
            requirements.isLocked,
            requirements.validate,
            requirements.stripPayLoad,
            requirements.create,
            requirements.unlock,
            requirements.ontologySync);

    app.route('/api/unlock/requirement/:name?')
        .get(requirements.canEdit,
            requirements.iriFromName,
            requirements.unlock,
            requirements.genericResolve);

    // Search Requirements
    app.route('/api/search')
        .get(requirements.listAll, requirements.ontologySync)
        .post(requirements.list, requirements.ontologySync);

    // Analyze Requirement
    app.route('/api/analyze')
        .post(requirements.analyze);

    // Search Requirements
    app.route('/api/similar')
        .post(requirements.getSimilar, requirements.forceArray);

    // Display Models
    app.route('/api/models/requirement')
        .get(requirements.displayModel);

    app.route('/api/models/requirement/edit')
        .get(requirements.editModel);

    app.route('/api/models/requirement/create')
        .get(requirements.createModel);

    app.route('/api/models/requirement/search')
        .get(requirements.searchModel);

    app.route('/api/models/requirement/subtypes')
        .get(requirements.subtypes);


};
