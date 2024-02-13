# Docker dev environment

## Before run first time

Please add in in your `/etc/hosts`

```
127.0.0.1 peertube.localhost
127.0.0.1 shigde.docker.local
```

## Run

```
docker-compose up -d
```

### Root login

```
user: root
pass: test123
```

## Install Plugin

```
./plugin-install.sh
```

Maybe you need to install `peertube-cli` before
```
npm install -g @peertube/peertube-cli
```
