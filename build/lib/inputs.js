// import { addChatEvents } from "./chat.js";
var Vec3 = require("vec3").Vec3;

export function bindInputs(mineweb) {
  var noa = mineweb._noa;
  let inputs = require("game-inputs")(noa.container.element);
  // inputs.disabled = true;

  inputs.bind("move-forward", "W", "<up>");
  inputs.bind("move-left", "A", "<left>");
  inputs.bind("move-right", "D", "<right>");
  inputs.bind("move-backward", "S", "<down>");

  inputs.bind("break", "<mouse 1>");
  inputs.bind("place", "<mouse 2>");
  inputs.bind("pickBlock", "<mouse 3>");

  inputs.bind("jump", "<space>");
  inputs.bind("shift", "<shift-left>");
  inputs.bind("sprint", "<control-left>");

  inputs.bind("tab", "<tab>");
  inputs.bind("pause", "<esc>");
  inputs.bind("chat", "T");

  inputs.bind("drop", "Q");
  inputs.bind("inventory", "E");

  inputs.bind("slot1", "1");
  inputs.bind("slot2", "2");
  inputs.bind("slot3", "3");
  inputs.bind("slot4", "4");
  inputs.bind("slot5", "5");
  inputs.bind("slot6", "6");
  inputs.bind("slot7", "7");
  inputs.bind("slot8", "8");
  inputs.bind("slot9", "9");
}

////////////////////////////////////////////////////////////////////////

export function setEventInputs(mineweb) {
  var noa = mineweb._noa;
  // addChatEvents();
  
  console.log("events");

  noa.inputs.down.on("break", function() {
    // if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
  });
  noa.inputs.down.on(/* "place" */ "alt-fire", function() {
    // if (noa.targetedBlock) noa.addBlock(1, noa.targetedBlock.adjacent)
    var position = noa.pick().position;
    position = new Vec3(position[0], position[1], position[2]); // Convert to Vec3
    var blockFacePosition = position.minus(position.floored());
    // console.log({ x: position.floored().x, y: position.floored().y, z: position.floored().z });
    mineweb._client.write("block_place", { location: position.floored(),
                                          direction: 1,
                                          hand: 0,
                                          cursorX: blockFacePosition.x,
                                          cursorY: blockFacePosition.y,
                                          cursorY: blockFacePosition.z }); // TODO: direction and hand
    console.log("test!1111", position.floored(), );
  });
}
