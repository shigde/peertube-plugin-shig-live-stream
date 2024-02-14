# Docker dev environment

## Before run first time

Please add in your `/etc/hosts`

```
127.0.0.1 peertube.localhost
127.0.0.1 shigde.localhost
```

## Run

```
docker-compose up -d
```

You can open in a webbrowser:

**PeerTube**: http://peertube.localhost:9001/

**Shig**: http://shigde.localhost:8090/federation/accounts/shig

### Peertube Root login

```
user: root
pass: test123
```

## Install Plugin

```
./plugin-install.sh
```

## Register Shig

To register the 'shig' instance, you need to include the service in the plugin settings. 
You can locate these settings under: `Administration/Plugin/Design`

!["settings"](./docs/plugin-settings.jpg)

Afterward, you can input the URL `http://shigde.localhost:8090` and secret key `this-token-must-be-changed-in-public` for the 'shig' instance. 

!["register"](./docs/register-shig-in-peertube.jpg)

Shig will automatically follow this PeerTube instance.

!["follow"](./docs/shig-follow.jpg)
