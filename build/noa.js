import Engine from 'noa-engine';
import { registerTextures } from './textures.js';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
var Vec3 = require('vec3').Vec3;

//already imported by setup.js, is a global so we inlude it here VV
/* global Engine, Mesh*/
// Shouldn't this be imported by protocol.js so it can call it when it's logged in?
//wait hmm

export function startNoa(noaOpts) {
  var noa = new Engine(noaOpts);

  // var texturejs = require("./textures.js"); Doesn't work with webpack
  registerTextures(noa);
  
  noa.world.maxChunksPendingCreation = 9999;
  
  noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
    console.log("needed: " + `${x}|${y}|${z}`);
    // console.log(data);
    if (!chunksToLoad[`${x}|${y}|${z}`]) { // If it isn't a chunk that needs to be loaded
      delete noa.world._chunkIDsPending[`${x}|${y}|${z}`];
      console.log("Chunk not found:");
    } else {
      for (var i = 0; i < data.shape[0]; i++) {
        for (var j = 0; j < data.shape[1]; j++) {
          for (var k = 0; k < data.shape[2]; k++) {
            var voxelID = chunksToLoad[`${x}|${y}|${z}`].getBlock(new Vec3(i, y + j, k));
            console.log("ID:", voxelID);
            if (voxelID.name == "air") {
              voxelID = 0;
            } else {
              voxelID = 1;
            }
            data.set(i, j, k, voxelID);
          }
        }
      }
      noa.world.setChunkData(id, data);
    }
    // noa.world._chunkIDsPending = []; // So noa isn't expecting to recieve chunk data when it never will
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