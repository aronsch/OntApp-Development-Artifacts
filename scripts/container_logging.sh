#!/usr/bin/env bash

start_logging () {
    # start logging STDOUT and STDERR to files as background processes
    docker logs -f $MEAN &>$MEAN_LOG &
    docker logs -f $ONT &>$ONTOLOGY_LOG &
    docker logs -f $PAR &>$PARLIAMENT_LOG &
    docker logs -f $MDB &>$MONGO_LOG &

    echo -e "${green} - ${MEAN} live log at ${greenbold}./${MEAN_LOG}${nocol}"
    echo -e "${green} - ${ONT} live log at ${greenbold}./${ONTOLOGY_LOG}${nocol}"
    echo -e "${green} - ${PAR} live log at ${greenbold}./${PARLIAMENT_LOG}${nocol}"
    echo -e "${green} - ${MDB} live log at ${greenbold}./${MONGO_LOG}${nocol}"
    echo -e "${green} MacOS Terminal ${greenbold}Command + Double Click ${green}on file names to open${nocol}"
    echo -e "${green} Follow in terminal ${greenbold}tail -f [filename]${nocol}"
}