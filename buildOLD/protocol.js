// WARN: Do not use require, please use import.
import { startNoa } from "./noa.js";
import { addChatEvents } from "./chat.js";
var mc = require("minecraft-protocol");
const Chunk = require("prismarine-chunk")("1.12.2");
var client;

window.chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk, chunksToLoad*/

export function getClient() {
  return client; // What about doing that?
}
export function login(clientOpts, noaOpts, moveOpts) {
  client = mc.createClient(clientOpts);

  // HACK TO MAKE AN ESC POPUP WITH SETTINGS ETC
  document.addEventListener("pointerlockchange", function(event) {
    const canvas = document.getElementById("noa-canvas");
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      console.log("The pointer lock status is now locked");
    } else {
      console.log("The pointer lock status is now unlocked");
    }
  });
  // END
  
  client.on("login", function() {
    startNoa(noaOpts, moveOpts);
    // Add more... For example inventory
  });
  
  // https://wiki.vg/Protocol#Multi_Block_Change
  // Example packet: {"chunkX":-4,"chunkZ":1,"records":[{"horizontalPos":30,"y":74,"blockId":0},{"horizontalPos":78,"y":73,"blockId":0},{"horizontalPos":62,"y":73,"blockId":0},{"horizontalPos":62,"y":74,"blockId":0},{"horizontalPos":30,"y":73,"blockId":0},{"horizontalPos":47,"y":74,"blockId":0},{"horizontalPos":31,"y":74,"blockId":0},{"horizontalPos":15,"y":74,"blockId":0},{"horizontalPos":95,"y":73,"blockId":0},{"horizontalPos":47,"y":73,"blockId":0},{"horizontalPos":31,"y":73,"blockId":0},{"horizontalPos":15,"y":73,"blockId":0},{"horizontalPos":47,"y":72,"blockId":0},{"horizontalPos":31,"y":72,"blockId":0},{"horizontalPos":15,"y":72,"blockId":0},{"horizontalPos":31,"y":71,"blockId":0}]}
  client.on("multi_block_change", function(packet) {
    console.log("Multi block change packet! ", packet);
    for (var record of packet.records) {
      var x = (record.horizPos >> 4 & 15) + (packet.chunkX * 16); // wiki.vg
      var y = record.y;
      var z = (record.horizPos & 15) + (packet.chunkZ * 16);
      console.log("Multi change record:", x, y, z);
      blockChange(record.blockId, x, y, z);
      // do stuff
    }
  });

  client.on("block_change", function(packet) {
    console.log("Block change packet! ", packet);
    blockChange(packet.type, packet.location.x, packet.location.y, packet.location.z);
  });
  
  function blockChange(type, x, y, z) {
      noa.setBlock(
      type >> 4, // Needs to be bit shifted for 1.12 (our current target version) according to wiki.vg
      z, y, x
    );
  }
    
  client.on("position", function(packet) {
    console.log("Server teleported client to", packet);
    // noa.ents.setCameraRotation()
    noa.ents.setPosition(noa.playerEntity, [packet.z, packet.y, packet.x]); // x and z are reversed because otherwise it looks wrong
    client.write("teleport_confirm", { teleportId: packet.teleportId });
  });

  client.on("map_chunk", function(packet) {
    var chunk = new Chunk();
    chunk.load(packet.chunkData, packet.bitMap);
    for (var y = 0; y < 16; y++) {
      chunksToLoad[`${packet.z}|${y}|${packet.x}`] = chunk; // x and z are reversed because otherwise it looks wrong
      if (!noa.world._chunkIDsToRequest[`${packet.z}|${y}|${packet.x}`]) {
        noa.world._chunkIDsToRequest.push(`${packet.z}|${y}|${packet.x}`);
      }
    }
  });
  
  /* client.on("unload_chunk", function(packet) { // found it in an issue, if basicly reports everything from what is loaded what is known what is going to be unloaded etc https://github.com/andyhall/noa/issues/94#issuecomment-575972591
   // noa.world.report() // Getting lag spikes when the report comes
    
    console.log("Unload packet!", packet);
    for (var y = 0; y < 16; y++) {
      /* console.log(`${packet.chunkZ}|${y}|${packet.chunkZ}`);
      if (noa.world._chunkIDsKnown[`${packet.chunkZ}|${y}|${packet.chunkZ}`]) {
        noa.world._chunkIDsToRemove.push(`${packet.chunkZ}|${y}|${packet.chunkX}`); */
      // noa.world._chunkIDsToRemove.push(`${packet.chunkZ}|${y}|${packet.chunkX}`);
      /*  console.log("Chunk found");
      } else {
        console.log("Warning: Chunk not found");
      } */
      /* noa.world.invalidateVoxelsInAABB({
        base: [packet.chunkZ * 16, y * 16, packet.chunkZ * 16],
        max: [packet.chunkZ * 16, y * 16, packet.chunkZ * 16]
      }); */
    /* }
   noa.world.report() // What does that do?
  }); */

  client.on("kick_disconnect", function(packet) {
    alert("Kicked: " + packet.reason);
  });

  client.on("end", function(reason) {
    alert("Connection closed: " + reason);
  });
}

export function updatePosition(x, y, z) {
  client.write("position_look", {
    x: z,
    y: y,
    z: x,
    yaw: (noa.camera.heading - 0.5 * Math.PI) * 180 / Math.PI, // TODO: Simplify the maths
    pitch: (noa.camera.pitch) * 180 / Math.PI,
    onGround: !noa.ents.getMovement(noa.playerEntity)._isJumping
  });
  // TODO: proper onGround and rotation
}

/*
export function clientDisconnect() {
  client.end(); // Note of SiebeDW: not sure if this would be the correct way, maybe u could use in another file getClient().end. (Import it ofcourse)
}
Removed by Dennis_

*/

