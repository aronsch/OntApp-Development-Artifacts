'use strict';

angular.module('glossary').service('TypeaheadState', TypeaheadState);
angular.module('glossary').directive('glossaryTypahead', glossaryTypahead);

TypeaheadState.$inject = ['glossarySettings', 'GlossaryReference'];
function TypeaheadState(glossarySettings, GlossaryReference) {

    this.sessions = {};
    this.settings = glossarySettings.typeahead;
    this.glossary = GlossaryReference;

    /**
     * Create a new session or return session with matching sessionId
     * @param sessionId
     * @param triggerFn
     * @param onCancelFn
     * @returns {*}
     */
    this.register = function register(sessionId, triggerFn, onCancelFn) {
        if (angular.isUndefined(this.sessions[sessionId])) {
            this.sessions[sessionId] = new TypeAheadSession(triggerFn, onCancelFn,
                this.settings, this.glossary);
        }
        return this.sessions[sessionId];
    }

}

function TypeAheadSession(triggerFn, onCancelFn, s, g) {
    this.buffer = [];
    this.activeBuffer = '';
    this.settings = s;
    this.callback = triggerFn;
    this.onCancelCallback = onCancelFn;
    this.glossaryTriggerIndex = null;
    this.listening = true;
    this.minTriggerLength = this.settings.minTriggerLength;
    this.isTriggered = false;
    this.lastKeypress = null;

    g.$promise.then(function (entries) {
        this.glossaryTriggerIndex = entries.map(function (entry) {
            // keypress buffer will be checked against collection of glossary terms,
            // sliced to same length as buffer
            return entry.Name.slice(0, this.settings.minTriggerLength);
        }.bind(this));
    }.bind(this));
}

TypeAheadSession.prototype.onKeyPress = function taOnKeyPress(e, editor) {
    this.lastKeypress = Date.now();

    if (this.isTriggered) {
        if (this.shouldBuffer(e)) {
            this.activeBuffer = this.activeBuffer + e.key;
        }

        if (e.keyCode === 8) { // backspace
            this.activeBuffer = this.activeBuffer.slice(0, this.activeBuffer.length - 1);
        }

        // if user spacebars while active, cancel
        if (e.keyCode === 32) {
            this.cancelled(this.activeBuffer, editor);
            return;
        }
    }

    if (this.listening && this.shouldBuffer(e)) {
        this.buffer.push(new KeyPress(e));
    } else return;


    if (this.buffer.length === this.minTriggerLength) {
        this.activeBuffer = this.keyHistoryString(); // buffer state when triggered
        if (this.shouldTrigger(this.activeBuffer)) {
            setTimeout(function () {
                this.triggered(this.activeBuffer, editor);
            }.bind(this))
        }
        this.clearBuffer();
    }

};

TypeAheadSession.prototype.onEnd = function taOnEnd() {
    this.reset();
};

TypeAheadSession.prototype.triggered = function taTriggered(buffer, editor) {
    this.isTriggered = true;
    this.callback(buffer, editor, this)
};

TypeAheadSession.prototype.cancelled = function taCancelled(buffer, editor) {
    this.onCancelCallback(buffer, editor, this);
    this.isTriggered = false;
    this.lastKeypress = null;
};

TypeAheadSession.prototype.reset = function taReset() {
    this.isTriggered = false;
    this.lastKeypress = null;
    this.activeBuffer = '';
    this.clearBuffer();
    this.listen();
};

TypeAheadSession.prototype.shouldBuffer = function shouldBuffer(e) {
    // buffer only alpha characters,  reject control and meta keys
    return !e.ctrlKey && !e.altKey && !e.metaKey &&
        e.key.length === 1 &&
        /[a-z]/i.test(e.key);
};

TypeAheadSession.prototype.hasTimedOut = function hasTimedOut() {
    return this.lastKeypress ? Date.now() - this.lastKeypress >= this.settings.timeoutInterval : false;
};

TypeAheadSession.prototype.clearBuffer = function clearBuffer() {
    return this.buffer = [];
};

TypeAheadSession.prototype.keyHistoryString = function keyHistoryString() {
    // return current keypress buffer as single string
    return this.buffer.reduce(function (a, b) {
        return (a.key || a) + b.key;
    })
};

