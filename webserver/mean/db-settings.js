"use strict";

var roleSettings = require('./user-role-settings.js'),
    lockSettings = require('./record-lock-settings.js');

exports.userCollectionSetup = function (userCollection) {
    userCollection.createIndex({"$**": "text"}, function (err) {
        if (!err) console.log('Users collection text index set up');
    });
};

exports.requirementCollectionSetup = function (requirementCollection) {
    requirementCollection.remove({}, function (err) {
        if (!err) console.log('Requirement collection emptied');
    }); // remove cached requirements on startup
    requirementCollection.createIndex({'$**': 'text'}, function (err) {
        if (!err) console.log('Requirement collection text index set up');
    });
};

exports.lockCollectionSetup = function (lockCollection) {
    /* Record Locking Collection Setup */
    // set timeout
    lockCollection.createIndex({ts: 1}, {expireAfterSeconds: lockSettings.lockTimeoutSeconds},
        function (err) {
            if (!err) console.log('Locks collection expiration set up')
        });
    lockCollection.createIndex({aid: 1}, {unique: false}, function (err) {
        if (!err) console.log('Locks collection field index set up')
    });
    lockCollection.createIndex({iri: 1}, {unique: true}, function (err) {
        if (!err) console.log('Locks collection unique iri index set up')
    });

};

exports.roleCollectionSetup = function (roleCollection) {
    //roleCollection.remove({}, function (err) {
    //    if (!err) console.log('Role collection emptied')
    //});
    roleCollection.createIndex({name: 1}, {unique: true}, function (err) {
        if (!err) console.log('Role collection unique name index set up')
    });
    roleCollection.insert(roleSettings.defaultRoles, function (err) {
        if (!err) console.log('Role collection default roles inserted')
    });
};