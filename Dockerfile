FROM docker.adeo.no:5000/alpine-node:base-6.9
MAINTAINER Even Haasted <even.haasted@nav.no>

WORKDIR /src
ADD ./dist .

EXPOSE 8443

CMD ["npm", "run", "start"]