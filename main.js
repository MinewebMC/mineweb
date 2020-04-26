import Engine from 'noa-engine';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
var mc = require('minecraft-protocol');
var { Vec3 } = require('vec3');
const Chunk = require('prismarine-chunk')("1.12.2");

var chunksToLoad = {}; // Not used yet - Chunks to load into noa

// Options for noa engine
var opts = {
    debug: true,
    showFPS: true,
    chunkSize: 16,
    chunkAddDistance: 0, // So I can handle adding chunks myself
    chunkRemoveDistance: 300.5,
    tickRate: 50, // ms per tick - not ticks per second
}

var client = mc.createClient({
  host: "91.203.193.189",
  port: 25565,
  username: "mineweb" + Math.floor(Math.random() * 1000),
  version: "1.12.2"
});

client.on('map_chunk', function(packet) {
  var chunk = new Chunk();
  chunk.load(packet.chunkData, packet.bitMap);
  // noa.world._chunkIDsToRequest.push("0|0|0")
  // console.log(chunk);
});

client.on('login', function() {
  // bot.chat("/tp " + bot.username + " 0 150 0"); // tp to the right place
  var noa = new Engine(opts);

  var textureURL = null // replace that with a filename to specify textures
  var brownish = [0.45, 0.36, 0.22]
  var greenish = [0.1, 0.8, 0.2]
  noa.registry.registerMaterial('dirt', brownish, textureURL)
  noa.registry.registerMaterial('grass', greenish, textureURL)

  var dirtID = noa.registry.registerBlock(1, { material: 'dirt' })
  var grassID = noa.registry.registerBlock(2, { material: 'grass' })

  function getVoxelID(x, y, z) {
    return 0;
    // return (window.bot.blockAt(new Vec3(z, y, x)).type == 0) ? 0 : 1;
  }

  noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
    console.log("needed: " + id);
    console.log(data);
    noa.world._chunkIDsPending = []; // So noa isn't expecting to recieve chunk data when it never will
    /*  for (var i = 0; i < data.shape[0]; i++) {
          for (var j = 0; j < data.shape[1]; j++) {
              for (var k = 0; k < data.shape[2]; k++) {
                  var voxelID = getVoxelID(x + i, y + j, z + k)
                  data.set(i, j, k, voxelID)
              }
          }
      } */
      // noa.world.setChunkData(id, data)
  })

  var player = noa.playerEntity
  var dat = noa.entities.getPositionData(player)
  var w = dat.width
  var h = dat.height

  var scene = noa.rendering.getScene()
  var mesh = Mesh.CreateBox('player-mesh', 1, scene)
  mesh.scaling.x = w
  mesh.scaling.z = w
  mesh.scaling.y = h

  noa.entities.addComponent(player, noa.entities.names.mesh, {
      mesh: mesh,
      offset: [0, h / 2, 0],
  })
  noa.inputs.down.on('fire', function () {
      // if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position)
  })
  noa.inputs.down.on('alt-fire', function () {
      // if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent)
  })
  noa.on('tick', function (dt) {
    // bot.setControlState('forward', noa.inputs.state.forward);
    // bot.setControlState('jump', noa.inputs.state.jump);
      var scroll = noa.inputs.state.scrolly
      if (scroll !== 0) {
          noa.camera.zoomDistance += (scroll > 0) ? 1 : -1
          if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0
          if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10
      }
  })
});
/* bot.on('move', function() {
  try {
    noa.ents.setPosition(noa.playerEntity, [bot.entity.position.z, bot.entity.position.y, bot.entity.position.x]);
    // angle = Quaternion.Euler(noa.camera.getDirection()[0], noa.camera.getDirection()[1], 0);
    // angle.add();
    bot.look(0 - (noa.camera.heading + 0.5 * Math.PI), 0 - noa.camera.pitch, false);
  } catch(err) {}
});
bot.on('forcedMove', function() {
  try {
    noa.ents.setPosition(noa.playerEntity, [bot.entity.position.z, bot.entity.position.y, bot.entity.position.x]);
  } catch(err) {}
});
bot.on('error', err => console.log(err)) */
