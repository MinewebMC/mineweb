// var noajs = require("./noa.js"); Doesn't work with webpack
import { startNoa } from './noa.js';
var mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')("1.12.2");

window.chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk*/

export function login(clientOpts, noaOpts) {
  window.client = mc.createClient(clientOpts);

  client.on('login', function() {
    startNoa(noaOpts);
  });
  client.on('block_change', function(packet) {
    console.log('Block change! ', packet)
    // noa.world.setBlockID(packet.id, packet.location.z, packet.location.y, packet.location.x) // X, Z switched
    c
    noa.setBlock((packet.type == 0) ? 0 : 1, packet.location.z, packet.location.y, packet.location.x) // Only 0 and 1 exist for now
  })
  client.on('position', function(packet) {
    console.log("Server teleported client to", packet);
    // noa.ents.setCameraRotation()
    noa.ents.setPosition(noa.playerEntity, [packet.z, packet.y, packet.x]); // x and z are reversed because otherwise it looks wrong
    client.write('teleport_confirm', {teleportId: packet.teleportId});
  });

  client.on('map_chunk', function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    for (var y = 0; y < 16; y++) {
      chunksToLoad[`${packet.z}|${y}|${packet.x}`] = chunk; // x and z are reversed because otherwise it looks wrong
      if (!noa.world._chunkIDsToRequest[`${packet.z}|${y}|${packet.x}`]) {
        noa.world._chunkIDsToRequest.push(`${packet.z}|${y}|${packet.x}`);
      }
    }
    // console.log(packet);
    // console.log(chunk);
  });
}

export function updatePosition(x, y, z) {
  client.write('position', {x: z, y: y, z: x, onGround: true});
}