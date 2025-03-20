#!/bin/bash

# Development - create Tomcat admin user
if [ ! -f /.tomcat_admin_created ]; then
    /create_tomcat_admin_user.sh
fi

# If present, move webapp into tomcat webapp directory
if [ -f OntApp.war ]; then
    mv OntApp.war $CATALINA_HOME/webapps
fi

# DEVELOPMENT - start .war file sync tool in background and set log files
nohup /syncd.sh > ./logs/sync.log 2> ./logs/sync.log &

# Start Tomcat
exec ${CATALINA_HOME}/bin/catalina.sh jpda run
