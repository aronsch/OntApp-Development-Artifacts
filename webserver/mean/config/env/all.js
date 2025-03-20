'use strict';

module.exports = {
    app: {
        title: 'REQS',
        description: '',
        keywords: 'REQS Requirement Management'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'ReqApp4084',
    sessionCollection: 'sessions',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/font-awesome/css/font-awesome.css',
                'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
                'public/lib/At.js/dist/css/jquery.atwho.css',
                'public/lib/froala-wysiwyg-editor/css/froala_editor.css',
                'public/lib/froala-wysiwyg-editor/css/froala_style.css'
            ],
            js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/index.js',
                'public/lib/angular-ui-event/dist/event.js',
                'public/lib/angular-ui-indeterminate/dist/indeterminate.js',
                'public/lib/angular-ui-mask/dist/mask.js',
                'public/lib/angular-ui-scroll/dist/ui-scroll.js',
                'public/lib/angular-ui-scrollpoint/dist/scrollpoint.js',
                'public/lib/angular-ui-uploader/dist/uploader.js',
                'public/lib/angular-ui-validate/dist/validate.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/moment/moment.js',
                'public/lib/underscore/underscore.js',
                'public/lib/froala-wysiwyg-editor/js/froala_editor.min.js',
                'public/lib/angular-froala/src/angular-froala.js',
                'public/lib/angular-froala/src/froala-sanitize.js',
                'public/lib/angular-scroll/angular-scroll.js',
                'public/lib/Caret.js/dist/jquery.caret.js',
                'public/lib/At.js/dist/js/jquery.atwho.js'

            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
