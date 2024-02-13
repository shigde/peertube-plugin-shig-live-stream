#!/usr/bin/env bash
cd ../ && BASEDIR=${PWD} && npm version --no-git-tag-version patch && npm run build
peertube-cli plugins install --path ${BASEDIR} -u 'http://localhost:9000/' -U 'root' --password 'test'


