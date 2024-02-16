# Docker dev environment

This is a description of a development environment where you can develop and test the plugin.

#### Note: shig docker image
!! Please note that there is currently no image available for the Shig instance on Docker Hub. 
Therefore, you will need to build the image yourself. 
Please checkout the shig instance: `fodem-changes` branche https://github.com/shigde/sfu/tree/fodem-changes 

After this follow the instructions here to build an `shigde/instance` image: https://github.com/shigde/sfu/blob/fodem-changes/README.md#build-docker-container-for-shig-instance-1
I will soon provide a functioning image on Docker Hub. Thank you!

## Run

Run the commands in this directory.

```
docker-compose up -d
```

You can open in a webbrowser:

**PeerTube**: http://peertube.localhost:9001/

**Shig**: http://shigde.localhost:8090/federation/accounts/shig

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

To register the 'shig' instance, you need to include the service in the plugin settings. 
You can locate these settings under: `Administration/Plugin/Design`

!["settings"](./docs/plugin-settings.jpg)

Afterward, you can input the URL `http://shigde.localhost:8090` and secret key `this-token-must-be-changed-in-public` for the 'shig' instance. 

!["register"](./docs/register-shig-in-peertube.jpg)

Shig will automatically follow this PeerTube instance.

!["follow"](./docs/shig-follow.jpg)


# PeerTube Remote Instance
Sometimes you need a second instance, for example when working on ActivityPub remote videos. 
That's why I placed a second Docker configuration in the `remote` folder.
