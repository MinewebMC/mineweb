// var noajs = require("./noa.js"); Doesn't work with webpack
import { startNoa } from './noa.js';
var mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')("1.12.2");

window.chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk*/

export function login(clientOpts, noaOpts) {
  var client = mc.createClient(clientOpts);

  client.on('login', function() {
    startNoa(noaOpts);
  });


  client.on('map_chunk', function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    for (var y = 0; y < 16; y++) {
      chunksToLoad["${z}|${y}|${x}"] = chunk; // x and z are reversed because otherwise it looks wrong
      if (!noa.world._chunkIDsToRequest["${z}|${y}|${x}"]) {
        noa.world._chunkIDsToRequest.push("${z}|${y}|${x}");
      }
    }
    console.log(packet);
    console.log(chunk);
  });
}