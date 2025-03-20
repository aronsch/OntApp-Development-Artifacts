"use strict";

// Dependencies
var http = require('http'),
    queryString = require('query-string'),
    url = require('url'),
    _ = require('lodash'),
    debug = require('debug')('http'),
    moment = require('moment'),
    path = require('path'),
    ontSettings = require('../../../ontology-settings.js'), // Ontology server settings file

// Ontology server request settings binding
    reqOptions = ontSettings.requestOptions,

// Generator for constructing ontology query models
    defaults = modelDefaults();


// Public Function Bindings
exports.createGraph = ontCreateGraph;
exports.getDisplayModel = getDisplayModel;
exports.getCreateModel = getCreateModel;
exports.getEditModel = getEditModel;
exports.getSearchModel = getSearchModel;
exports.getSubtypeModel = getSubtypeModel;
exports.getInstance = ontGet;
exports.getAll = getAll;
exports.getExport = getExport;
exports.search = ontSearch;
exports.create = ontCreate;
exports.update = ontUpdate;
exports.delete = ontDelete;
exports.analyze = ontAnalyze;
exports.getSimilar = ontSearchSimilar;
exports.createComment = createComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
exports.getCommentsForIri = getComments;
exports.getCommentInstance = getCommentInstance;
exports.createGlossaryEntry = createGlossaryEntry;
exports.updateGlossaryEntry = updateGlossaryEntry;
exports.deleteGlossaryEntry = deleteGlossaryEntry;
exports.getGlossaryForIri = getGlossary;
exports.getGlossaryEntryInstance = getGlossaryEntryInstance;


function ontCreateGraph(orgUrl) {
    var opts = _.clone(reqOptions.createGraph);
    opts.queryStrings.OrganizationURL = orgUrl;
    http.request(opts, resolve);

    function resolve(ontRes) {
        console.log('CREATE GRAPH', ontRes);
    }
}

/**
 * Get all glossary entrys associated with a Requirement.
 * @param req
 * @param res
 * @param next
 * @param iri
 */

