'use strict';
var watch_r = require('watch_r');
var exec = require('child_process').exec, child;

watch_r('/mean/', function(err, watcher) {

    watcher.on('change', function(target) {
        console.log(target.path);
        child = exec('rsync -avz --exclude-from="rsync_exclude" ./mean/ rsync://localhost/mean/',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    });

    watcher.on('remove', function(target) {
        console.log(target.path);
        child = exec('rsync -avz --exclude-from="rsync_exclude" ./mean/ rsync://localhost/mean/',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    });
});