'use strict';

/**
 * Module dependencies.
 */
var ontology = require('../modules/ontology'),
    validation = require('../../validation-settings.js'),
    lockSettings = require('../../record-lock-settings.js'),
    ontologySettings = require('../../ontology-settings.js'),
    requirementValid = validation.requirements.validate,
    mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Requirement = mongoose.model('Requirement'),
    Lock = mongoose.model('Lock'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    debug = require('debug')('http');

exports.iriFromName = ontology.iriFromName;

/**
 * Display Models
 */
exports.createModel = function createModel(req, res) {
    ontology.getCreateModel(req, res);
};

exports.editModel = function editModel(req, res) {
    ontology.getEditModel(req, res);
};

exports.searchModel = searchModel;
function searchModel(req, res) {
    ontology.getSearchModel(req, res);
}

exports.displayModel = displayModel;

function displayModel(req, res) {
    ontology.getDisplayModel(req, res);
}

exports.subtypes = function subtypes(req, res) {
    ontology.getSubtypeModel(req, res);
};

/**
 * Validation
 */
exports.validate = validate;

function validate(req, res, next) {
    debug('Validate');
    debug(req.body);
    debug(requirementValid(req.body));

    if (requirementValid(req.body)) {
        next();
    } else {
        // if validation fails, return failing requirement object
        // annotated with errors
        res.status(400).json(req.body);
    }
}

/**
 * Create a Requirement
 */
exports.create = create;

function create(req, res) {
    ontology.create(req, res);
}

/**
 * Show the current Requirement
 */
exports.read = read;

function read(req, res, next, iri) {
    getByIri(req, res, next, iri);
}

/**
 * Update a Requirement
 */
exports.update = update;

function update(req, res, next) {
    if (_.isUndefined(req.params.iri) || req.params.iri.length === 0) {
        res.sendStatus(500);
        debug('No IRI specified');
        debug(req.query);
    } else {
        ontology.update(req, res, next);
    }
}

/**
 * Delete a Requirement
 */
exports.delete = deleteReq;

function deleteReq(req, res, next) {
    ontology.delete(req, res, next);
}

/**
 * Analyze a requirement
 */
exports.analyze = analyze;

function analyze(req, res) {
    ontology.analyze(req, res);
}

/**
 * Get similar requirements
 */
exports.getSimilar = getSimilar;

function getSimilar(req, res, next) {
    ontology.getSimilar(req, res, next);
}

/**
 * Get Requirement by IRI
 */
exports.getByIri = getByIri;

function getByIri(req, res, next) {
    if (!req.params.iri || req.params.iri.length === 0) {
        res.sendStatus(500, 'No IRI specified');
        debug('No IRI defined for getByIri');
        debug(req.query);
    } else {
        ontology.getInstance(req, res, req.params.iri, next);
    }
}

/**
 * Search Requirements
 */
exports.list = list;

function list(req, res, next) {
    ontology.search(req, res, next);
}

/**
 * Retrieve all Requirements
 */
exports.listAll = listAll;

function listAll(req, res, next) {
    ontology.getAll(req, res, next);
}

/**
 * If an Ontology call that should return an array doesn't,
 * return an empty array.
 *
 * TODO: remove these workarounds once OntServer returns arrays correctly
 */
exports.isArray = isArray;

function isArray(req, res, next) {
    if (_.isArray(req.ontData) && req.ontData.length) {
        if (next) {
            next();
        } else {
            res.json(req.ontData)
        }
    } else if (_.isObject(req.ontData)) {
        res.json([req.ontData]);
    } else {
        res.json([]);
    }
}

exports.forceArray = function (req, res) {
    isArray(req, res);
};

/**
 * Data Transformation
 */

exports.stripPayLoad = stripPayload;

function stripPayload(req, res, next) {
    // strip everything but the values out
    // request body.
    var payload = req.body;

    _.each(payload.Properties, function (p, key) {
        var iri = p.IRI || false;
        payload.Properties[key] = {
            Label: p.Label,
            Value: p.Value
        };
        if (iri) {
            payload.Properties[key].IRI = iri;
        }
    });
    next();
}

/**
 * Requirement middleware
 */


/**
 * Requirement authorization middleware
 */

exports.canCreate = function canCreate(req, res, next) {
    if (req.user.permissions.requirements.canCreate) {
        next();
    } else {
        res.status(403).send('Not authorized to create requirements');
    }
};

exports.canEdit = function canEdit(req, res, next) {
    if (req.user.permissions.requirements.canEdit) {
        next();
    } else {
        res.status(403).send('Not authorized to edit requirements');
    }
};
exports.canView = function canView(req, res, next) {
    if (req.user.permissions.requirements.canView) {
        next();
    } else {
        res.status(403).send('Not authorized to view requirements');
    }
};

/**
 * Ontology sync middleware
 * This piece of middleware intercepts data from the ontology and
 * caches it in Mongo.
 * @param req
 * @param res
 */
exports.ontologySync = function (req, res) {
    // replicate to mongo if replication enabled
    if (ontologySettings.replication.replicate) {
        if (_.isArray(req.ontData) && req.ontData.length) {
            // synchronize all returned records
            syncOntCollection(req.ontData, function (synced) {
                res.json(synced);
            }, res);
        } else if (_.isArray(req.ontData) && !req.ontData.length) {
            // return empty array if no records
            res.json(req.ontData);
        } else {
            // sync single record and return response
            ontSyncQuery(req.ontData).exec(sendDbResponse);
        }
    } else {
        // otherwise end response
        res.json(req.ontData);
    }

    function sendDbResponse(err, requirement) {
        if (err) {
            debug(err);
            res.status(500);
        } else {
            // append lock status to record
            if (requirement) requirement._locked = res._isLocked;
            res.json(requirement);
        }
    }

};

function getLock(iri) {
    return Lock.findOne({IRI: iri});
}

exports.isLocked = function (req, res, next) {
    if (lockSettings.enabled) {
        getLock(req.iri).exec(function (err, lock) {
            if (lock) {
                if (sessionCanModify(req, lock)) {
                    // if session owns lock, set as unlocked
                    lockKeepAlive(lock);
                    res._isLocked = false;
                    next();
                } else if (requestWillModify(req)) {
                    // reject Create, Update and Delete operations
                    // if session doesn't own lock
                    handleLockError(res);
                } else {
                    // mark record as locked during read operations
                    // if session does not own lock
                    res._isLocked = true;
                    next();
                }
            } else if (gettingForEdit(req)) {
                shouldLock(req, res, next);
            } else {
                // if no lock exists, return as unlocked
                res._isLocked = false;
                next();
            }
        });
    } else {
        res._isLocked = false;
        next();
    }
};

exports.shouldLock = shouldLock;

function shouldLock(req, res, next) {
    // lock if requested for editing
    if (lockSettings.enabled) {
        setLock(req.params.iri, req.sessionID, function (didLock, existingLock) {
            if (didLock) {
                // if a lock was obtained, continue request
                next();
            } else {
                // return error if lock is held by another user session
                handleLockError(res);
            }
        });
    } else {
        next();
    }
}

function lockKeepAlive(lock) {
    // extend session hold on lock by updating lock timestamp
    lock.update({ts: new Date}).exec();
}

function handleLockError(res) {
    res.status(423).send(JSON.stringify({message: 'Record is being edited by another user'}));
}

// determine if the current session holds this lock
function sessionCanModify(req, lock) {
    return req.sessionID === lock.aid;
}

exports.unlock = function (req, res, next) {
    // remove any existing session locks for the indicated iri
    removeLock(req.params.iri).exec(function () {
        res._isLocked = false;
        next();
    });
};

exports.genericResolve = function (req, res) {
    res.end();
};

function normalizeIri(iri) {
    var re = /^(http)?:\/{0,2}(www\.)?/i;
    return iri.replace(re, '');
}

// `true` if method would cause a record change
function requestWillModify(req) {
    return req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE';
}


// determine if a record lock is being requested
function gettingForEdit(req) {
    return req.method === 'GET' && req.query.forEditing;
}

// create a new lock
// returns boolean indicating lock created
function setLock(iri, sessionId, callback) {
    var lock = new Lock({
        iri: normalizeIri(iri),
        aid: sessionId
    });

    lock.save(function (saveErr) {
        var didLock = saveErr ? false : true;
        callback(didLock);
    });

}

// remove a record lock if it exist
function removeLock(iri) {
    return Lock.remove({iri: normalizeIri(iri)});
}

// for results sets, sync all results
function syncOntCollection(updates, callback, res) {
    var synced = [];

    _(updates).forEach(
        function (ontReq) {
            ontSyncQuery(ontReq)
                .exec(function (err, data) {
                    if (err) {
                        res.status(500)
                    } else {
                        syncComplete(data);
                    }
                });
        });

    function syncComplete(data) {
        // store result
        synced.push(data);
        // proceed when all results have been synced
        if (updates.length === synced.length) {
            // attach lock status
            if (lockSettings.enabled) {
                attachLockInfo(synced, callback);
            } else {
                callback(synced)
            }
        }
    }

    function attachLockInfo(synced, callback) {
        // retrieve all locks and add lock status
        // to results
        Lock.find({}, function (err, locks) {
            _.each(locks, function (lock) {
                // match any locks to results
                _.each(synced, function (s) {
                    if (normalizeIri(s.IRI) === lock.iri) {
                        s._locked = true;
                    } else if (s._locked !== true) {
                        s._locked = false;
                    }
                });
            });
            callback(synced);
        });
    }


}

/**
 * Sync the ontology instance with a cached version in the DB.
 * @param ontData
 * @param lockRecord
 * @param lockUser
 */
function ontSyncQuery(ontData) {
    // If instance exists, update. Otherwise create.
    // set lean() so query returns plain JS objects.
    return Requirement.findOneAndUpdate(
        {IRI: ontData.IRI},
        generateUpdate(ontData),
        {
            upsert: true, //create if not found
            new: true
        }
    ).lean();
}

function generateUpdate(ontData) {
    return {
        _lastSynced: Date.now(),
        IRI: ontData.IRI,
        Label: ontData.Label,
        Properties: ontData.Properties
    };
}

/**
 * Return pretty printed JSON string
 * @param json
 */
function prettyStr(json) {
    return JSON.stringify(json, '', 4);
}


