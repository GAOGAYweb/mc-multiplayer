# mc-multiplayer
## introduction
A multi-player minecraft game in browser based on voxel-engine. Partially implemented.
## get started
start mc proxy
```
node proxy.js
```
start http server
```
browserify client.js -o bundle.js
beefy client.js 9967
```

## dependencies
### web
#### express
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
#### socket.io
Socket.IO enables real-time bidirectional event-based communication.
### minecraft
#### mineflayer
Mineflayer is a high level JavaScript API to create Minecraft bots.
#### minecraft-skin
load minecraft skins as meshes in three.js applications
#### voxel-*
An open source voxel game building toolkit for modern web browsers, including:
voxel-engine - A voxel engine in javascript using three.js,
voxel-player - Create a skinnable player with physics enabled.,
voxel-walk - ,
voxel-debris - create and collect voxel debris from exploded voxels
...
