FROM node:6

#fix bson error - ajs
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y gcc make build-essential g++ rsync

WORKDIR /home/mean
# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower
RUN npm install -g node-inspector


# Install Mean.JS packages
ADD ./mean/package.json /home/mean/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD ./mean/.bowerrc /home/mean/.bowerrc
ADD ./mean/bower.json /home/mean/bower.json
RUN bower install --config.interactive=false --force-latest --allow-root

# currently only works for development
ENV NODE_ENV development
ENV DEBUG http

# Port 3000 for server
# Port 35729 for livereload
# Port 1337 for node-inspector
EXPOSE 3000 35729 5858 8081
WORKDIR /
ADD ./setup.sh setup.sh

# DEV ONLY - rsync
RUN chmod a+rw /home/mean/
ADD ./rsync/rsyncd rsyncd
EXPOSE 873

#VOLUME /home/mean/

# Make everything available for start
ADD ./mean /home/mean/

CMD ["sh", "setup.sh"]