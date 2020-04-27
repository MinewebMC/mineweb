module.exports.bind = (noa) => {
  
  var inputs = require('game-inputs')( noa.container )
  
  inputs.bind( 'move-forward',   'W', '<up>' )
  inputs.bind( 'move-left', 'A', '<left>' )
  inputs.bind( 'move-right', 'D', '<right>' )
  inputs.bind( 'move-backward', 'S', '<left>' )
  inputs.bind( 'move-left', 'A', '<left>' )
  inputs.bind( 'move-left', 'A', '<left>' )
  inputs.bind( 'move-left', 'A', '<left>' )

// bind left mouse to "fire"
  inputs.bind( 'fire',  '<mouse 1>' )
};


module.exports.setEvents = (noa) => {
  noa.inputs.down.on('fire', function () {
      // if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position)
  })
  noa.inputs.down.on('alt-fire', function () {
      // if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent)
  })
};