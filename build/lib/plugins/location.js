export function updatePosition(mineweb, x, y, z) {
  mineweb._client.write("position_look", {
    x: z,
    y: y,
    z: x,
    // yaw: (mineweb._noa.camera.heading - 0.5 * Math.PI) * 180 / Math.PI, // TODO: Simplify the maths
    yaw: 180 * mineweb._noa.camera.heading / Math.PI - 90,
    // pitch: mineweb._noa.camera.pitch * 180 / Math.PI,
    pitch: (mineweb._noa.camera.pitch) * 180 / Math.PI,
    onGround: !mineweb._noa.ents.getMovement(mineweb._noa.playerEntity)._isJumping
  });
  // TODO: proper onGround
}
export function init(mineweb) {
  mineweb._client.on("position", function(packet) {
    console.log("Server teleported client to", packet);
    // noa.ents.setCameraRotation()
    mineweb._noa.ents.setPosition(mineweb._noa.playerEntity, [packet.z, packet.y, packet.x]); // x and z are reversed because otherwise it looks wrong
    mineweb._client.write("teleport_confirm", { teleportId: packet.teleportId });
  });
}