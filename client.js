var createGame = require('voxel-engine');
var createTerrain = require('voxel-perlin-terrain');
var debris = require('voxel-debris');
var io = require('socket.io-client');

var game = window.game = createGame({
	generate: function(x, y, z) {
		return y === 1 ? 1 : 0;
	},
	texturePath: './textures/'
});

game.appendTo(document.body);

// container.addEventListener('click', function() {
//   game.requestPointerLock(container)
// });

var createPlayer = require('voxel-player')(game);
var me = createPlayer();
me.possess();
me.yaw.position.set(0, 10, 0);

// create and display multiple players
var skin_list = [];
var skin = require('minecraft-skin');
function addPlayer(player, id) {
	var player_skin = skin(game.THREE, 'player1.png');
	var player_skin_obj = player_skin.createPlayerObject();
	var coord = coord_trans(player.position.x, player.position.y, player.position.z);
	player_skin_obj.position.set(coord[0], coord[1], coord[2]);
	console.log(player.username + " is added at " + coord[0] + "," + coord[1] + "," + coord[2])
	game.scene.add(player_skin_obj);
	var walk = require('voxel-walk');
	skin_list.push({
		id: id,
		key: player.username,
		skin: player_skin,
		skin_obj: player_skin_obj,
		walk: walk,
		iswalking: true,
		old_coord: [0,0,0]
	});
}
function removePlayer(username) {
	console.log("removing " + username);
	for (id in skin_list) {
		var p_skin = skin_list[id];
		console.log("finding: " + p_skin);
		if (p_skin.key === username) {
			console.log(username + "found!");
			game.scene.remove(p_skin.skin_obj);
			skin_list.splice(id, 1);
		}
	}
}
function updatePos(player) {
	console.log("skin list:");
	console.log(skin_list);
	for (id in skin_list) {
		var p_skin = skin_list[id];
		if (p_skin.key === player.username) {
			var walk = p_skin.walk;
			walk.render(p_skin.skin);  // FIXME!!!!!!**********
			console.log("player:");
			console.log(player);
			console.log("skin");
			console.log(p_skin.skin_obj);
			var coord = coord_trans(player.position.x, player.position.y, player.position.z);
			console.log("coord");
			console.log(coord);
			// walk animation TODO: stop walking animation when the player is static
			// console.log("old_coord should be: " + p_skin.skin_obj.position.y);
			// var old_coord = [p_skin.skin_obj.position.x, p_skin.skin_obj.position.y, p_skin.skin_obj.position.z];
			// var moving_distance = calculate_distance(coord, p_skin.old_coord);
			// p_skin.old_coord[0] = coord[0];
			// p_skin.old_coord[1] = coord[1];
			// p_skin.old_coord[2] = coord[2];
			// console.log("old_coord");
			// console.log(p_skin.old_coord);			
			// console.log("moving distance: " + moving_distance);
			// if (moving_distance > 1 && !p_skin.iswalking) {
			// 	console.log("start walking");
			// 	p_skin.iswalking = true;
			// 	walk.startWalking();
			// } else if (moving_distance <= 1 && p_skin.iswalking) {
			// 	console.log("stop walking");
			// 	p_skin.iswalking = false;
			// 	walk.stopWalking();
			// }
			console.log("update position of " + player.username
				+ " to " + coord
				);
			p_skin.skin_obj.position.set(coord[0], coord[1], coord[2]);
			break;
		}
	}

	function calculate_distance(coord1, coord2) {
		var x_dis = coord1[0] - coord2[0];
		var y_dis = coord1[1] - coord2[1];
		var z_dis = coord1[2] - coord2[2];
		return Math.sqrt(x_dis * x_dis + y_dis * y_dis + z_dis * z_dis);
	}
}
// var player1_name = "player1";
// var pos = [0, 0, 0]
// var player1 = skin(game.THREE, player1_name + '.png').createPlayerObject();
// player1.position.set(0, 0, 0);
// game.scene.add(player1);
// player_list.push({
	// key: player1_name,
	// value: player1
// });

// update player position 
// FIXME: not working
// game.on('mousedown', function (pos) {
	// console.log('mouse click at:' + pos);
	// if (erase) explode(pos)
	// else game.createBlock(pos, currentMaterial)
// });

// communicating with proxy server
var socket = io.connect('10.131.251.231:8080');
var username = Math.floor(Math.random() * 1000);
// socket.emit('login', { username: username, player: me });
socket.on('peers', function(connected_players) {
	console.log("receive connected players:")
	console.log(connected_players)
	for (id in connected_players) {
		var player = connected_players[id];
		updatePos(player);
	}
});
socket.on('join', function(data) {
	console.log("data:");
	console.log(data);
	var player = data.entity;
	var id = data.id;
	// console.log(player.username + " joined the game");
	console.log("new player: " + player);
	addPlayer(player, id);
	// connected_players.push(player);
});
socket.on('left', function(player_name) {
	// TODO: remove player
	console.log(player_name + "left");
	removePlayer(player_name);
});

// timer for showing player position
var times = 0;
// todo uncomment this
game.on('tick', function() {
	times += 1;
	// console.log(times);
	if (times >= 0) {
		console.log('tock');
		socket.emit('get_peer', {});
		console.log('me pos: " ' + me.position.x + ',' + me.position.y + ',' + me.position.z);
		// console.log(connected_players);
		// for (index in connected_players) {
			// var player = connected_players[index];
			// console.log("player " + player.username + " is connected");
			// updatePos(player);
		// }
		times = 0;
	}
});

// coordination translation layer, input: position in MC, output: position in browser
function coord_trans(x, y, z) {
	return [ x - 61, y, z - 47];
}