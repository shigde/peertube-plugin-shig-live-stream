#!/usr/bin/env bash

cd ../../ \
  && npm version --no-git-tag-version patch \
  && cp -R assets/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/assets \
  && cp -R dist/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/dist \
  && cp -R client/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/client \
  && cp -R languages/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/languages \
  && cp -R public/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/public \
  && cp -R scripts/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/scripts \
  && cp -R server/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/server \
  && cp -R shared/ docker/remote/docker-volume/peertube-plugin-shig-live-stream/shared \
  && cp package.json docker/remote/docker-volume/peertube-plugin-shig-live-stream/  \
  && cp package-lock.json docker/remote/docker-volume/peertube-plugin-shig-live-stream/  \
  && cp docker/peertube/build.sh docker/remote/docker-volume/peertube-plugin-shig-live-stream/

docker exec -it peertube-remote /usr/local/peertube-plugin-shig-live-stream/build.sh
docker exec -it peertube-remote peertube-cli plugins install --url 'http://localhost:9000'  --username 'root' --password 'test' --path /usr/local/peertube-plugin-shig-live-stream

