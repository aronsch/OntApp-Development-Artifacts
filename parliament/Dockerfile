FROM java:8
MAINTAINER <aronsch@gmail.com>

ENV JETTY_HOME /parliament

RUN apt-get update && \
apt-get install -y wget unzip

RUN mkdir parliament

EXPOSE 8080

VOLUME /data
VOLUME /logs

# ORIG ADD start.sh start.sh
ADD run_parliament.sh run_parliament.sh
# Add Parliament Quickstart 2.7.8 gcc 64 files and libraries
ADD /ParliamentQuickStart-v2 /parliament
ADD fbi278tics.war /parliament/webapps/parliament.war
ADD jetty278.xml /parliament/conf/jetty.xml
ADD webdefault.xml /parliament/conf/webdefault.xml
ADD StartParliament.sh /parliament/StartParliament.sh
ADD ParliamentConfig.txt /parliament/ParliamentConfig.txt

RUN chmod 777 parliament/bin/jsvc
RUN chmod +x parliament/StartParliament.sh
RUN chmod +x run_parliament.sh

# CMD ["sh", "start.sh"]
ENTRYPOINT ["./run_parliament.sh"]
