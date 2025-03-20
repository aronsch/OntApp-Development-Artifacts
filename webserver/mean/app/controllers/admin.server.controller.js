'use strict';

var mongoose = require('mongoose'),
    ontology = require('../modules/ontology'),
    Requirement = mongoose.model('Requirement'),
    Lock = mongoose.model('Lock'),
    User = mongoose.model('User'),
    Role = mongoose.model('Role'),
    users = require('./users.server.controller'),
    _ = require('lodash');

exports.users = {};
exports.roles = {};
exports.data = {};

// User Admin

function scrubUserData(user) {
    user.password = undefined;
    user.salt = undefined;
    return user;
}

exports.users.create = function createUser(req, res) {
    (new User(req.body)).save(function (err, user) {
        if (err) {
            handleUpdateError(res, err);
        } else {
            res.json(scrubUserData(user));
        }
    })

};

exports.users.update = function updateUser(req, res) {

    // prevent users editing some critical fields in their own account
    if (req.user.id === req.params.userId) {
        // prevent user removing roles they don't manage
        req.body.roles = _.reject(req.body.roles, {removable: false});
    }

    User.findByIdAndUpdate(req.params.userId, req.body, {upsert: false, new: true},
        function (err, user) {
            if (err) {
                handleUpdateError(res, err);
            } else {
                res.json(scrubUserData(user));
            }
        });
};

function handleUpdateError(res, err) {
    if (err.code && err.code === 11000) {
        // 11000: duplicate index key error (username exists)
        res.status(409);
        res.json({
            errors: {
                username: {
                    message: 'Username already exists',
                    path: 'username'
                }
            }
        })
    } else if (err.name === 'ValidationError') {
        res.status(400);
        res.json(err);
    } else {
        console.error(err);
        res.sendStatus(500);
    }
}


exports.users.list = function listUsers(req, res) {
    var query = {},
        projection = {
            password: 0, // suppress
            hash: 0, // suppress
            score: {$meta: "textScore"}
        },
        search;

    if (req.query.all) {
        search = User.find(
            {
                organizationURL: req.user.organizationURL,
                $text: {
                    $search: req.query.all,
                    $caseSensitive: false
                }
            },
            projection)
            .sort({score: {$meta: "textScore"}});
    } else {
        search = User.find({organizationURL: req.user.organizationURL}, projection);
    }


    search.exec(function (err, users) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(users);
        }
    });
};


exports.users.isModelRequest = function isUserModelRequest(req, res, next) {
    if (req.query.model) {
        res.json(User.userModelForClient(req));
    } else {
        next();
    }
};


exports.users.canView = function canViewUser(req, res, next) {
    if (req.user.permissions.users.canView) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to view users'})
    }
};

exports.users.canCreate = function canCreateUser(req, res, next) {
    if (req.user.permissions.users.canCreate) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to create users'})
    }
};


exports.users.canEdit = function canEditUser(req, res, next) {
    if (req.user.permissions.users.canEdit) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to edit users'})
    }
};

// Role Admin

exports.roles.create = function createRole(req, res) {
    (new Role(req.body)).save(function (err, role) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(role);
        }
    })

};

exports.roles.update = function updateRole(req, res) {
    Role.findByIdAndUpdate(req.params.roleId, req.body, {upsert: false, new: true},
        function (err, role) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(role);
            }
        });
};

exports.roles.remove = function removeRole(req, res) {
    Role.findByIdAndRemove(req.params.roleId, function (err) {
        if (err) {
            console.error(err);
            res.sendStatus(500)
        } else {
            res.end();
        }
    })
};


exports.roles.list = function listRoles(req, res) {
    // hide private roles unless user is domain admin
    if (!req.user.permissions.users.canModifyOrganization) {
        req.query.private = false;
    }

    Role.find(req.query).exec(function (err, roles) {
        console.error(arguments);
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(roles);
        }
    });
};

exports.roles.isModelRequest = function isRoleModelRequest(req, res, next) {
    if (req.query.model) {
        res.json(Role.roleModelForClient());
    } else {
        next();
    }
};

exports.roles.canView = function canViewRole(req, res, next) {
    if (req.user.permissions.roles.canView) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to view roles'});
    }
};

exports.roles.canCreate = function canCreateRole(req, res, next) {
    if (req.user.permissions.roles.canCreate) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to create roles'});
    }
};


exports.roles.canEdit = function canEditRole(req, res, next) {
    if (req.user.permissions.roles.canEdit) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to edit roles'});
    }
};

exports.roles.canDeleteRole = function canDeleteRole(req, res, next) {
    if (req.user.permissions.roles.canDelete) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to delete roles'});
    }
};



// Data export

exports.data.canExport = function canExportData(req, res, next) {
    if (req.user.permissions.data.canExport) {
        next();
    } else {
        res.status(403).json({message: 'Not authorized to export Ontology data', misc: req.user.permissions});
    }
};

exports.data.returnBlob = function (req, res) {
    res.send(new Buffer(JSON.stringify(req.ontData), 'utf-8'));
};

exports.data.export = function (req, res, next) {
    ontology.getExport(req, res, next);
};