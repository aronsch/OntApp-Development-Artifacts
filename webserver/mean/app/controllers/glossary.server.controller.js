'use strict';

/* COPIED FROM comments.server.controller.js
 *
 * comments --> glossary
 * comment  --> glossaryentry
 * Comments --> Glossary
 * Comment  --> Glossary Entry
 */

/**
 * Module dependencies.
 */
var ontology = require('../modules/ontology'),
    validation = require('../../validation-settings.js'),
    mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    GlossaryEntry = mongoose.model('GlossaryEntry'),
    _ = require('lodash'),
    debug = require('debug')('http');

exports.relatedIriFromName = function relatedIriFromName(req, res, next) {
    // req.params.RelatedToIRI = ontology.iriPathFromName(req, req.params.name);
    next();
};

/**
 * Create a GlossaryEntry
 */
exports.create = create;

function create(req, res, next) {
    ontology.createGlossaryEntry(req, res, next, req.body.RelatedToIRI);
}

/**
 * Update a GlossaryEntry
 */
exports.update = update;

function update(req, res, next) {
    ontology.updateGlossaryEntry(req, res, next);
}

/**
 * Delete a GlossaryEntry
 */
exports.delete = deleteGlossaryEntry;

function deleteGlossaryEntry(req, res, next) {
    ontology.deleteGlossaryEntry(req, res, next);
}

/**
 * Get Glossary for IRI
 */
exports.list = getGlossary;

function getGlossary(req, res, next) {
//    if (_.isUndefined(req.params.RelatedToIRI) || req.params.RelatedToIRI.length === 0) {
//        res.sendStatus(500);
//        debug('No RelatedIRI defined');
//        debug(req.query);
//    } else {
        ontology.getGlossaryForIri(req, res, next, req.params.RelatedToIRI);
//    }
}

exports.get = getInstance;

function getInstance(req, res, next) {
    if (_.isUndefined(req.query.iri) || req.query.iri.length === 0) {
        res.sendStatus(500);
        debug('No IRI defined for getGlossary');
        debug(req.query);
    } else {
        ontology.getGlossaryEntryInstance(req, res, next, req.query.iri);
    }
}

/**
 * GlossaryEntry authorization middleware
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
    ontology.getInstance(req, res, next, req.cachedGlossaryEntry.IRI);
};

/**
 * Ontology sync middleware
 * This piece of middleware intercepts data from the ontology and
 * caches it in Mongo.
 * @param req
 * @param res
 */
exports.ontologySync = function (req, res) {
    debug('GLOSSARY: %s', prettyStr(req.ontData));

    // take ontology data and update or create a DB cache version
    // fixme: fix mongo dupe id key erro
    //_(req.ontData).forEach(
    //    function (ontGlossaryEntry) {
    //        // bool that returns true when the last item is called
    //        syncOntInstance(ontGlossaryEntry, req, res);
    //    });

    res.json(req.ontData);
};

exports.syncInstance = function (req, res) {
    syncOntInstance(req.ontData, req, res);
};

/**
 * Sync the ontology instance with a cached version in the DB.
 * @param ontGlossaryEntry
 * @param req
 * @param res
 */
// FIXME: why do I keep getting duplicate key warnings when the IRIs are different? Disabled for now.
function syncOntInstance(ontGlossaryEntry, req, res) {
    //debug('COMMENT: %s', prettyStr(ontGlossaryEntry));
    //// array for collecting synced db records
    //if (!req.syncedData) req.syncedData = [];
    //
    //// If instance exists, update. Otherwise create.
    //GlossaryEntry(ontGlossaryEntry)
    //    .save(function (err, syncedInst) {
    //        if (err) {
    //            debug(err);
    //            //res.status(500);
    //            res.json(ontGlossaryEntry);
    //        }
    //    });
    res.json(ontGlossaryEntry);
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
