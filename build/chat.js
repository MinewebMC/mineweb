import { getClient } from './protocol.js';

let messagesList = [];


export function addChatEvents() {
  document.onkeypress = function (e) {
    console.log(e.code)
    e = e || window.event; 
    if(e.code === 'KeyT') { 
      let msg = prompt("Send Message");
      getClient().write('chat', {message: msg});
    }
  };
}
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
export function addListeners() {
  const client = getClient()
  
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
}
