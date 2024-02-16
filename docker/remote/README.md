# Docker dev environment Peertube Remote Instance

## Run

```
docker-compose up -d
```

You can open in a webbrowser:

**PeerTube**: http://remote-peertube.localhost:9002/

**Shig**: http://remote-shigde.localhost:8092/federation/accounts/shig

### PeerTube Root login

```
user: root
pass: test
```

## Install Plugin

```
./plugin-install.sh
```

## Register Shig

Add in the plugin settings teh
URL `http://remote-shigde.localhost:8092` and secret key `this-token-must-be-changed-in-public` for the 'shig' instance. 
