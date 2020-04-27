let messagesList = [];

export function sendChat(client) {
  let msg = prompt("Send Message");
  client.write('chat', {message: msg});
  
};

export function viewChat(msg) {
  if(messagesList.length>=31){
  messagesList.push(msg);
  
  //escape characters for the html
  msg = msg.replace("<", "&lt");
  msg = msg.replace(">", "&gt");
  msg = msg.replace("&", "&amp");
  
  document.getElementById("chat").innerHTML += msg + "<br>"
    
  } else if(messagesList.length<31) {
    
    
    
  } else {
    
    console.log("Something is wrong... I can feel it...");
    
  }
};