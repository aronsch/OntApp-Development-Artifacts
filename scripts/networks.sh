#!/bin/bash

function create_networks () {
    docker network create --driver bridge $CLIENT_NET
}

function final_network_setup () {
    docker network connect bridge $MEAN
    docker network connect bridge $MDB
    docker network connect bridge $ONT
    docker network connect bridge $PAR
}

function disconnect_networks () {
    docker network disconnect $CLIENT_NET $MEAN
    docker network disconnect $CLIENT_NET $MDB
    docker network disconnect $CLIENT_NET $ONT
    docker network disconnect $CLIENT_NET $PAR
}

function remove_networks () {
    docker network rm $CLIENT_NET
}