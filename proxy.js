var mineflayer = require('mineflayer');
var bot = mineflayer.createBot({
	host: "localhost",
	port: 25565,
	username: "infoer",
	version: "1.8.9"
});
bot.on('chat', function(username, message) {
	if (username == bot.username) return;
	bot.chat(username + ' said: ' + message);
});

// socket io
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

var player_pos;
var global_username = 1;
io.on('connection', function(socket) {
	console.log("client connected");
	// create new bot to connect to mc server
	// socket.on('login', function(data) {
		console.log("client login");
		var player = mineflayer.createBot({
			host: "localhost",
			port: 25565,
			username: global_username.toString(),
			version: "1.8.9"
		});
		global_username += 1;
	// });

	socket.on('get_peer', function(data) {
		// console.log("send peers: ");
		// console.log(connected_players);
		socket.emit('peers', connected_players);
	});
	socket.on('disconnect', function() {
		console.log("client disconnected!");
	});

	function findEntityByName(username) {
		for (id in bot.entities) {
			if (bot.entities[id].username === username)
				return bot.entities[id];
		}
		return null;
	}

	bot.on('playerJoined', function(player) {
		// TODO how to get entity?
		console.log(socket.conn.id);
		console.log(player.username + " joined the game"
			// + " at " + player.position.x + "," + player.position.y + "," + player.position.z
			);
		var player_id;
		var player_entity;
		for (id in bot.entities) {
			if (bot.entities[id].username === player.username) {
				player_id = id;
				player_entity = bot.entities[id];
				break;
			}
		}
		// console.log("entities:");
		// console.log(bot.entities);
		// console.log("players:");
		// console.log(bot.players);
		// console.log("joker:");
		// console.log(bot.players.joker);
		// console.log("player:");
		// console.log(player_entity);
		// console.log(player.username + " joined the game at " + 
			// player.position.x + "," + player.position.y + "," + player.position.z);
		console.log('player_entity', player_entity);
		if (player_entity) {
			console.log("position: " + player_entity.position.x + "," + player_entity.position.y + "," + player_entity.position.z);
			socket.emit('join', { entity: player_entity, id: player_id });
		} else {
			console.log('empty player entity');
			player_entity = {
				username: player.username
			};
			socket.emit('join', { entity: player_entity, id: player_id });
		}
	});
	bot.on('playerLeft', function(player) {
		console.log(player.username + " left the game");
		socket.emit('left', player.username);
	});

});

// maintains a list of connected players
var connected_players = [];
bot.once('spawn', function() {
	setInterval(whoison, 10);

	function whoison() {
		connected_players = bot.entities;
		// console.log(connected_players);
		for (index in connected_players) {
			var player = connected_players[index];
			// console.log(player.username + " at " + 
				// player.position.x + "," + player.position.y + "," + player.position.z + 
				// " is connected!");
		}
	}
});
