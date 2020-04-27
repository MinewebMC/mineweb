var noajs = require("./noa.js");

/* global client, noa, Engine, opts, Mesh, Chunk*/

exports.login = (mc, clientOpts, noaOpts) => {
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