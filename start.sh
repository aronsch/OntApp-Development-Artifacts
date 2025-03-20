#!/bin/bash
# import vars and functions
. settings.sh
. scripts/utils/spinner.sh
. scripts/utils/colors.sh
. scripts/utils/terminal.sh
. scripts/utils/misc.sh
. scripts/utils/log.sh
. scripts/build.sh
. scripts/containers.sh
. scripts/load_ontologies.sh
. scripts/test_services.sh
. scripts/container_logging.sh
. scripts/networks.sh

while [ "$1" != "" ]; do
    if [ "$1" = "clean" ]; then
        echo -e " ${greenbold} Cleaning ${green}- removing \"dangling\" Docker volumes not referenced by any containers${nocol}"
        docker volume ls -qf dangling=true | xargs docker volume rm
        echo -e " ${greenbold}${checkmark} ${green}Clean completed${nocol}"
        exit 0

    elif [ "$1" = "fresh" ]; then
        rm -r MongoDB/mongo_data/
        echo -e " ${greenbold}${checkmark} ${green}Fresh start triggered - existing MongoDB database removed${nocol}"

    elif [ "$1" = "soft-restart" ]; then
        echo -e " ${yellow}Soft restart: attempting graceful stop and restart of containers...${nocol}"
        restart_containers
        load_ontologies
        start_logging
        test_services
        exit 0

    elif [ "$1" = "verbose" ]; then
        LOGGING=1

    elif [ "$1" = "help" ]; then
        echo -e "${whitebg} Help: OntApp Development Environment Start ${nocol}"
        echo -e "\v${bold}${underline}optional arguments${nounderline}${nocol}"
        echo -e "${bold}clean${nocol}\t\tfree storage space on Docker VM or server by removing unreferenced volumes"
        echo -e "${bold}fresh${nocol}\t\trestart development environment without persisting Mongo data"
        echo -e "${bold}soft-restart${nocol}\tattempt to gracefully stop and restart all services in their current state"
        echo -e "${bold}verbose${nocol}\t\tShow log output during startup"
        echo -e "\v${bold}${underline}troubleshooting${nounderline}${nocol}"
        echo -e "${bold}Error:${nocol}\t${redbold}No space left on device${nocol}"
        echo -e "${bold}  Fix:${nocol}\trun ${bold}start.sh clean${nocol} to remove any unreferenced \"dangling\" Docker volumes"
        echo -e "\v"
        exit 0

    fi
    shift
done

hide_cursor
trap show_cursor EXIT

# stop running containers and remove existing containers
stop_containers # stop gracefully if possible
kill_and_rm_containers # kill anything not stopped
clear_logs # reset log state

### Create Docker networks
create_networks

# rebuild or do initial build
echo -e "\v${greenbg} Building Images ${nocol}"
if [ $LOGGING -eq 1 ]; then
    set_verbose $BUILD_LOG
    echo -e "${logcol}"
    build_all
    echo -e "${nocol}"
else
    echo -en "${green} >> Output logging to ${greenbold}./${BUILD_LOG}\t${yellowbold}"
    spinner_start
    build_all 1> $BUILD_LOG 2> $BUILD_ERR_LOG
    spinner_clear
    handle_errs $BUILD_ERR_LOG
fi
echo -e "${green} >> Output logged to ${greenbold}./${BUILD_LOG}${nocol}"

### Start Containers
start_containers

# Connect running containers to additional networks
#final_network_setup

#load ontologies
load_ontologies

# dev - rsync to MEAN container to get around Docker Volume
# FS problems
#forever --spinSleepTime 1000ms ./ClientMEANjs/rsync.js
#node ./ClientMEANjs/rsync.js

# display running containers
running_containers

# display exposed ports
echo -e "\v${yellowbg} ${alertemoji}  Ports Exposed ${alertemoji}  ${nocol}"
container_ports_exposed | perl -0pe "s/0.0.0.0/localhost/g" | perl -0pe "s/->.*?tcp(?=[,\s\n\r\t]?)//g"

###
### test services, then echo access urls
###
#test_services

# start container log output
echo -e "\v${greenbg} Live Logs ${nocol}"
start_logging



