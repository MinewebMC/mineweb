/* global client*/

let messagesList = [];

export function sendChat(client) {
  let msg = prompt("Send Message");
  client.write('chat', {message: msg});
  
};

export function viewChat(msg) {
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