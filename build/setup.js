import Engine from "noa-engine";
var { Vec3 } = require("vec3");
import { login } from "./protocol.js";

export function setup() {
  // Options for noa engine
  /* var noaOpts = {
      debug: true,
      showFPS: true,
      chunkSize: 16,
      chunkAddDistance: 0, // So I can handle adding chunks myself
      chunkRemoveDistance: 99999.5,
      tickRate: 50, // ms per tick - not ticks per second
  } */
  var noaOpts = {
    debug: true,
    showFPS: false, // show fps false is better
    chunkSize: 16,
    chunkAddDistance: 2.5,
    chunkRemoveDistance: 999.5,
    tickRate: 50 // ms per tick - not ticks per second
    // See `test` example, or noa docs/source, for more options
  };
  var moveOpts = {
    airJumps: 0,
    maxSpeed: 4.317, // From Mineflayer - not sure if the units are the same
    moveForce: 100, // From Mineflayer - not sure if the units are the same
    standingFriction: 0.9 // From Mineflayer - not sure if the units are the same
  };
  // const username = "minewebuser" + Math.floor(Math.random() * 1000); // you need to r e c o m p i l e. // open terminal and type `./compile.sh` i think mine web user is better then mineweb
  const username = prompt("Please choose a username");
  console.log("Starting with username: " + username);
  var clientOpts = {
    host: "beanes.wtf",
    port: 25565,
    username: username,
    version: "1.12.2"
  };
  login(clientOpts, noaOpts, moveOpts);
}

//
