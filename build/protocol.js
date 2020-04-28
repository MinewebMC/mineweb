// var noajs = require("./noa.js"); Doesn't work with webpack
import { startNoa } from './noa.js';
import { viewChat } from './chat.js';
var mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')("1.12.2");

window.chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk, chunksToLoad*/

export function login(clientOpts, noaOpts) {
  
  window.client = mc.createClient(clientOpts);

  client.on('login', function() {
    startNoa(noaOpts);
  });
  
  client.on('block_change', function(packet) {
    console.log('Block change! ', packet)
    // This works now
    noa.setBlock(packet.type, packet.location.z, packet.location.y, packet.location.x) // Only 0 and 1 exist for now
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
  
  client.on('message', function (packet) { // i made this script to parse messages
    viewChat(packet);
    // This should go in chat.js //alright.. what about listening to the packet inside chat.js?
    // Passing the client. Well its going to be a lot... For example if u want to support EVERYTHING its going to be a long file. (Inventory it self will be a lot for example, pickup, drop, etc) 
    // Pass it to chat.js then
    // Is client global?
    // Yes, I put window.client
      var fullmessage = JSON.parse(data.message.toString()); // oh did you? but we should make a init function Line 13
      if (!fullmessage.extra) {
        message = fullmesasge.text
      } else {
        var message = '';
        for (var i in fullmessage.extra) {
          if (fullmessage.extra[i].text) {
            message = message + fullmessage.extra[i].text.toLowerCase();
          }
        }
      };
      
  })
  
  // client.on('chat', function(packet) {
  //   console.log(packet)
  //   var jsonMsg = JSON.parse(packet.message);
  //   if(jsonMsg.translate == 'chat.type.announcement' || jsonMsg.translate == 'chat.type.text') {
  //     const username = jsonMsg.with[0].text
  //     const msg = jsonMsg.with[1]
  //     if (username === client.username) return
  //     if (msg.text) client.write('chat', { message: msg.text })
  //     else client.write('chat', { message: msg })
      // Im going to take my own code of another project i made.. Because this is a bit broken 
      
  // });
  
}

export function updatePosition(x, y, z) {
  client.write('position', {x: z, y: y, z: x, onGround: true});
}