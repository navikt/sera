FROM docker.adeo.no:5000/alpine-node:base-6.9
MAINTAINER Even Haasted <even.haasted@nav.no>

WORKDIR /src
ADD ./dist .

EXPOSE 80

ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

CMD ["node", "production_server.js"]