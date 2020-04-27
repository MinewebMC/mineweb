import Engine from 'noa-engine';
var { Vec3 } = require('vec3');
import { login } from './protocol.js';

export function setup() {
  // Options for noa engine
  var noaOpts = {
      debug: true,
      showFPS: true,
      chunkSize: 16,
      chunkAddDistance: 0, // So I can handle adding chunks myself
      chunkRemoveDistance: 99999.5,
      tickRate: 50, // ms per tick - not ticks per second
  }

  var clientOpts = {
    host: "91.203.193.189",
    port: 25565,
    username: "mineweb" + Math.floor(Math.random() * 1000),
    version: "1.12.2"
  };

  login(clientOpts, noaOpts);
}