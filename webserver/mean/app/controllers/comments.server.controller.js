'use strict';

/**
 * Module dependencies.
 */
var ontology = require('../modules/ontology'),
    validation = require('../../validation-settings.js'),
    mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash'),
    debug = require('debug')('http');

exports.relatedIriFromName = function relatedIriFromName(req, res, next) {
    req.params.RelatedToIRI = ontology.iriPathFromName(req, req.params.name);
    next();
};

/**
 * Create a Comment
 */
exports.create = create;

function create(req, res, next) {
    ontology.createComment(req, res, next, req.body.RelatedToIRI);
}

/**
 * Update a Comment
 */
exports.update = update;

function update(req, res, next) {
    ontology.updateComment(req, res, next);
}

/**
 * Delete a Comment
 */
exports.delete = deleteComment;

function deleteComment(req, res, next) {
    ontology.deleteComment(req, res, next);
}

/**
 * Get Comments for IRI
 */
exports.list = getComments;

function getComments(req, res, next) {
    if (_.isUndefined(req.params.RelatedToIRI) || req.params.RelatedToIRI.length === 0) {
        res.sendStatus(500);
        debug('No RelatedIRI defined');
        debug(req.query);
    } else {
        ontology.getCommentsForIri(req, res, next, req.params.RelatedToIRI);
    }
}

exports.get = getInstance;

function getInstance(req, res, next) {
    if (_.isUndefined(req.query.iri) || req.query.iri.length === 0) {
        res.sendStatus(500);
        debug('No IRI defined for getComments');
        debug(req.query);
    } else {
        ontology.getCommentInstance(req, res, next, req.query.iri);
    }
}

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function hasAuthorization(req, res, next) {
    // FIXME: Reactivate when Ont user implemented!
    //if (req.body.user.id !== req.user.id) {
    //    return res.status(403).send('User is not authorized');
    //}
    next();
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.cacheSync = function (req, res, next) {
    // TODO: modify to send IRI
    ontology.getInstance(req, res, next, req.cachedComment.IRI);
};

/**
 * Ontology sync middleware
 * This piece of middleware intercepts data from the ontology and
 * caches it in Mongo.
 * @param req
 * @param res
 */
exports.ontologySync = function (req, res) {
    debug('COMMENTS: %s', prettyStr(req.ontData));

    // take ontology data and update or create a DB cache version
    // fixme: fix mongo dupe id key erro
    //_(req.ontData).forEach(
    //    function (ontComment) {
    //        // bool that returns true when the last item is called
    //        syncOntInstance(ontComment, req, res);
    //    });

    res.json(req.ontData);
};

exports.syncInstance = function (req, res) {
    syncOntInstance(req.ontData, req, res);
};

/**
 * Sync the ontology instance with a cached version in the DB.
 * @param ontComment
 * @param req
 * @param res
 */
// FIXME: why do I keep getting duplicate key warnings when the IRIs are different? Disabled for now.
function syncOntInstance(ontComment, req, res) {
    //debug('COMMENT: %s', prettyStr(ontComment));
    //// array for collecting synced db records
    //if (!req.syncedData) req.syncedData = [];
    //
    //// If instance exists, update. Otherwise create.
    //Comment(ontComment)
    //    .save(function (err, syncedInst) {
    //        if (err) {
    //            debug(err);
    //            //res.status(500);
    //            res.json(ontComment);
    //        }
    //    });
    res.json(ontComment);
}

/**
 * If request should return an object instead of an array,
 * replace array with object at index 0
 * @param req
 */
function resultAsObj(req) {
    if (req.resultAsObj && req.syncedData.length === 1) {
        req.syncedData = req.syncedData[0];
    }
}


/**
 * Return pretty printed JSON string
 * @param json
 */
function prettyStr(json) {
    return JSON.stringify(json, '', 4);
}
