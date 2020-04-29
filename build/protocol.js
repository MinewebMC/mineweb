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

  client.on("block_change", function(packet) {
    console.log("Block change packet! ", packet);
    noa.setBlock(
      packet.type,
      packet.location.z,
      packet.location.y,
      packet.location.x
    ); // Only 0 and 1 exist for now
  });

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
    yaw: 0 - (noa.camera.heading + 0.5 * Math.PI),
    pitch: 0 - noa.camera.pitch,
    onGround: !noa.ents.getMovement(noa.playerEntity)._isJumping
  });
  // TODO: proper onGround and rotation
}
