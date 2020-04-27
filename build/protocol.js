/* global client, noa, Engine, opts, Mesh, Chunk*/


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
  
  
  
  
  
  let inputsjs = require("./inputs.js");
  inputsjs.bind(noa);
  inputsjs.setEvents(noa);
});


client.on('map_chunk', function(packet) {
  var chunk = new Chunk();
  chunk.load(packet.chunkData, packet.bitMap);
  // noa.world._chunkIDsToRequest.push("0|0|0")
  console.log(chunk);
});