/* global noa*/

const mcData = require("minecraft-data")("1.12.2");

export function registerTextures(noa) {
  for (var i = 1; i < 256; i++) {
    mcData.blocks[0].name
    var textureURL = null // replace that with a filename to specify textures
    noa.registry.registerMaterial(i.toString(), [Math.random(), Math.random(), Math.random()], textureURL) // Random colours
    noa.registry.registerBlock(i, { material: i.toString() })
  }
  // block types and their material names
  // var grassID = noa.registry.registerBlock(2, { material: 'grass' })
};