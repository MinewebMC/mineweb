// var noajs = require("./noa.js"); Doesn't work with webpack
import noajs from './noa.js';
var mc = require('minecraft-protocol');

/* global client, noa, Engine, opts, Mesh, Chunk*/

export function login(clientOpts, noaOpts) {
  var client = mc.createClient(clientOpts);

  client.on('login', function() {

    noajs.start(noaOpts);

  });


  client.on('map_chunk', function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    // noa.world._chunkIDsToRequest.push("0|0|0")
    console.log(chunk);
  });
}