# PeerTube Shig Lobby

This [PeerTube](https://joinpeertube.org/) plugin is meant to provide interactive streams for PeerTube.

!["Shig Lobbyy"](./docs/shig-lobby.jpg)

It consists of a Shig lobby that can connect to a Shig instance (https://github.com/shigde/sfu) , which in turn can
distribute livestreams within the Fediverse.

## Features

| Feature                   | Description                                                                               | Develop State | Release |
|---------------------------|-------------------------------------------------------------------------------------------|---------------|---------|
| **Multi Guest Streaming** |                                                                                           |               |         |
| Instance wide             | PeerTube users of the instance can be invited to the lobby and participate in the stream. | finish        |         |
| Fediverse wide            | Any PeerTube user can be invited to the lobby.                                            | testing       |         |
| Ask for invitation        | PeerTube users can request to participate.                                                | develop       |         |
| **Live Text Chat**        |                                                                                           |               |         |
| Logget in viewer          | A live text chat for logged-in users can be provided alongside the stream                 | planned       |         |
| All viewer                | A live text chat for all viewer can be provided alongside the stream                      | planned       |         |
| **Video/Audio Track**     |                                                                                           | develop       |         |
| playable                  | Upload tracks that will be playable in the lobby.                                         | develop       |         |
| stream tracks endless     | Tracks will be runnable in an endless loop.                                               | develop       |         |
| **Lobby**                 |                                                                                           |               |         |
| Worker                    | Render the stream in a worker process                                                     | planned       |         |
| Movable Tiles             | The position of the video tile should be adjustable                                       | planned       |         |
| Overlays                  | Add name overlay to the video tile.                                                       | planned       |         |
| Custom Overlays           | Users can create their own stream overlays.                                               | planned       |         |

**Develop States**: planed | develop | testing | finish

## Developing

### PeerTube Instance

To develop on the plugin, it is recommended to set up a local PeerTube instance.
Please follow the instructions: [docker/README.md](./docker/README.md).

The instructions also include information on local deployment.

### Shig-JS-SDK

The plugin itself uses the [Shig-JS-SDK](https://github.com/shigde/shig-js-sdk). The SDK is placed
in `./public/javascript/shig-lobby.js`

## Funded by

<p style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
<a href="https://www.bmbf.de/bmbf/en" rel="nofollow"><img src="docs/img/BMBF.jpg" alt="Logo of the German Ministry for Education and Research" style="max-width:100%; padding:20px;" height="150px"></a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a href="https://prototypefund.de/en/" rel="nofollow"><img src="docs/img/PF.svg" alt="Logo of the Prototype Fund" style="max-width:100%; padding:20px;" height="150px"></a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <a href="https://okfn.de/en/" rel="nofollow"><img src="docs/img/OKFD.svg" alt="Logo of the Open Knowledge Foundation Germany" style="max-width:100%; padding:20px;" height="150px"></a>
</p>
