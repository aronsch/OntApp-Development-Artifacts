#!/usr/bin/env bash
set -x

pid=0

# SIGUSR1-handler
my_handler() {
  echo "my_handler"
}

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 143; # 128 + 15 -- SIGTERM
}

# setup handlers
# on callback, kill the last background process, which is `tail -f /dev/null` and execute the specified handler
trap 'kill ${!}; my_handler' SIGUSR1
trap 'kill ${!}; term_handler' SIGTERM

# run application
cd parliament

# The following, down to '$EXEC',  was copied from ParliamentStart.sh
MIN_MEM=128m
MAX_MEM=512m
JETTY_HOST=localhost
JETTY_PORT=8080

DEBUG_ARG=-agentlib:jdwp=transport=dt_socket,address=8000,server=y,suspend=n

# This script assumes that it resides in the Parliament KB directory,
# and that this directory is the CWD.
if [ ! -d "./lib" ]; then
        echo The current directory does not contain the lib directory.
        exit 1
fi
if [ ! -f "./webapps/parliament.war" ]; then
        echo The current directory does not contain webapps/parliament.war.
        exit 1
fi

echo Using the following version of Java:
java -version

CP=$CLASSPATH
for i in lib/*.jar
do
CP=$CP:$i
done

# The Java property "java.library.path" below is supposed to take care of these,
# but sometimes it doesn't work, so set up the shared lib path as well:
export DYLD_LIBRARY_PATH=./bin:$DYLD_LIBRARY_PATH
export LD_LIBRARY_PATH=./bin:$LD_LIBRARY_PATH

#export PARLIAMENT_CONFIG_PATH=./ParliamentConfig.txt

EXEC="java -server -Xms$MIN_MEM -Xmx$MAX_MEM -cp $CP -Djava.library.path=./bin"
EXEC="$EXEC -Dcom.sun.management.jmxremote -Dlog4j.configuration=conf/log4j.properties"
EXEC="$EXEC -Duname=adminion -Dp_word=FBI28tics -Dp_code=8196"
EXEC="$EXEC -Djetty.host=$JETTY_HOST -Djetty.port=$JETTY_PORT"
# Uncomment this line to enable remote debugging:
#EXEC="$EXEC $DEBUG_ARG"
EXEC="$EXEC com.bbn.parliament.jena.jetty.CmdLineJettyServer $@"

# Debugging statements:
# echo EXEC = $EXEC
# echo DYLD_LIBRARY_PATH = $DYLD_LIBRARY_PATH
# echo LD_LIBRARY_PATH = $LD_LIBRARY_PATH

$EXEC &
# The above was copied from ParliamentStart.sh, except for the '&' putting into a background process

pid="$!"

# wait forever
while true
do
  tail -f /dev/null & wait ${!}
done
