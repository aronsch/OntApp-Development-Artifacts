'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

/**
 * Role Schema
 */
// TODO: rename mongo model properties
var RoleSchema = new Schema({
    name: {
        type: String,
        unique: 'Role already exists',
        required: 'Role needs a name'
    },
    description: {
        type: String
    },
    permissions: {
        requirements: {
            canCreate: {type: Boolean, default: false},
            canEdit: {type: Boolean, default: false},
            canDeactivate: {type: Boolean, default: false},
            canView: {type: Boolean, default: true}
        },
        users: {
            canCreate: {type: Boolean, default: false},
            canEdit: {type: Boolean, default: false},
            canDeactivate: {type: Boolean, default: false},
            canView: {type: Boolean, default: false},
            canModifyOrganization: {type: Boolean, default: false}
        },
        roles: {
            canView: {type: Boolean, default: false},
            canCreate: {type: Boolean, default: false},
            canEdit: {type: Boolean, default: false},
            canDeactivate: {type: Boolean, default: false},
            canDelete: {type: Boolean, default: false}
        },
        comments: {
            canView: {type: Boolean, default: true},
            canComment: {type: Boolean, default: false},
            canModerate: {type: Boolean, default: false}
        },
        glossary: {
            canView: {type: Boolean, default: true},
            canCreate: {type: Boolean, default: false},
            canEdit: {type: Boolean, default: false},
            canDeactivate: {type: Boolean, default: false}
        },
        data: {
            canExport: {type: Boolean, default: false},
            canUpload: {type: Boolean, default: false}
        }

    },
    isDefault: {
        type: Boolean,
        default: false
    },
    removable: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    private: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {collection: 'Roles'});

RoleSchema.set('toJSON', {
    getters: true,
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // delete sensitive keys before send
        delete ret.private;
        delete ret.permissions.users.canModifyOrganization;
    }
});

RoleSchema.virtual('locked').get(function () {
    return !this.removable && !this.isDefault;
});

RoleSchema.virtual('canModify').get(function () {
    return this.removable && !this.isDefault;
});

RoleSchema.statics.roleModelForClient = function roleModel() {
    var Role = mongoose.model('Role');
    var clientModel = (new Role({name: ''})).toJSON();
    delete clientModel._id;
    delete clientModel.created;

    return clientModel;
};

mongoose.model('Role', RoleSchema);
