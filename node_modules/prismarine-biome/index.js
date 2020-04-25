module.exports = loader;

function loader(mcVersion)
{
  biomes=require('minecraft-data')(mcVersion).biomes;
  return Biome;
}

var biomes;

function Biome(id) {
  this.id = id;
  var biomeEnum = biomes[id];
  if(biomeEnum) {
    this.color = biomeEnum.color;
    this.name = biomeEnum.name;
    this.height = biomeEnum.height;
    this.rainfall = biomeEnum.rainfall;
    this.temperature = biomeEnum.temperature;
  } else {
    this.color = 0;
    this.height = null;
    this.name = "";
    this.rainfall = 0;
    this.temperature = 0;
  }
}