function getGlossary(req, res, next, iri) {
    handleClientGetReq(reqOptions.glossary.search, req, resolve, {ReqIRI: iri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

/**
 * Get a specific glossary entry using its IRI
 * @param req
 * @param res
 * @param next
 * @param iri
 */
function getGlossaryEntryInstance(req, res, next, iri) {
    handleClientGetReq(reqOptions.glossary.search, req, resolve, {IRI: iri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

function createGlossaryEntry(req, res, next, requirementIri) {

    handleClientPostReq(reqOptions.glossary.create, req, resolve, {ReqIRI: requirementIri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

function updateGlossaryEntry(req, res, next) {
    handleClientPostReq(reqOptions.glossary.update, req, resolve);

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

}

function deleteGlossaryEntry(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res);
    }

    handleClientPostReq(reqOptions.glossary.delete, req, resolve);
}

// Comments

/**
 * Middleware function that renders IRI from requirement name.
 * @param req
 * @param res
 * @param next
 */
exports.iriFromName = function iriFromName(req, res, next) {
    req.params.iri = iriPathFromName(req, req.params.name);
    next();
};

/**
 * Render iri path for requirement name
 * @param name
 */
exports.iriPathFromName = iriPathFromName;
function iriPathFromName(req, name) {
    return path.join(req.user.organizationURL, 'data', 'requirements', name);
}


/**
 * Get all comment associated with a Requirement.
 * @param req
 * @param res
 * @param next
 * @param iri
 */
function getComments(req, res, next, iri) {
    handleClientGetReq(reqOptions.comments.search, req, resolve, {ReqIRI: iri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

/**
 * Get a specific requirement using its IRI
 * @param req
 * @param res
 * @param next
 * @param iri
 */
function getCommentInstance(req, res, next, iri) {
    handleClientGetReq(reqOptions.comments.search, req, resolve, {IRI: iri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

function createComment(req, res, next, requirementIri) {
    handleClientPostReq(reqOptions.comments.create, req, resolve, {ReqIRI: requirementIri});

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }
}

function updateComment(req, res, next) {
    handleClientPostReq(reqOptions.comments.update, req, resolve);

    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

}

function deleteComment(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res);
    }

    handleClientPostReq(reqOptions.comments.delete, req, resolve);
}


// Publicg Ontology Display Model Functions
/**
 * Get the model that will be used to display read-only content to
 * the user.
 * @param req
 * @param res
 */
function getDisplayModel(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes);
        // todo error handling
    }

    handleClientGetReq(reqOptions.models.display, req, resolve);
}

/**
 * Get the model that will be used to display Create forms.
 * @param req
 * @param res
 */
function getCreateModel(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes);

        // todo error handling
    }

    handleClientGetReq(reqOptions.models.create, req, resolve);
}

/**
 * Get the model that will be used to display Edit forms.
 * @param req
 * @param res
 */
function getEditModel(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes);
        // todo error handling
    }

    handleClientGetReq(reqOptions.models.edit, req, resolve);
}

/**
 * Get the model that will be used to display Search forms.
 * @param req
 * @param res
 */
function getSearchModel(req, res) {
    function resolve(ontRes) {

        handleOntIncomingResponse(req, res, ontRes);
        // todo error handling
    }

    handleClientGetReq(reqOptions.models.search, req, resolve);

}
/**
 * Get the model that will be used to display Search forms.
 * @param req
 * @param res
 */
function getSubtypeModel(req, res) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes);
        // todo error handling
    }

    handleClientGetReq(reqOptions.models.subtypes, req, resolve);
}

//Public Ontology CRUD Functions

/**
 * Get a specific instance from the ontology.
 * @param req
 * @param res
 * @param iri
 * @param next
 */
function ontGet(req, res, iri, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

    handleClientGetReq(reqOptions.getInstance, req, resolve, {IRI: iri});
    //http.request(reqOptions.getInstance, resolve)
    //    //.write(JSON.stringify(defaults.iriSearchObj(iri)))
    //    .end(JSON.stringify(defaults.iriSearchObj(iri)));
}

/**
 * Get a full list of requirements from the Ontology server.
 * @param req
 * @param res
 * @param next
 */
function getAll(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

    // Perform a blank search to retrieve all Requirements.
    var ontReq = http.request(reqOptions.search, resolve);
    ontReq.write(JSON.stringify(defaults.blankSearchObj()));
    ontReq.end();
}

/**
 * Get a full list of requirements from the Ontology server.
 * @param req
 * @param res
 * @param next
 */
function getExport(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

    handleClientGetReq(reqOptions.getExport, req, resolve);
}

/**
 * Routes client search requests to Ontology.
 * TODO: Waiting for Ontology enhancement to add response for get requests
 * @param req
 * @param res
 * @param next
 */
function ontSearch(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
    }

    if (req.body === {} || req.body === '') {
        req.body = defaults.blankSearchObj();
    } else {
        req.body = defaults.searchObjWithProperties(req.body.Properties);
    }
    handleClientPostReq(reqOptions.search, req, resolve);

}

/**
 * Routes client search requests to Ontology.
 * @param req
 * @param res
 * @param next
 */
function ontCreate(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
        // todo error handling
    }

    handleClientPostReq(reqOptions.create, req, resolve, null, true);
}

// Routing Functions

/**
 * Routes client update requests to Ontology.
 * TODO update
 * @param req
 * @param res
 * @param next
 */
function ontUpdate(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
        // todo error handling
    }

    handleClientPostReq(reqOptions.update, req, resolve, {IRI: req.body.IRI}, true);

}


/**
 * Routes client delete requests to Ontology.
 * TODO delete
 * @param req
 * @param res
 * @param next
 */
function ontDelete(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
        // todo error handling
    }

    handleClientPostReq(reqOptions.delete, req, resolve);
}

/**
 * Routes client analysis requests to Ontology.
 * @param req
 * @param res
 * @param next
 */
function ontAnalyze(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next, {});
    }

    handleClientPostReq(reqOptions.analyze, req, resolve, null, true);
}

