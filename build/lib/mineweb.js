// Client stuff imports (For example we can import prismarine-inventory later)
const mc = require("minecraft-protocol");
// Noa stuff imports
import Engine from "noa-engine";
import { registerTextures } from "./textures.js"; // TEMP
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { bindInputs } from "./inputs.js";
import { setEventInputs } from "./inputs.js";
var Vec3 = require("vec3").Vec3;

export class Mineweb {
  constructor(host, port) {
    this._noaOpts = {
      debug: true,
      showFPS: true, // show fps false is better
      chunkSize: 16,
      chunkAddDistance: 3.5,
      chunkRemoveDistance: 9999.5,
      tickRate: 50 // ms per tick - not ticks per second
    };
    this._moveOpts = {
      airJumps: 0,
      maxSpeed: 4.317, // From Mineflayer - not sure if the units are the same
      moveForce: 100, // From Mineflayer - not sure if the units are the same
      standingFriction: 0.9 // From Mineflayer - not sure if the units are the same
    };

    this._clientOpts = {
      host: host,
      port: port,
      version: "1.12.2"
    };

    this.plugins = {
      blocks: require("./plugins/blocks.js"),
      location: require("./plugins/location.js"),
      chat: require('./plugins/chat.js')
    };

    this._client;
    this._noa;

    this.inventory = ""; // Put here a creation of prismarine-inventory
    this.health = 20;
    this.gamemode = 0;
    // etc...
  }

  
  
  
  start(username) {
    const self = this;
    console.log("Got username: " + username);
    this._clientOpts.username = username;
    this._client = mc.createClient(this._clientOpts);
    this._client.on("login", function() {
      // The client joined the server
      self.registerPlugins(); // Use self since we're inside a new function
      self.startNoa(self._noaOpts, self._moveOpts);
      // startNoa(noaOpts, moveOpts);
    });
    // login(this._clientOpts, this._noaOpts, this._moveOpts)
  }
  
  
  
  
  
  registerPlugins() {
    let i;
    for (i in this.plugins) {
      this.plugins[i].init(this);
    }
  }
  
  
  
  startNoa(noaOpts, moveOpts) { // IDEALLY
    const self = this;
    // Engine options object, and engine instantiation:
    this._noa = new Engine(noaOpts);
    this._noa.ents.addComponentAgain(
      this._noa.playerEntity,
      this._noa.ents.names.movement,
      moveOpts
    );
    this._noa.world.manuallyControlChunkLoading = true;

    bindInputs(this);
    setEventInputs(this);

    // var texturejs = require("./textures.js"); Doesn't work with webpack
    registerTextures(this._noa);

    // simple height map worldgen function
    // function getVoxelID(x, y, z) {
    //   if (y < -3) return dirtID;
    //   var height = 2 * Math.sin(x / 10) + 3 * Math.cos(z / 20);
    //   if (y < height) return grassID;
    //   return 0; // signifying empty space
    // }

    this._noa.world.on("worldDataNeeded", function(id, data, x, y, z) {
      // window.setTimeout(function() { // Just testing
      console.log("needed: " + `${x / 16}|${y / 16}|${z / 16}`, id);
      // console.log(chunksToLoad[`${x / 16}|${y / 16}|${z / 16}`]);
      if (typeof chunksToLoad[`${x / 16}|${y / 16}|${z / 16}`] == "undefined") {
        console.log("Chunk not found:", `${x / 16}|${y / 16}|${z / 16}`);
      } else {
        for (var i = 0; i < data.shape[0]; i++) {
          for (var j = 0; j < data.shape[1]; j++) {
            for (var k = 0; k < data.shape[2]; k++) {
              var voxelID = chunksToLoad[
                `${x / 16}|${y / 16}|${z / 16}`
              ].getBlock(new Vec3(k, y + j, i)).type; // x and z are reversed because otherwise it looks wrong
              console.log("ID:", voxelID);
              /* if (voxelID.type == 0) {
              voxelID = 0;
            } else {
              voxelID = 1;
            } */
              // var voxelID = getVoxelID(x + i, y + j, z + k)
              data.set(i, j, k, voxelID);
            }
          }
        }
        self._noa.world.setChunkData(id, data);
      }
      // noa.world._chunkIDsPending = []; // So noa isn't expecting to recieve chunk data when it never will
      /*for (var i = 0; i < data.shape[0]; i++) {
          for (var j = 0; j < data.shape[1]; j++) {
              for (var k = 0; k < data.shape[2]; k++) {
                  var voxelID = getVoxelID(x + i, y + j, z + k)
                  data.set(i, j, k, voxelID)
              }
          }
      }
      // noa.world.setChunkData(id, data) */
      // }, 1000);
    }); 
    

    var player = this._noa.playerEntity;
    var dat = this._noa.entities.getPositionData(player);
    var w = dat.width;
    var h = dat.height;

    var scene = this._noa.rendering.getScene();
    var mesh = Mesh.CreateBox("player-mesh", 1, scene);
    mesh.scaling.x = w;
    mesh.scaling.z = w;
    mesh.scaling.y = h;

    this._noa.entities.addComponent(player, this._noa.entities.names.mesh, {
      mesh: mesh,
      offset: [0, h / 2, 0]
    });

    /* noa.entities.addComponent(player, noa.entities.components.movement, {
    airJumps: 0 // Disable air jumps
  }); */

    this._noa.ents.getPhysicsBody(this._noa.playerEntity).friction = 50;
    this._noa.ents.getPhysicsBody(this._noa.playerEntity).gravityMultiplier = 4.2;
    this._noa.world.maxChunksPendingCreation = 9999;

    this._noa.rendering._camera.fov += 0.4; // Increase FoV

    this._noa.on("tick", function(dt) {
      var playerPos = self._noa.ents.getPosition(self._noa.playerEntity);
      self.plugins['location'].updatePosition(self, playerPos[0], playerPos[1], playerPos[2]);
      // bot.setControlState('forward', noa.inputs.state.forward);
      // bot.setControlState('jump', noa.inputs.state.jump);
      var scroll = self._noa.inputs.state.scrolly;
      if (scroll !== 0) {
        self._noa.camera.zoomDistance += scroll > 0 ? 1 : -1;
        if (self._noa.camera.zoomDistance < 0) self._noa.camera.zoomDistance = 0;
        if (self._noa.camera.zoomDistance > 10) self._noa.camera.zoomDistance = 10;
      }
    });
  }
  
  
}
