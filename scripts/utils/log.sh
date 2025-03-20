#!/usr/bin/env bash

# clear error logs, suppress missing file errs
function delete_existing() {
    if [[ -a $1 ]]; then
        rm $1
    fi
}

function delete_empty() {
    if [[ ! -s $1 ]]; then
        rm $1
    fi
}

function clear_logs() {
    delete_existing $BUILD_LOG
    delete_existing $BUILD_ERR_LOG
    delete_existing $ONT_LOAD_LOG
    delete_existing $ONT_LOG_ERR_CREATE
    delete_existing $ONT_LOG_ERR_LOAD
    delete_existing $MEAN_LOG
    delete_existing $ONTOLOGY_LOG
    delete_existing $PARLIAMENT_LOG
    delete_existing $MONGO_LOG
}

function handle_errs () {
    # print any errors (file size > 0)
    if [[ -s $1 ]]; then
        echo -e "${red}$(cat $ONT_LOG_ERR_LOAD)${nocol}"
    fi
    # else delete
    delete_empty $1
}

function process_all_err_logs() {
    handle_errs $BUILD_ERR_LOG
    handle_errs $ONT_LOG_ERR_CREATE
    handle_errs $ONT_LOG_ERR_LOAD
}

