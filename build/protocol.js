// var noajs = require("./noa.js"); Doesn't work with webpack
import { startNoa } from './noa.js';
import { viewChat } from './chat.js';
var mc = require('minecraft-protocol');
const Chunk = require('prismarine-chunk')("1.12.2");
var client; // Maybe if I declare it here? Yep, that worked

window.chunksToLoad = {}; // Chunks to load into noa

/* global client, noa, Engine, opts, Mesh, Chunk, chunksToLoad*/

export function getClient() {
  return client; // What about doing that?
}
 // probalby its good. i mean the other way would pass it thru a function or use window
export function login(clientOpts, noaOpts) {
  // updatePosition client isnt defined, pass it thru? No, it's in the same file
  client = mc.createClient(clientOpts);

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
  
  client.on('kick_disconnect', function (packet) { 
    alert("Disconnected: " + packet.reason);
  });
  
  client.on('chat', function (packet) { // i made this script to parse messages
    console.log(packet)
    // alright imma compile and test if this script still works on 1.12.2
    // Is what I did on line 12 good?
    let fullmessage = JSON.parse(packet.message.toString());; // JSON parse the message string (its a string)
    // know i know why i did that xd
    let msg;
    if (fullmessage.extra.length > 0) {
      msg = '';
      for (var i in fullmessage.extra) {
        console.log('loop!')
        if (fullmessage.extra[i].text) {
          msg = msg + fullmessage.extra[i].text
        } else { // i swear i hate this message system of minecraft
          // "{"text":"","extra":[{"text":"<Beanes> ","color":"white","bold":false,"italic":false,"underlined":false,"strikethrough":false,"obfuscated":false},{"text":"","extra":[{"text":"z","color":"white","bold":false,"italic":false,"underlined":false,"strikethrough":false,"obfuscated":false}]}]}"
          for (var j in fullmessage.extra[i].extra) {
            if (fullmessage.extra[i].extra[j].text) {
              msg = msg + fullmessage.extra[i].extra[j].text
            }
          }
        }
      }
    } else {
      msg = fullmessage.extra
    };
    console.log('new msg', msg)
    var ul = document.getElementById("chat");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    //li.setAttribute("id", "element4"); // add attributes if needed (can be used to color maybe?)
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight; // Stay bottem of the list
      // imma look at packet structure first, i saw that already
      
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