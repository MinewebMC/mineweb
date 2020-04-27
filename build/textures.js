/* global noa*/

export function registerTextures(noa) {
  var textureURL = null // replace that with a filename to specify textures
  var brownish = [0.45, 0.36, 0.22]
  var greenish = [0.1, 0.8, 0.2]
  noa.registry.registerMaterial('dirt', brownish, textureURL)
  noa.registry.registerMaterial('grass', greenish, textureURL)
  
  // block types and their material names
  var dirtID = noa.registry.registerBlock(1, { material: 'dirt' })
  var grassID = noa.registry.registerBlock(2, { material: 'grass' })
};