export function sendChat(client) {
  let msg = prompt("Send Message");
  client.write('chat', {message: msg});
  
};

export function viewChat(client) {
  
};