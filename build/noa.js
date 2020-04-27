import Engine from 'noa-engine';
import { registerTextures } from './textures.js';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { updatePosition } from './protocol.js';
var Vec3 = require('vec3').Vec3;

//already imported by setup.js, is a global so we inlude it here VV
/* global Engine, Mesh*/
// Shouldn't this be imported by protocol.js so it can call it when it's logged in?
//wait hmm

export function startNoa(noaOpts) {
  // Engine options object, and engine instantiation:
  var noa = new Engine(noaOpts);

  // var texturejs = require("./textures.js"); Doesn't work with webpack
  // registerTextures(noa); PUT THIS BACK WHEN IT WORKS!
  var textureURL = null // replace that with a filename to specify textures
  var brownish = [0.45, 0.36, 0.22]
  var greenish = [0.1, 0.8, 0.2]
  noa.registry.registerMaterial('dirt', brownish, textureURL)
  noa.registry.registerMaterial('grass', greenish, textureURL)
  
  // block types and their material names
  var dirtID = noa.registry.registerBlock(1, { material: 'dirt' })
  var grassID = noa.registry.registerBlock(2, { material: 'grass' })
  
  noa.world.maxChunksPendingCreation = 9999;
  
// simple height map worldgen function
function getVoxelID(x, y, z) {
    if (y < -3) return dirtID
    var height = 2 * Math.sin(x / 10) + 3 * Math.cos(z / 20)
    if (y < height) return grassID
    return 0 // signifying empty space
}  
  
  noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
    window.setTimeout(function() { // Just testing
    console.log("needed: " + `${x / 16}|${y / 16}|${z / 16}`, id);
    console.log(chunksToLoad[`${x / 16}|${y / 16}|${z / 16}`]);
    if (typeof chunksToLoad[`${x / 16}|${y / 16}|${z / 16}`] == "undefined") { // If it isn't a chunk that needs to be loaded
      delete noa.world._chunkIDsPending[`${x / 16}|${y / 16}|${z / 16}`];
      console.log("Chunk not found:", `${x / 16}|${y / 16}|${z / 16}`);
    } else {
      for (var i = 0; i < data.shape[0]; i++) {
        for (var j = 0; j < data.shape[1]; j++) {
          for (var k = 0; k < data.shape[2]; k++) {
            var voxelID = chunksToLoad[`${x / 16}|${y / 16}|${z / 16}`].getBlock(new Vec3(k, y + j, i)); // x and z are reversed because otherwise it looks wrong
            // console.log("ID:", voxelID);
            if (voxelID.type == 0) {
              voxelID = 0;
            } else {
              voxelID = 1;
            }
            // var voxelID = getVoxelID(x + i, y + j, z + k)
            data.set(i, j, k, voxelID);
          }
        }
      }
      noa.world.setChunkData(id, data);
    }
    // noa.world._chunkIDsPending = []; // So noa isn't expecting to recieve chunk data when it never will
    /*for (var i = 0; i < data.shape[0]; i++) {
          for (var j = 0; j < data.shape[1]; j++) {
              for (var k = 0; k < data.shape[2]; k++) {
                  var voxelID = getVoxelID(x + i, y + j, z + k)
                  data.set(i, j, k, voxelID)
              }
          }
      }
      // noa.world.setChunkData(id, data) */
      }, 1000);
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
    var playerPos = noa.ents.getPosition(noa.playerEntity);
    updatePosition(playerPos[0], playerPos[1], playerPos[2]);
    // bot.setControlState('forward', noa.inputs.state.forward);
    // bot.setControlState('jump', noa.inputs.state.jump);
      var scroll = noa.inputs.state.scrolly
      if (scroll !== 0) {
          noa.camera.zoomDistance += (scroll > 0) ? 1 : -1
          if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0
          if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10
      }
  })





  // let inputsjs = require("./inputs.js");
  // inputsjs.bind(noa);
  // inputsjs.setEvents(noa);
}