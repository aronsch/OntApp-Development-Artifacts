#!/usr/bin/env bash

function start_httpsproxy_container () {
    # FIXME: Debug configuration
    eval "docker run -t -d --name ${PRX} -p 80:80 -p 443:443 \
	-v ${CERT_PATH}:/etc/ssl/private \
    -e SERVER_NAME=www.reqs.com \
    -e SERVER_ADMIN=webmaster@reqs.com \
	aheimsbakk/https-proxy:4"
}

function start_parliament_container () {
    eval "docker run -t -d \
        -p ${PARLIAMENT_PORT}:8080 \
        -v ${PARLIAMENT_DATA}:/data \
	    -v ${PARLIAMENT_LOGS}:/parliament/log \
        -v ${PARLIAMENT_ONTOLOGIES}:/ontologies \
        --network=${CLIENT_NET} \
        --name=${PAR} \
        ontapp/parliamentserver"
}

function start_ontapp_container () {
    # OntAppTomcat Tomcat container
    # - linked to Parliament
    eval "docker run -d -t \
        -e JPDA_TRANSPORT=dt_socket \
        -e JPDA_ADDRESS=8000 \
        -p ${ONTSERVER_PORT}:8080 \
        -p ${ONTSERVER_DEBUG_PORT}:8000 \
        -v ${WAR_SRC}:/warfile/ \
        --link=${ONT}:${ONT} \
        --network=${CLIENT_NET} \
        --name=${ONT} \
        ontapp/ontserver"
	# log tomcat admin password
	docker logs ${ONT} > tomcat_pw.log
}

function start_mongodb_container () {
    # MongoDB Container
    eval "docker run -d -t \
        -v ${MONGO_DATA}:/data/db \
        --network=${CLIENT_NET} \
        --name=${MDB} mongo mongod --smallfiles"
}

function start_meanjs_container () {
    # MEAN.js Dev Container
    # - linked to MongoDB
    # - linked to OntServer
    eval "docker run -d -t \
        -p ${MEAN_PORT}:3000 \
        -p 873:873 \
        -p 35729:35729 \
        -p 5858:5858 \
        -p ${NODE_DEBUG_PORT}:1337 \
        --network=${CLIENT_NET} \
        --name=${MEAN} \
        ontapp/meanserver"
}

function container_running () {
    docker inspect -f {{.State.Running}} $1 2>/dev/null
}


function start_containers () {
    echo -e "\v${greenbg} Starting Containers ${nocol}"
    start_httpsproxy_container >> $BUILD_LOG
    start_parliament_container >> $BUILD_LOG
    start_ontapp_container >> $BUILD_LOG
    start_mongodb_container >> $BUILD_LOG
    start_meanjs_container >> $BUILD_LOG

    if [[ $(container_running $PRX) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${PRX} Container Started${nocol}"
    fi

    if [[ $(container_running $PAR) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${PAR} Container Started${nocol}"
    fi

    if [[ $(container_running $ONT) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${ONT} Container Started${nocol}"
    fi

    if [[ $(container_running $MDB) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${MDB} Container Started${nocol}"
    fi

    if [[ $(container_running $MEAN) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${MEAN} Container Started${nocol}"
    fi
}

function kill_containers () {
    if [[ $(container_running $PRX) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${PAR} stopping${nocol}"
	    docker kill --signal="SIGTERM" $PRX &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${PAR} stopped${nocol}  "
    fi

    if [[ $(container_running $PAR) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${PAR} stopping${nocol}"
	    docker kill --signal="SIGTERM" $PAR &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${PAR} stopped${nocol}  "
    fi

    if [[ $(container_running $ONT) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${ONT} stopping${nocol}"
        docker kill $ONT &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${ONT} stopped${nocol}  "
    fi

    if [[ $(container_running $MDB) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${MDB} stopping${nocol}"
        docker kill $MDB &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${MDB} stopped${nocol}  "
    fi

    if [[ $(container_running $MEAN) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${MEAN} stopping${nocol}"
        docker kill $MEAN &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${MEAN} stopped${nocol}  "
    fi
}

function stop_containers () {
    if [[ $(container_running $PRX) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${PRX} stopping${nocol}"
        docker stop -t 20 $PRX &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${PRX} stopped${nocol}  "
    fi

    if [[ $(container_running $PAR) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${PAR} stopping${nocol}"
        docker stop -t 20 $PAR &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${PAR} stopped${nocol}  "
    fi

    if [[ $(container_running $ONT) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${ONT} stopping${nocol}"
        docker stop $ONT &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${ONT} stopped${nocol}  "
    fi

    if [[ $(container_running $MDB) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${MDB} stopping${nocol}"
        docker stop $MDB &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${MDB} stopped${nocol}  "
    fi

    if [[ $(container_running $MEAN) == "true" ]]; then
        echo -en " ${redbold}${stopsign} ${green}${MEAN} stopping${nocol}"
        docker stop $MEAN &> /dev/null
        echo -e "\r ${greenbold}${checkmark} ${green}${MEAN} stopped${nocol}  "
    fi
}

function restart_containers () {
    stop_containers
    docker start ${PRX} >/dev/null
    docker start ${PAR} >/dev/null
    docker start ${ONT} >/dev/null
    docker start ${MDB} >/dev/null
    docker start ${MEAN} >/dev/null

    if [[ $(container_running $PRX) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${PRX} Container Restarted${nocol}"
    fi

    if [[ $(container_running $PAR) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${PAR} Container Restarted${nocol}"
    fi

    if [[ $(container_running $ONT) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${ONT} Container Restarted${nocol}"
    fi

    if [[ $(container_running $MDB) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${MDB} Container Restarted${nocol}"
    fi

    if [[ $(container_running $MEAN) == "true" ]]; then
        echo -e " ${greenbold}${checkmark} ${green}${MEAN} Container Restarted${nocol}"
    fi
}

function remove_containers () {
    # delete most recent container builds
    {
        docker rm $PRX
        docker rm $PAR
        docker rm $ONT
        docker rm $MDB
        docker rm $MEAN
    } &> /dev/null
}

function kill_and_rm_containers () {
    kill_containers
    remove_containers
}

function running_containers () {
    echo -e "\v${greenbg} Containers Running ${nocol}"
    #simplified docker ps output
    docker ps --format "table {{.Names}}\t{{.CreatedAt}} \t{{.Status}}"
}

function container_ports_exposed () {
    docker ps --format "table {{.Names}}\t{{.Ports}}"
}
