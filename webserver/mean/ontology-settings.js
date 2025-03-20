/**
 * Created by Aron on 3/2/15.
 */
'use strict';

var statusMessages = {
    403: 'Ontology access not authorized',
    404: 'Requirement not found',
    409: 'Requirement already exists',
    423: 'Requirement is being edited by another user',
    500: 'Server error'
};

var server = {
        hostname: 'ontserver',
        port: 8080,
        basePath: '/OntApp/OntWebServlet',
        headers: {
            'Accept': 'application/json'
        },
        postHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    requestOptions = {
        createGraph: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'PUT',
            headers: server.headers,
            queryStrings: {
                referer: 'Create',
                Entity: 'Graph'
            }
        },
        getExport: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'GET',
            headers: server.headers,
            queryStrings: {
                referer: 'Search',
                Entity: 'Req'
            }
        },
        models: {
            display: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Display',
                    Entity: 'Req'
                }
            },
            create: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Create',
                    Entity: 'Req'
                }
            },
            edit: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Edit',
                    Entity: 'Req'
                }
            },
            search: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Search',
                    Entity: 'Req'
                }
            },
            subtypes: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'InterrogativeAnalysis'
                }
            },
            glossary: {                 // CHANGED 18 OCT 2016 - Added glossary
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Glossary',
                    Entity: 'GlossaryEntrys'
                }
            },
            export: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Export',
                    Entity: 'Data'
                }
            },
            import: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.headers,
                queryStrings: {
                    HMISelection: 'Import',
                    Entity: 'Data'
                }
            }
        },
        get: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'GET',
            headers: server.headers,
            queryStrings: {
                referer: 'Instance',
                Entity: 'Req'
            }
        },
        getInstance: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'GET',
            headers: server.headers,
            queryStrings: {
                referer: 'Instance',
                Entity: 'Req'
            }
        },
        getAll: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Search',
                Entity: 'Req'
            }
        },
        search: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Search',
                Entity: 'Req'
            }
        },
        create: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Create',
                ProcessType: 'Create',
                Entity: 'Req'
            }
        },
        update: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Update',
                Entity: 'Req'
            }
        },
        delete: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Delete',
                Entity: 'Req'
            }
        },
        analyze: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Analysis',
                AnalysisType: 'TextTermAnalysis'
            }
        },
        similar: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Analysis',
                AnalysisType: 'SimilarityAnalysis'
            }
        },
        interrogate: {
            path: server.basePath,
            hostname: server.hostname,
            port: server.port,
            method: 'POST',
            headers: server.postHeaders,
            queryStrings: {
                referer: 'Analysis',
                AnalysisType: 'InterrogativeAnalysis'
            }
        },
        comments: {
            search: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Search',
                    Entity: 'Comment'
                }
            },
            create: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Create',
                    Entity: 'Comment'
                }
            },
            update: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Update',
                    Entity: 'Comment'
                }
            },
            delete: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Delete',
                    Entity: 'Comment'
                }
            }
        },
        glossary: {  // ADDED 17 OCT 2016
            search: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'GET',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Search',
                    Entity: 'GlossaryEntrys'
                }
            },
            create: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Create',
                    Entity: 'GlossaryEntry'
                }
            },
            update: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Update',
                    Entity: 'GlossaryEntry'
                }
            },
            delete: {
                path: server.basePath,
                hostname: server.hostname,
                port: server.port,
                method: 'POST',
                headers: server.postHeaders,
                queryStrings: {
                    referer: 'Delete',
                    Entity: 'GlossaryEntry'
                }
            }
        }
    },
    replication = {
        replicate: false
    };

exports.statusMessages = statusMessages;
exports.server = server;
exports.requestOptions = requestOptions;
exports.replication =  replication;