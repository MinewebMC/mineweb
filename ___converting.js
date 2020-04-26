



client.on('map_chunk', function(packet) {
  var chunk = new Chunk();
  chunk.load(packet.chunkData, packet.bitMap);
  // noa.world._chunkIDsToRequest.push("0|0|0")
  console.log(chunk);
});


/* bot.on('move', function() {
  try {
    noa.ents.setPosition(noa.playerEntity, [bot.entity.position.z, bot.entity.position.y, bot.entity.position.x]);
    // angle = Quaternion.Euler(noa.camera.getDirection()[0], noa.camera.getDirection()[1], 0);
    // angle.add();
    bot.look(0 - (noa.camera.heading + 0.5 * Math.PI), 0 - noa.camera.pitch, false);
  } catch(err) {}
});
bot.on('forcedMove', function() {
  try {
    noa.ents.setPosition(noa.playerEntity, [bot.entity.position.z, bot.entity.position.y, bot.entity.position.x]);
  } catch(err) {}
});
bot.on('error', err => console.log(err)) */
