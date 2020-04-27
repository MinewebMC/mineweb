import Engine from 'noa-engine';
import { registerTextures } from './textures.js';

//already imported by setup.js, is a global so we inlude it here VV
/* global Engine, Mesh*/
// Shouldn't this be imported by protocol.js so it can call it when it's logged in?
//wait hmm

export function startNoa(noaOpts) {
  var noa = new Engine(noaOpts);

  // var texturejs = require("./textures.js"); Doesn't work with webpack
  textures.setup(noa);

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
}