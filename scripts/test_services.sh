#!/usr/bin/env bash

test_services () {
    PARLIAMENT_STATUS=""
    ONTSERVER_STATUS=""
    MEAN_STATUS=""
    NODE_DEBUG_STATUS=""
    L=0

    echo -e "\v${greenbg} Access URLs ${nocol}"
    until [[ -n "$PARLIAMENT_STATUS" && -n "$ONTSERVER_STATUS" && -n "$MEAN_STATUS" ]]; do
        sleep 1;

        erase_lines L
        L=0

        PARLIAMENT_STATUS=$(curl -Is --connect-timeout 3  http://localhost:$PARLIAMENT_PORT/parliament/ | head -n 1)
        if [[ -z "$PARLIAMENT_STATUS" ]]; then
           echo -e "${yellow}... Waiting for ${PAR} Connection${nocol} $(date)"
           ((L=L+1))
        fi

        ONTSERVER_STATUS=$(curl -Is --connect-timeout 3  http://localhost:$ONTSERVER_PORT | head -n 1)
        if [[ -z "$ONTSERVER_STATUS" ]]; then
           echo -e "${yellow}... Waiting for ${ONT} Connection${nocol} $(date)"
           ((L=L+1))
        fi

        MEAN_STATUS=$(curl -Is --connect-timeout 3  http://localhost:$MEAN_PORT | head -n 1)
        if [[ -z "$MEAN_STATUS" ]]; then
           echo -e "${yellow}... Waiting for ${MEAN} Connection${nocol} $(date)"
           ((L=L+1))
        fi

# TODO: fix node console web access
#        NODE_DEBUG_STATUS=$(curl -Is --connect-timeout 3  http://localhost:$NODE_DEBUG_PORT | head -n 1)
#        if [[ -z "$NODE_DEBUG_STATUS" ]]; then
#           echo -e "${yellow}... Waiting for Node Debugger Connection${nocol} $(date)"
#           ((L=L+1))
#        fi
    done

    # finally:
    echo -e " ${greenbold}${checkmark}${green} Site available at ${greenbold}http://localhost${nocol}"
    #echo -e " ${greenbold}${checkmark}${green} Node console available at ${greenbold}http://localhost:${NODE_DEBUG_PORT}${nocol}"
    echo -e " ${greenbold}${checkmark}${green} ${ONT} console available at ${greenbold}http://localhost:${ONTSERVER_PORT} ${green}(password in ${greenbold}./tomcat_pw.log${green})${nocol}"
    echo -e " ${greenbold}${checkmark}${green} ${ONT} remote debug port at ${greenbold}http://localhost:${ONTSERVER_DEBUG_PORT}${nocol}"
    echo -e " ${greenbold}${checkmark}${green} ${PAR} console available at ${greenbold}http://localhost:${PARLIAMENT_PORT}/parliament${nocol}"
    echo -e "${green} MacOS Terminal ${greenbold}Command + Double Click ${green}on URLs to open${nocol}"
}
