#!/usr/bin/env bash

# set vars
export DIR=$(pwd)
export LOGGING=0

# Docker bridge network names
export CLIENT_NET="client"
export ONTAPP_NET="ontapp"
export PARLIAMENT_NET="parliament"

# container names
export PRX="httpsproxy"
export PAR="parliament"
export ONT="ontserver"
export MDB="mongodb"
export MEAN="webserver"

# port settings
export MEAN_PORT=80
export ONTSERVER_PORT=8080
export ONTSERVER_DEBUG_PORT=8081
export NODE_DEBUG_PORT=8082
export PARLIAMENT_PORT=8087
export MONGO_PORT=27017

# source paths
export CERT_PATH=$(pwd)/httpsproxy/certs
export PARLIAMENT_DATA=$(pwd)/parliament/data
export PARLIAMENT_LOGS=$(pwd)/parliament/logs/
export PARLIAMENT_ONTOLOGIES=$(pwd)/parliament/ontologies
export WAR_SRC=$(pwd)/ontserver/warfile/
export MONGO_DATA=$(pwd)/mongodb/mongo_data/
export MEAN_DATA=$(pwd)/webserver/

# Startup log paths
export BUILD_LOG=build.log
export BUILD_ERR_LOG=build_err.log
export ONT_LOAD_LOG=ontologies_load.log
export ONT_LOG_ERR_CREATE=ontologies_graph_create_err.log
export ONT_LOG_ERR_LOAD=ontologies_load_err.log

# Container log paths
export MEAN_LOG=$MEAN.log
export ONTOLOGY_LOG=$ONT.log
export PARLIAMENT_LOG=$PAR.log
export MONGO_LOG=$MDB.log

function set_verbose() {
    exec > >(tee -a ${1} )
    exec 2> >(tee -a ${1} >&2)
}
