'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Requirement Schema
 */
var RequirementSchema = new Schema({
    _firstSynced: {
        type: Date,
        default: Date.now
    },
    _lastSynced: {
        type: Date,
        default: Date.now
    },
    IRI: {
        type: String,
        default: '',
        required: '',
        trim: true,
        unique: ''
    },
    Label: {
        type: String,
        default: '',
        required: 'Please fill Requirement name',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    Properties: {
        type: Object,
        default: ''
    },
    UserID: {
        type: String
    }
}, {collection: 'Requirements'});

RequirementSchema.methods.iriEqual = function (iri) {
    //normalize IRIs and compare.
    var re = /^(http)?:\/{0,2}(www\.)?/i;
    return iri.replace(re, '') === this.IRI.replace(re, '');
};

mongoose.model('Requirement', RequirementSchema);
