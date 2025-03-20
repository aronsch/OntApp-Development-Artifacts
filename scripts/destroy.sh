#!/bin/bash

#imports
if [ -e scripts/utils/colors.sh ]; then
    . scripts/utils/colors.sh
    . scripts/utils/terminal.sh
elif [ -e utils/colors.sh ]; then
    . utils/colors.sh
    . utils/terminal.sh
fi

yes_str=${red}${bold}Yes${nocol}

# Destroy ALL docker containers and images

# stop running containers
if [ -e ../stop.sh ]; then
    sh ../stop.sh
elif [ -e ./stop.sh ]; then
    sh ./stop.sh
fi

function rm_all() {
    containers=$(docker ps -a -q)
    images=$(docker images -q)

    if [ ${#containers} -gt 0 ]; then
        echo -e "${red}Removing Containers${nocol}"
        docker rm $(docker ps -a -q)
    else
        echo -e "${yellow}No containers to remove${nocol}"
    fi

    if [ ${#images} -gt 0 ]; then
        echo -e "${red}Removing Images${nocol}"
        docker rmi -f $(docker images -q)
    else
        echo -e "${yellow}No images to remove${nocol}"
    fi
}

echo -e "\v${yellowbg}    Destroy All Docker Containers and Images    ${nocol} \
        \n\v${bold}This will delete all currently existing containers and images${nocol}.\
        \nAll builds will need to download their dependencies again. \
        \n\v${bold}${underline}Are you sure?${nounderline}${nocol}"
select yn in "${yes_str}" "No"; do
    case $yn in
        ${yes_str} ) erase_lines 3; rm_all; exit;;
        No ) exit;;
    esac
done


