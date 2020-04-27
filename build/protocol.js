// var noajs = require("./noa.js"); Doesn't work with webpack
import { startNoa } from './noa.js';
var mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')("1.12.2");

var chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk*/

export function login(clientOpts, noaOpts) {
  var client = mc.createClient(clientOpts);

  client.on('login', function() {
    startNoa(noaOpts);
  });


  client.on('map_chunk', function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    // noa.world._chunkIDsToRequest.push("0|0|0")
    noaChunkId
    console.log(packet);
    console.log(chunk);
  });
}