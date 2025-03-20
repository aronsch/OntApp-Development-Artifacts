'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Requirement Schema
 */
var GlossaryEntrySchema = new Schema({
    IRI: {
        type: String,
        required: '',
        unique: ''
    },
    _firstSynced: {
        type: Date,
        default: Date.now
    },
    _lastSynced: {
        type: Date,
        default: Date.now
    },
    RelatedToIRI: {
        type: String
    },
    CreatedDateTime: {
        type: String,
        default: Date.now,
        required: ''
    },
    UpdatedDateTime: {
        type: String
    },
    Name: {
        type: String,
        default: '',
        required: '',
        trim: true
    },
    Value: {
        type: String,
        default: '',
        trim: true
    },
    UserName: {
        type: String
    },
    UserIRI: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('GlossaryEntry', GlossaryEntrySchema);
