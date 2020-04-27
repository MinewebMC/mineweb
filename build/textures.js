/* global noa*/

export function registerTextures(noa) {
  //register material here
  // block materials (just colors for this demo)
  var textureURL = null // replace that with a filename to specify textures
  var brownish = [0.45, 0.36, 0.22]
  var greenish = [0.1, 0.8, 0.2]
  noa.registry.registerMaterial('dirt', brownish, textureURL)
  noa.registry.registerMaterial('grass', greenish, textureURL)
};