/**
 * Routes client "similar instances" requests to Ontology.
 * TODO similar
 * @param req
 * @param res
 * @param next
 */
function ontSearchSimilar(req, res, next) {
    function resolve(ontRes) {
        handleOntIncomingResponse(req, res, ontRes, next);
        // todo error handling
    }

    handleClientPostReq(reqOptions.similar, req, resolve, null, true);

}


//Request and Response Handlers

/**
 * Attach response data from the ontology to client response, then end client request or release
 * to the supplied next middleware layer.
 * @param req
 * @param res
 * @param ontRes
 * @param next
 */
function handleOntIncomingResponse(req, res, ontRes, next, dummyJsonResp) {
    // if OntServer call failed explicitly, return status to client
    if (ontRes.statusCode !== 200) {
        res.status(ontRes.statusCode);
        // return status message specified in ontology settings
        console.error('Ontology Generated Error: ', ontRes.statusCode, ontRes.body);
        res.end(ontSettings.statusMessages[ontRes.statusCode] || '');
        return;
    }

    req.ontData = '';
    //// collect chunked response data
    ontRes.on('data', function (chunk) {
        req.ontData += chunk;
    });

    // debug logging event
    res.on('finish', function () {
        logResponse(req, ontRes)
    });

    // When all data received
    ontRes.on('end', function () {
        // attach data to original client request when all data has been received

        if (!isJSON(req.ontData) && !dummyJsonResp) {
            // Respond with server error if response data is not valid JSON
            if (req.ontReqOptions) {
                logResponse(req, ontRes)
            }
            debug('Error - Ontology Returned Status %s', ontRes.statusCode);
            debug('Ontology path requested: %s', ontRes.connection._httpMessage.path);
            debug('Ontology did not return valid JSON - Returned from Ontology: %s',
                cleanOntJSON(req.ontData));

            // Send error to client
            res.status(500).send(
                'Internal Server Error - Ontology server did not respond with valid JSON. Responded with:\r\n'
                + req.ontData);

        } else if (!isJSON(req.ontData) && dummyJsonResp) {
            res.json(dummyJsonResp);
        } else if (next) {
            // release request to next middleware, if present
            req.ontData = parseOntJSON(req.ontData);
            logResponse(req, ontRes);

            next();

        } else {
            // if there is no middleware, close request and send directly to client
            res.json(parseOntJSON(req.ontData));
        }

    });
}

function logResponse(req, ontRes) {
    debug('Request Options:', req.ontReqOptions);
    debug('Ontology Response Recieved - Status %s', ontRes.statusCode);
    debug('Client Body Data Sent to Ontology: %s', prettyStr(req.body));
}

/**
 * Route a POST request and data from the client to the Ontology.
 * @param reqOptions Ontology http request options
 * @param req Request from client with POST payload
 * @param handlerFn Callback Function
 */
function handleClientPostReq(reqOptions, req, handlerFn, queryStrings, stripData) {
    var payload;
    req.ontReqOptions = _.clone(reqOptions);

    // merge any query strings from client request
    if (queryStrings) {
        _.assign(req.ontReqOptions.queryStrings, queryStrings);
    }

    // set user org attribute query string
    setOrgAttribute(req.ontReqOptions, req);
    // add query strings to url path
    attachQueryString(req.ontReqOptions);
    // add user info to header
    setUserData(req.ontReqOptions, req);

    console.log(req.ontReqOptions);

    if (stripData) {
        payload = stripPayload(req.body);
        payload.Class = 'Requirement';
    } else {
        payload = req.body;
    }

    payload.user = req.user;

    http.request(req.ontReqOptions, handlerFn)
        .end(JSON.stringify(payload));
}

function stripPayload(payload) {
    // strip mongo data
    _.forEach(_.keys(payload), function (key) {
        if (/^[_\$]/.test(key)) {
            delete payload[key];
        }

    });

    return payload;
}

/**
 * Route a GET request from the client to the Ontology.
 * @param reqOptions Ontology http request options
 * @param handlerFn Callback Function
 * @param req
 * @param queryStrings
 */

