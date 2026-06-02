const axios = require("axios");

module.exports.config = {
  name: "slap",
  version: "1.0.0",
  permission: 0,
  credits: "you",
  description: "slap command"
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, mentions, messageReply } = event;

  let targetID;

  const mentionIDs = Object.keys(mentions || {});
  if (mentionIDs.length > 0) {
    targetID = mentionIDs[0];
  } else if (messageReply) {
    targetID = messageReply.senderID;
  }

  if (!targetID) {
    return api.sendMessage(
      "❌ কাউকে mention বা reply করো 😏",
      threadID,
      messageID
    );
  }

  try {
    const res = await axios.get("https://api.waifu.pics/sfw/slap");

    const image = res.data.url;

    const stream = await axios.get(image, {
      responseType: "stream"
    });

    return api.sendMessage({
      body: `🤜 slap করা হলো!`,
      attachment: stream.data
    }, threadID, messageID);

  } catch (e) {
    return api.sendMessage("❌ API error", threadID, messageID);
  }
};
