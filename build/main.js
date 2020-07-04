import { Mineweb } from "./lib/mineweb.js"
let hhost;
while (hhost == "" || hhost == undefined) hhost = prompt("Host", "95.111.249.143:10000");
const mineweb = new Mineweb(hhost.split(":")[0], hhost.split(":")[1]); // TODO: Default port
// import { setup } from "./setup.js";
// setup();

console.log("Mineweb version dev-newchunkload3sixteen"); // In the dev version we can put some random letters here to make sure it built properly, maybe, and do it properly in the snapshot

let username;
while (username == "" || username == undefined) username = prompt("Please choose a username");
console.log("Starting with username: " + username);
mineweb.start(username)
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
