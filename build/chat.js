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

export function viewChat(msg) { //this doesnt work
  alert(msg);
  if(messagesList.length>=31){
  messagesList.push(msg);
  
  //escape characters for the html
  // TODO: Escape this properly
  msg = msg.replace("<", "&lt");
  msg = msg.replace(">", "&gt");
  msg = msg.replace("&", "&amp");
  
  document.getElementById("chat").innerHTML += msg + "<br>"
    
  } else if(messagesList.length<31) {
    
    //scroll but we do it ourselves bcuz why not
    messagesList.shift();
    messagesList.push(msg);
    
    messagesList.forEach(i => { //escape chars
      i.replace("<", "&lt");
      i.replace(">", "&gt");
      i.replace("&", "&amp");
    });
    
    document.getElementById("chat").innerHTML = messagesList.join("<br>");
    
  } else {
    
    console.log("Something is wrong... I can feel it...");
    
  }
};