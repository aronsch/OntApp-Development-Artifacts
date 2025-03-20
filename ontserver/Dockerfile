# Ontology Mediator Tomcat Application Server
FROM tifayuki/java:7
MAINTAINER Feng Honglin <hfeng@tutum.co>

RUN apt-get update && \
    apt-get install -yq --no-install-recommends wget pwgen ca-certificates inotify-tools curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TOMCAT_MAJOR_VERSION 8
ENV TOMCAT_MINOR_VERSION 8.0.11
ENV CATALINA_HOME /tomcat

# INSTALL TOMCAT
RUN wget -q --no-check-certificate https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz && \
    wget -qO- --no-check-certificate https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - && \
    tar zxf apache-tomcat-*.tar.gz && \
    rm apache-tomcat-*.tar.gz && \
    mv apache-tomcat* tomcat && \
    rm -r tomcat/webapps/ROOT && \
    rm -r tomcat/webapps/manager && \
    rm -r tomcat/webapps/host-manager && \
    rm -r tomcat/webapps/docs && \
    rm -r tomcat/webapps/examples

ADD create_tomcat_admin_user.sh /create_tomcat_admin_user.sh
ADD run.sh /run.sh


#DEBUG tomcat password
#USERNAME admin
ENV TOMCAT_PASS wad-vi-wrot-id-a

EXPOSE 8080
# EXPOSE 8000
VOLUME /logs /tmp/

ADD OntApp.war /OntApp.war
ADD tomcat8.0.11_server.xml /tomcat/conf/server.xml

RUN chmod +x /*.sh

CMD sh run.sh





