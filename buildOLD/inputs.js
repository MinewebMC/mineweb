import { addChatEvents } from "./chat.js";

export function bindInputs(noa) {
  let inputs = require("game-inputs")(noa.container.element);
  inputs.disabled = true;

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

export function setEventInputs(noa) {
  addChatEvents();

  noa.inputs.down.on("break", function() {
    if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
  });
  noa.inputs.down.on("place", function() {
    // if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent)
  });
}
