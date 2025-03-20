#!/bin/bash
# Script for loading Ontologies into Parliament

# Test for non-null status every 100ms until sucessful, then continue loader script
load_ontologies() {
    echo -e "\v${greenbg} ${PAR} Setup ${nocol}"


    # rm any err logs


    PARLIAMENT_ADDR=$(docker network inspect --format="{{range \$id, \$container := .Containers}} {{if eq \$container.Name \"$PAR\"}} {{\$container.IPv4Address}}{{end}}{{end}}"  bridge | sed 's/\(.*\)\/.*/\1/')
    echo $PARLIAMENT_ADDR
    GRAPH_URL="http://www.engineeringsemantics.com"
    PARLIAMENT_STATUS=""
    TIMEOUT=73
    L=0
    A=0

    until [[ -n "$PARLIAMENT_STATUS" ]]; do
        # test localhost
        PARLIAMENT_STATUS=$(curl -Is --connect-timeout 3  http://localhost:$PARLIAMENT_PORT/parliament/ | head -n 1)
        if [[ -z "$PARLIAMENT_STATUS" ]]; then
           if [[ $L -ge 1 ]]; then erase_lines 1; fi
           echo -e "${yellow}... Waiting for ${PAR} Connection (${A})${nocol}"
           L=1
           ((A=A+1))

           if [[ $A -gt TIMEOUT ]]; then
                erase_lines 1
                echo -e "${redbold}Could not connect to ${PAR} after ${TIMEOUT} attempts${nocol}"
                return
           fi

           sleep 1;
        fi

    done

    # clear any waiting status lines
    if [[ $L -ge 1 ]]; then erase_lines 1; fi

    # set Parliament address for localhost, if successful
    if [[ -n "$PARLIAMENT_STATUS" ]]; then
        ONTSERVER_URL="http://localhost:$ONTSERVER_PORT"
    fi

    cd ontserver

    #### run loader: Create Graph
    echo -e "${greenbold} Creating Graph ${nocol}"
    echo [ $(date) ] 1> ../$ONT_LOAD_LOG

    # TODO: find a way to feed these arguments in as an array;
    if [ $LOGGING -eq 1 ]; then
        set_verbose ../$ONT_LOAD_LOG
        echo -e "${logcol}"
        java -jar CallBulkDataServlet.jar "ServerURL=${ONTSERVER_URL}" "Action=CreateGraph" "EntityType=Graph" "GraphBaseURL=http://www.engineeringsemantics.com"
        echo -e "${nocol}"

    else
        echo -en "${green} >> Output logging to ${greenbold}./${ONT_LOAD_LOG}${nocol}\t"
        spinner_start
        java -jar CallBulkDataServlet.jar "ServerURL=${ONTSERVER_URL}" "Action=CreateGraph" "EntityType=Graph" "GraphBaseURL=http://www.engineeringsemantics.com" 1>> ../$ONT_LOAD_LOG 2> ../$ONT_LOG_ERR_CREATE
        spinner_clear
    fi
    echo -e "${green} >> Output logged to ${greenbold}./${ONT_LOAD_LOG}${nocol}"
    # print any errors if in non-verbose mode
    if [ $LOGGING -eq 0 ]; then handle_errs "../$ONT_LOG_ERR_CREATE"; fi


    #### run loader: Load Ontologies
    echo -e "${greenbold} Loading Dev Ontologies ${nocol}"
    echo [ $(date) ] 1>> ../$ONT_LOAD_LOG

    if [ $LOGGING -eq 1 ]; then
        echo -e "${logcol}"
        set_verbose $ONT_LOAD_LOG

        java -jar CallBulkDataServlet.jar "ServerURL=${ONTSERVER_URL}" "Action=Load" "GraphBaseURL=http://www.engineeringsemantics.com" "EntityType=Ont" "DataSourceType=FilesServerAccessible"  "DataSourceFormat=nt"  "Files=/WEB-INF/classes/ONTS/es_reqs_core.nt"
        echo -e "${nocol}"
    else
        echo -en "${green} >> Output logging to ${greenbold}./${ONT_LOAD_LOG}${nocol}\t"
        spinner_start
        java -jar CallBulkDataServlet.jar "ServerURL=${ONTSERVER_URL}" "Action=Load" "GraphBaseURL=http://www.engineeringsemantics.com" "EntityType=Ont" "DataSourceType=FilesServerAccessible"  "DataSourceFormat=nt"  "Files=/WEB-INF/classes/ONTS/es_reqs_core.nt" 1>> ../$ONT_LOAD_LOG 2> ../$ONT_LOG_ERR_LOAD
        spinner_clear
    fi
    echo -e "${green} >> Output logged to ${greenbold}./${ONT_LOAD_LOG}${nocol}"
    # print any errors if in non-verbose mode
    if [ $LOGGING -eq 0 ]; then handle_errs "../$ONT_LOG_ERR_LOAD"; fi

    cd ..
}
