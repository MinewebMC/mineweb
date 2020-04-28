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
    alert("Kicked: " + packet.reason);
  });
  
  client.on('end', function (reason) { 
    alert("Connection closed: " + reason);
  });
  
  const styles = {
            'black': 'color:#000000',
            'dark_blue': 'color:#0000AA',
            'dark_green': 'color:#00AA00',
            'dark_aqua': 'color:#00AAAA',
            'dark_red': 'color:#AA0000',
            'dark_purple': 'color:#AA00AA',
            'gold': 'color:#FFAA00',
            'grey': 'color:#AAAAAA',
            'dark_grey': 'color:#555555',
            'blue': 'color:#5555FF',
            'green': 'color:#55FF55',
            'aqua': 'color:#55FFFF',
            'red': 'color:#FF5555',
            'light_purple': 'color:#FF55FF',
            'yellow': 'color:#FFFF55',
            'white': 'color:#FFFFFF',
            'bold': 'font-weight:900',
            'strikethrough': 'text-decoration:line-through',
            'underlined': 'text-decoration:underline',
            'italic': 'font-style:italic',
  }
  client.on('chat', function (packet) { // i made this script to parse messages
    console.log(packet)
    // alright imma compile and test if this script still works on 1.12.2
    // Is what I did on line 12 good?
    let fullmessage = JSON.parse(packet.message.toString());; // JSON parse the message string (its a string)
    // know i know why i did that xd
    let msglist = [];
    if (fullmessage.extra.length > 0) {
      for (var i in fullmessage.extra) {
        console.log('loop!')
        if (fullmessage.extra[i].text) {
          msglist.push({ text: fullmessage.extra[i].text, color: fullmessage.extra[i].color, bold: (fullmessage.extra[i].bold ? true : false), italic: (fullmessage.extra[i].italic ? true : false), underlined: (fullmessage.extra[i].underlined) ? true : false, strikethrough: (fullmessage.extra[i].strikethrough) ? true : false, obfuscated: (fullmessage.extra[i].obfuscated) ? true : false })
        } else { // i swear i hate this message system of minecraft
          // "{"text":"","extra":[{"text":"<Beanes> ","color":"white","bold":false,"italic":false,"underlined":false,"strikethrough":false,"obfuscated":false},{"text":"","extra":[{"text":"z","color":"white","bold":false,"italic":false,"underlined":false,"strikethrough":false,"obfuscated":false}]}]}"
          for (var j in fullmessage.extra[i].extra) {
            if (fullmessage.extra[i].extra[j].text) {
               msglist.push({ text: fullmessage.extra[i].extra[j].text, color: fullmessage.extra[i].extra[j].color, bold: (fullmessage.extra[i].extra[j].bold ? true : false), italic: (fullmessage.extra[i].extra[j].italic ? true : false), underlined: (fullmessage.extra[i].extra[j].underlined) ? true : false, strikethrough: (fullmessage.extra[i].extra[j].strikethrough) ? true : false, obfuscated: (fullmessage.extra[i].extra[j].obfuscated) ? true : false  })
            }
          }
        }
      }
    } else {
      msglist.push({ text: fullmessage.extra, color: undefined })
    };
    var ul = document.getElementById("chat");
    var li = document.createElement("li");
    msglist.forEach(msg => {
      console.log(msg)
      var span = document.createElement("span")
      span.appendChild(document.createTextNode(msg.text));
      span.setAttribute("style", `${msg.color ? styles[msg.color.toLowerCase()] : styles['white']}; ${msg.bold ? styles['bold'] + ';': ''}${msg.italic ? styles['italic'] + ';': ''}${msg.strikethrough ? styles['strikethrough'] + ';': ''}${msg.underlined ? styles['underlined'] + ';': ''}`);
      li.appendChild(span)
    })
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;// Stay bottem of the list      
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