'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Requirement Schema
 */
var LockSchema = new Schema({
        iri: {
            type: String,
            unique: ''
        },
        ts: {
            type: Date,
            default: new Date
        },
        aid: {
            type: String
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }, { collection: 'Locks'});

mongoose.model('Lock', LockSchema);
