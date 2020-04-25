var mineflayer = require('mineflayer');
loaded = false;
var Vec3 = require('vec3').Vec3;

window.placeblock = function(adj, vec) {
  bot.placeBlock(bot.blockAt({"x": adj[0], "y": adj[1], "z": adj[2]}), new Vec3(0, 1, 0) /* new Vec3(vec[0], vec[1], vec[2]) */, function() {})
}

window.login = function(e) {
  if (loaded) {
    e.preventDefault();
    return false;
  }
  loaded = true;
  window.bot = mineflayer.createBot({
    host: "localhost", // optional
    port: 25565,       // optional
    username: document.getElementById("email").value, // email and password are required only for
    // password: document.getElementById("password").value,          // online-mode=true servers
    viewDistance: "tiny",
    version: "1.12.2"                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
  });
  bot.on('spawn', function() {
    startnoa();
  });
  bot.on('chunkColumnLoad', function(point) {
    console.log("Have: " + JSON.stringify(point) + bot.blockAt({"x": point.x, "y": 240, "z": point.z}).type);
    /* setTimeout(function() {
      for (var i = 0; i < 16; i++) {
          for (var j = 0; j < 256; j++) {
              for (var k = 0; k < 16; k++) {
                  var voxelID = (bot.blockAt({"x": point.x + i, "y": j, "z": point.z + k}).type == 0) ? 0 : 1;
                  noa.setBlock(voxelID, point.x + i, j - 60, point.z + k);
              }
          }
      }

    }, 6000); */
  });

  bot.on('move', function() {
    try {
      noa.ents.setPosition(noa.playerEntity, [bot.entity.position.x, bot.entity.position.y - 60, bot.entity.position.z]);
      //      bot.lookAt(new Vec3(noa.targetedBlock.position[0], noa.targetedBlock.position[1], noa.targetedBlock.position[2]), false);
      bot.look((180 + noa.camera.getDirection()[0]) % 360, noa.camera.getDirection()[1], false);
    } catch(err) {}
  });
  bot.on('forcedMove', function() {
    try {
      noa.ents.setPosition(noa.playerEntity, [bot.entity.position.x, bot.entity.position.y - 60, bot.entity.position.z]);
    } catch(err) {}
  });

  bot.on('chat', function(username, message) {
    document.getElementById("chat").innerText += "<" + username + "> " + message + "\n";
    // if (username === bot.username) return;
    // bot.chat(message);
  });
  bot.on('error', err => console.log(err));
  e.preventDefault();
  return false;
}

window.sendMessage = function(e) {
  bot.chat(document.getElementById("messagebox").value);
  document.getElementById("messagebox").value = "";
  e.preventDefault();
  return false;
}
