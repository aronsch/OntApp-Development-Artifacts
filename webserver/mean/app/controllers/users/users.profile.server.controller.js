'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object

    if (user && user.id === req.body.id) {
        User.findByIdAndUpdate(user._id, {
                $set: {
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    updated: Date.now()
                }
            },
            {
                new: true
            })
            .populate('roles')
            .exec(function (err, updated) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    req.login(updated, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(updated);
                        }
                    });
                }
            });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Send User
 */
exports.me = function (req, res) {
    if (req.user) {
        res.json(req.user);
    } else {
        res.json(null);
    }
};