function handleClientGetReq(reqOptions, req, handlerFn, queryStrings) {

    req.ontReqOptions = _.clone(reqOptions);

    // merge any query strings from client request
    if (queryStrings) {
        _.assign(req.ontReqOptions.queryStrings, queryStrings);
    }
    // set user org attribute query string
    setOrgAttribute(req.ontReqOptions, req);
    // add query strings to url path
    attachQueryString(req.ontReqOptions);
    // add user info to header
    setUserData(req.ontReqOptions, req);

    console.log(req.ontReqOptions);
    http.request(req.ontReqOptions, handlerFn)
        .end();
}

/**
 * Add `OrganizationURL` parameter to url path if `includeOrganizationUrl`
 * setting is true.
 * @param reqOptions
 * @param req
 */
function setOrgAttribute(reqOptions, req) {
    reqOptions.queryStrings.OrganizationURL = req.user.organizationURL;
    reqOptions.headers.OrganizationURL = req.user.organizationURL;

}

/**
 * Attach all query strings to url path
 * @param reqOptions
 */
function attachQueryString(reqOptions) {
    reqOptions.path += '?' + queryString.stringify(reqOptions.queryStrings);
}

/**
 * Utility - Return pretty printed JSON string
 * @param json
 */
function prettyStr(json) {
    return JSON.stringify(json, '', 4);
}

/**
 * Utility - Test for valid JSON
 * @param str {string}
 * @returns {boolean}
 */
function isJSON(str) {
    try {
        JSON.parse(cleanOntJSON(str));
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Utility - Parse JSON from ontology after cleaning it.
 * @param json
 */
function parseOntJSON(json) {
    return JSON.parse(cleanOntJSON(json));
}

/**
 * Utility - Clean any possible invalid json from Ontology.
 * @param json
 * @returns {XML|void|string}
 */
function cleanOntJSON(json) {
    // remove newlines
    json = json.replace(/(\r\n|\n|\r)/gm, " ");
    // remove invalid "null" values
    json = json.replace(/"null"/g, '""');
    return json;
}

/**
 * Generator for constructing ontology query models.
 * @type {{blankSearchObj: Function, iriSearchObj: Function, nameSearchObj: Function, generalSearchObj: Function, searchObjWithProperties: Function}}
 */
function modelDefaults() {
    return {
        blankSearchObj: function () {
            return {
                'Class': '',
                'Label': '',
                'IRI': '',
                'Properties': {'GeneralSearchTerm': ''},
                'ActionButton': {'ActionButtonName': 'Submit'}
            }
        },
        iriSearchObj: function (iri) {
            var searchObj = this.blankSearchObj();
            searchObj.IRI = iri;
            return searchObj;
        },
        nameSearchObj: function (name) {
            var searchObj = this.blankSearchObj();
            searchObj.Properties.Name = {
                Value: name
            };
            return searchObj;
        },
        generalSearchObj: function (searchStr) {
            var searchObj = this.blankSearchObj();
            searchObj.Properties.GeneralSearchTerm = searchStr;
            return searchObj;
        },
        searchObjWithProperties: function (properties) {
            var searchObj = this.blankSearchObj();

            if (!_.isEmpty(properties)) {
                searchObj.Properties = properties;
            } else if (!_(searchObj).has('GeneralSearchTerm')) {
                searchObj.Properties['GeneralSearchTerm'] = '';
            }
            return searchObj;
        }
    }
}

/**
 * Add `user` information to url path
 *
 * @param reqOptions
 * @param req
 */
function setUserData(reqOptions, req) {
    reqOptions.headers.UserID = req.user._id.toString();
    reqOptions.headers.UserFirstName = req.user.firstName;
    reqOptions.headers.UserLastName = req.user.lastName;
    reqOptions.headers.UserName = req.user.username;
    reqOptions.headers.UserEmail = req.user.email;
    reqOptions.headers.UserRoles = req.user.roles.map(function (role) {
        return role.name
    }).join(',');

}