TypeAheadSession.prototype.bufferGlossaryCheck = function (bufferStr) {
    if (this.glossaryTriggerIndex) {
        // test if string matching buffer present in glossary index
        return this.glossaryTriggerIndex.indexOf(bufferStr) > -1;
    } else {
        return false;
    }
};

TypeAheadSession.prototype.enable = function enableListening() {
    this.listening = true;
};

TypeAheadSession.prototype.disable = function disableListening() {
    this.listening = false;
};

TypeAheadSession.prototype.shouldTrigger = function shouldTrigger(buffer) {
    return buffer.length === this.minTriggerLength && this.bufferGlossaryCheck(buffer);
};

TypeAheadSession.prototype.currentBufferInterval = function () {
    return this.newestTime() - this.oldestTime();
};

TypeAheadSession.prototype.oldestTime = function () {
    return this.buffer[0].timeStamp;
};

TypeAheadSession.prototype.newestTime = function () {
    return this.buffer[this.buffer.length - 1].timeStamp;
};

TypeAheadSession.prototype.listen = function taListen() {
    this.listening = true;
};

TypeAheadSession.prototype.stopListening = function taListen() {
    this.listening = false;
};


function KeyPress(e) {
    this.event = e;
    this.key = e.key;
    this.timeStamp = e.timeStamp; // timestamp in ms
}

glossaryTypahead.$inject = ['TypeaheadState'];
function glossaryTypahead(TypeaheadState) {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var typeahead = TypeaheadState.register(attrs.id, function (buffer, editor, taSession) {
                    var re = new RegExp('(^|[>\\s]|&nbsp;)' + buffer + '(?=<span class="fr-marker")', 'i');
                    editor.markers.insert(); // insert cursor position testing marker
                    if (re.test(editor.$el.html())) {
                        typeahead.stopListening();

                        // delete buffer so we can place chars into At.js tag
                        for (var i = 0; i < buffer.length; i++) {
                            editor.cursor.backspace();
                        }

                        // trigger at.js and replay buffer
                        editor.commands.exec('addTerm');
                        _.each(buffer, function (k) {
                            editor.html.insert(k);
                            var keyUp = $.Event('keyup');
                            keyUp.which = k.charCodeAt(0);
                            keyUp.key = k;
                            keyUp.keyCode = k.charCodeAt(0);
                            editor.$el.trigger(keyUp);
                        });

                        editor.$el.on('hidden.atwho', function () {
                            editor.markers.remove();
                            taSession.onEnd();
                        });
                        editor.$el.on('inserted.atwho', function () {
                            editor.markers.remove();
                            taSession.onEnd();
                        });

                        // if no further keypress after trigger, hide ui and reset input
                        setTimeout(function () {
                            if (taSession.hasTimedOut()) {
                                taSession.cancelled(buffer, editor)
                            }
                        }, taSession.settings.timeoutInterval);
                    } else {
                        taSession.onEnd();
                        editor.markers.remove(); // remove cursor position testing marker
                        editor.$el.focus(); // return focus to editor so browser spellchecking becomes active again
                    }
                }, function onCancelled(buffer, editor, taSession) {
                    editor.$el.atwho('hide');

                    // remove tag and replace with original buffer
                    for (var i = 0; i < buffer.length + 1; i++) {
                        editor.cursor.backspace();
                    }
                    editor.html.insert(buffer);
                    taSession.onEnd();
                    editor.$el.focus();
                }
            );

            $(element).on('froalaEditor.keydown', function (e, editor, keypressEvent) {
                if (/Enter|Escape|Tab/.test(keypressEvent.key)) {
                    typeahead.onEnd();
                } else if (keypressEvent.key === '.') {
                    correctPeriodSpace(editor, keypressEvent);
                } else {
                    typeahead.onKeyPress(keypressEvent, editor);
                }
            });

            function correctPeriodSpace(editor, keypress) {
                // remove space after tag before period
                var re = />(\s|&nbsp;)(?=<span class="fr-marker")/i;

                editor.markers.insert(); // insert cursor position testing marker
                if (re.test(editor.$el.html())) {
                    keypress.preventDefault();
                    editor.cursor.backspace();
                    editor.html.insert('.')
                }
                editor.markers.remove();
            }
        }
    }

}
