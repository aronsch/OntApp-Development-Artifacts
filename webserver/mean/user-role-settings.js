/**
 * Created by Aron on 2/7/17.
 */

exports.defaultRole = 'view';
exports.defaultRoles = [
    {
        name: 'domain admin',
        description: 'Administers all service information and data',
        active: true,
        private: true,
        removable: false,
        permissions: {
            requirements: {
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canView: true
            },
            users: {
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canView: true,
                canModifyOrganization: true
            },
            roles: {
                canView: true,
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canDelete: true
            },
            comments: {
                canComment: true,
                canModerate: true,
                canView: true
            },
            glossary: {
                canEdit: true,
                canCreate: true,
                canDeactivate: true,
                canView: true
            },
            data: {
                canExport: true,
                canUpload: true
            }
        }
    },
    {
        name: 'admin',
        description: 'Administers all organization data',
        active: true,
        private: false,
        removable: false,
        permissions: {
            requirements: {
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canView: true
            },
            users: {
                canCreate: true,
                canEdit: true,
                canView: true,
                canDeactivate: true
            },
            roles: {
                canView: true,
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canDelete: true
            },
            comments: {
                canComment: true,
                canModerate: true,
                canView: true
            },
            glossary: {
                canEdit: true,
                canCreate: true,
                canDeactivate: true,
                canView: true
            },
            data: {
                canExport: true,
                canUpload: true
            }

        }
    },
    {
        name: 'user',
        description: 'Standard user who can comment, create requirements and add glossary terms',
        active: true,
        private: false,
        removable: true,
        permissions: {
            requirements: {
                canCreate: true,
                canEdit: true,
                canDeactivate: true,
                canView: true
            },
            users: {
                canCreate: false,
                canEdit: false,
                canView: false
            },
            roles: {
                canView: false,
                canCreate: false,
                canEdit: false,
                canDeactivate: false,
                canDelete: false
            },
            comments: {
                canComment: true,
                canModerate: false,
                canView: true
            },
            glossary: {
                canEdit: true,
                canCreate: true,
                canDeactivate: true,
                canView: true
            },
            data: {
                canExport: true,
                canUpload: false
            }
        }
    },
    {
        name: 'view access',
        description: 'Default role given to all users allowing view access to requirements, glossary terms and comments',
        active: true,
        private: false,
        removable: true,
        permissions: {
            requirements: {
                canCreate: false,
                canEdit: false,
                canDeactivate: false,
                canView: true
            },
            users: {
                canCreate: false,
                canEdit: false,
                canView: false
            },
            roles: {
                canView: false,
                canCreate: false,
                canEdit: false,
                canDeactivate: false,
                canDelete: false
            },
            comments: {
                canComment: false,
                canModerate: false,
                canView: true
            },
            glossary: {
                canEdit: false,
                canCreate: false,
                canDeactivate: false,
                canView: true
            },
            data: {
                canExport: false,
                canUpload: false
            }

        },
        isDefault: true
    }
];
