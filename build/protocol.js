/* global client, noa, Engine, opts, Mesh, Chunk*/

exports.login = (clientOpts) => {
  var client = mc.createClient(clientOpts);

  client.on('login', function() {



    // bot.chat("/tp " + bot.username + " 0 150 0"); // tp to the right place

  });


  client.on('map_chunk', function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    // noa.world._chunkIDsToRequest.push("0|0|0")
    console.log(chunk);
  });
}