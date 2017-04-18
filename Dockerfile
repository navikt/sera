FROM docker.adeo.no:5000/alpine-node:base-6.9
MAINTAINER Even Haasted <even.haasted@nav.no>

WORKDIR /src
ADD ./dist .

EXPOSE 8443

ARG NODE_ENV=production

CMD ["node", "production_server.js"]