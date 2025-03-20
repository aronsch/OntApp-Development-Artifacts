'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    validUrl = require('valid-url'),
    _ = require('lodash'),
    orgSettings = require('../../organization-settings.js'),
    Role = mongoose.model('Role');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

var validateOrgUrl = function (url) {
    return validUrl.isUri(url);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        unique: 'Username exists',
        required: 'Please fill in a username',
        trim: true
    },
    organizationName: {
        type: String,
        default: orgSettings.organization.name,
        required: 'Please fill in an organization name',
        trim: true
    },
    organizationURL: {
        type: String,
        required: 'Please fill in a URL (it doesn\'t have to be a real one)',
        default: '', // CHANGED 2 DEC 2016 ORGANIZATION URL orgSettings.organization.url,
        validate: [validateOrgUrl, "URL is not properly formatted"],
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    active: {
        type: Boolean,
        default: true
    },
    roles: {
        type: [{
            type: Schema.ObjectId,
            ref: 'Role'
        }]
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {collection: 'Users'});

/* Roles setup */

// create virtual permissions path return list of permissions
UserSchema.virtual('permissions').get(function () {
    return this.derivePermissions();
});

// autopopulate role documents so virtual role functions work
UserSchema.pre('find', autoPopulateRoles);
UserSchema.pre('findOne', autoPopulateRoles);
UserSchema.pre('findOneAndUpdate', autoPopulateRoles);
UserSchema.pre('save', autoPopulateRoles);
function autoPopulateRoles(next) {
    this.populate('roles');
    next();
}

UserSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // delete sensitive before send
        delete ret.password;
        delete ret.salt;
        return ret;
    }
});
UserSchema.set('toObject', {
    getters: true,
    virtuals: true
});

UserSchema.virtual('nameLastFirst').get(function () {
    return this.lastName + ', ' + this.firstName;
});

UserSchema.virtual('nameFirstLast').get(function () {
    return this.firstName + ' ' + this.lastName;
});

UserSchema.pre('save', function (next) {
    // hash password on save
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

UserSchema.methods.derivePermissions = function derivePermissions() {
    var permissions = {}, keys = [];

    _.each(this.roles, function (role) {
        _.each(role.permissions, function (permissionGroup, key) {
            if (!permissions[key]) {
                permissions[key] = permissionGroup;
            } else {
                _.mergeWith(permissions[key], permissionGroup, function (newVal, curVal) {
                    // once a permission is marked true, retain that value
                    return curVal === true ? curVal : newVal;
                })
            }
        });
    });
    
    return permissions;
};

UserSchema.methods.addRoles = function addRoles(roles, callbackFn) {
    var _this = this;
    Role.find({name: {$in: roles}}, function (err, matched) {
        _this.update({$addToSet: {roles: {$each: matched}}}).then(handleAdded);
    });

    function handleAdded(status) {
        callbackFn(status);
    }
};

UserSchema.methods.removeRole = function removeRole(role, callbackFn) {
    this.update({$pull: {roles: {name: role}}}).then(callbackFn);
};


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

/**
 * Return
 * @param req
 * @returns {Object}
 */
UserSchema.statics.userModelForClient = function userModel(req) {
    var User = mongoose.model('User'),
        clientModel = (new User({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            displayName: '',
            roles: [],
            password: '',
            provider: 'local',
            organizationName: req.user.organizationName,
            organizationURL: req.user.organizationURL
        })).toJSON({virtuals: false});

    delete clientModel._id;
    delete clientModel.created;

    return clientModel;
};

mongoose.model('User', UserSchema);
