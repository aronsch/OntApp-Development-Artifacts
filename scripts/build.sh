#!/bin/bash
# build images provided in arguments

function build() {
    while [ "$1" != "" ]; do
        if [ "$1" = "OntServer" ]; then
            echo "Building $1"
            docker build --tag="ontapp/ontserver" ontserver
        fi
        if [ "$1" = "ParliamentServer" ]; then
            echo "Building $1"
            docker build --tag="ontapp/parliamentserver" parliament
        fi
        if [ "$1" = "MongoDBServer" ]; then
            echo "Building $1"
            docker build --tag="ontapp/mongoserver" mongodb
        fi
        if [ "$1" = "OntMean" ]; then
            echo "Building $1"
            docker build --tag="ontapp/meanserver" webserver
        fi
        if [ "$1" = "all" ]; then
            echo "Building All Containers"
            docker build --tag="ontapp/ontserver" ontserver
            docker build --tag="ontapp/parliamentserver" parliament
            docker build --tag="ontapp/mongoserver" mongodb
            docker build --tag="ontapp/meanserver" webserver
        fi
        # Shift all the arguments down by one
        shift
    done
}

function build_all() {
    build all
}
