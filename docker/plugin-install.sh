#!/usr/bin/env bash
#cd ../ && BASEDIR=${PWD} && npm version --no-git-tag-version patch && npm run build
#peertube-cli plugins install --path ${BASEDIR} -u 'http://localhost:9000/' -U 'root' --password 'test'


cd ../ \
  && npm version --no-git-tag-version patch \
  && cp -R assets/ docker/docker-volume/peertube-plugin-shig-live-stream/assets \
  && cp -R dist/ docker/docker-volume/peertube-plugin-shig-live-stream/dist \
  && cp -R client/ docker/docker-volume/peertube-plugin-shig-live-stream/client \
  && cp -R languages/ docker/docker-volume/peertube-plugin-shig-live-stream/languages \
  && cp -R public/ docker/docker-volume/peertube-plugin-shig-live-stream/public \
  && cp -R scripts/ docker/docker-volume/peertube-plugin-shig-live-stream/scripts \
  && cp -R server/ docker/docker-volume/peertube-plugin-shig-live-stream/server \
  && cp -R shared/ docker/docker-volume/peertube-plugin-shig-live-stream/shared \
  && cp package.json docker/docker-volume/peertube-plugin-shig-live-stream/  \
  && cp package-lock.json docker/docker-volume/peertube-plugin-shig-live-stream/  \
  && cp docker/peertube/build.sh docker/docker-volume/peertube-plugin-shig-live-stream/

#docker exec -it peertube peertube-cli auth add -u 'http://localhost:9000/' -U 'root' --password 'test123'
docker exec -it peertube /usr/local/peertube-plugin-shig-live-stream/build.sh
docker exec -it peertube peertube-cli plugins install --url 'http://peertube.localhost:9001'  --username 'root' --password 'test123' --path /usr/local/peertube-plugin-shig-live-stream

