import { getClient } from "./protocol.js";
import { getNoa } from "./noa.js";

const styles = {
  black: "color:#000000",
  dark_blue: "color:#0000AA",
  dark_green: "color:#00AA00",
  dark_aqua: "color:#00AAAA",
  dark_red: "color:#AA0000",
  dark_purple: "color:#AA00AA",
  gold: "color:#FFAA00",
  grey: "color:#AAAAAA",
  dark_grey: "color:#555555",
  blue: "color:#5555FF",
  green: "color:#55FF55",
  aqua: "color:#55FFFF",
  red: "color:#FF5555",
  light_purple: "color:#FF55FF",
  yellow: "color:#FFFF55",
  white: "color:#FFFFFF",
  bold: "font-weight:900",
  strikethrough: "text-decoration:line-through",
  underlined: "text-decoration:underline",
  italic: "font-style:italic"
};
export function addChatEvents() {
  // Show chat
  document.getElementById("chat").style.display = "block";

  const client = getClient();

  let inChat = false;
  // listen for key
  document.onkeypress = function(e) {
    e = e || window.event;
    if (e.code === "KeyT" && inChat === false) {
      enableChat();
      return false;
      //
    } else if (e.code === "Enter") {
      if (!inChat) return;
      disableChat()
      console.log(getNoa().inputs.disabled);
      getClient().write("chat", {
        message: document.getElementById("chatinput").value
      });
      document.getElementById("chatinput").value = "";
      document.getElementById("chatinput").blur();
      const canvas = document.getElementById("noa-canvas");
      canvas.requestPointerLock =
        canvas.requestPointerLock || canvas.mozRequestPointerLock;
      canvas.requestPointerLock();
    }
  };
  // Enable inputs back when focused
  document.addEventListener("pointerlockchange", function(event) {
    const canvas = document.getElementById("noa-canvas");
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      // Back in game, enable inputs bcak
      inChat = false;
      document.getElementById("chatinput").style.display = "none";
      getNoa().inputs.disabled = false;
    }
  });
  function enableChat() {
    // Set inChat value
    inChat = true;
    // Exit the pointer lock
    document.exitPointerLock();
    // Show chat input
    document.getElementById("chatinput").style.display = "block";
    document.getElementById("chatinput").focus();
    // Disable controls
    getNoa().inputs.disabled = true;
  }
  function disableChat() {
    document.getElementById("chatinput").style.display = "none";
    // Enable controls
    getNoa().inputs.disabled = false;
  }
  
  
  // Client part
  client.on("chat", function(packet) {
    console.log(packet);
    let fullmessage = JSON.parse(packet.message.toString());
    let msglist = [];
    if (fullmessage.extra.length > 0) {
      for (var i in fullmessage.extra) {
        if (fullmessage.extra[i].text) {
          msglist.push({
            text: fullmessage.extra[i].text,
            color: fullmessage.extra[i].color,
            bold: fullmessage.extra[i].bold ? true : false,
            italic: fullmessage.extra[i].italic ? true : false,
            underlined: fullmessage.extra[i].underlined ? true : false,
            strikethrough: fullmessage.extra[i].strikethrough ? true : false,
            obfuscated: fullmessage.extra[i].obfuscated ? true : false
          });
        } else {
          for (var j in fullmessage.extra[i].extra) {
            if (fullmessage.extra[i].extra[j].text) {
              msglist.push({
                text: fullmessage.extra[i].extra[j].text,
                color: fullmessage.extra[i].extra[j].color,
                bold: fullmessage.extra[i].extra[j].bold ? true : false,
                italic: fullmessage.extra[i].extra[j].italic ? true : false,
                underlined: fullmessage.extra[i].extra[j].underlined
                  ? true
                  : false,
                strikethrough: fullmessage.extra[i].extra[j].strikethrough
                  ? true
                  : false,
                obfuscated: fullmessage.extra[i].extra[j].obfuscated
                  ? true
                  : false
              });
            }
          }
        }
      }
    } else {
      msglist.push({ text: fullmessage.extra, color: undefined });
    }
    var ul = document.getElementById("chat");
    var li = document.createElement("li");
    msglist.forEach(msg => {
      console.log(msg);
      var span = document.createElement("span");
      span.appendChild(document.createTextNode(msg.text));
      span.setAttribute(
        "style",
        `${msg.color ? styles[msg.color.toLowerCase()] : styles["white"]}; ${
          msg.bold ? styles["bold"] + ";" : ""
        }${msg.italic ? styles["italic"] + ";" : ""}${
          msg.strikethrough ? styles["strikethrough"] + ";" : ""
        }${msg.underlined ? styles["underlined"] + ";" : ""}`
      );
      li.appendChild(span);
    });
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight; // Stay bottem of the list
  });
}
