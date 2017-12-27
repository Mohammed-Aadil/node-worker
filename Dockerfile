FROM node:6.10
MAINTAINER Mohammed Aadil aadil@shoppinpal.com
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update --fix-missing && apt-get -y dist-upgrade && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*
RUN mkdir -p /apps/lib/workers
WORKDIR /apps/lib/workers
COPY package.json /apps/lib/workers
RUN npm install 
RUN npm install -g nodemon typescript@2.6.2
RUN ls
RUN mv node_modules /apps/lib/
COPY . /apps/lib/workers
RUN tsc
EXPOSE 8888
CMD [ "npm", "start"]
