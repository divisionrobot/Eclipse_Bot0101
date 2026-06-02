const axios = require("axios");

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, mentions, messageReply } = event;

  let targetID;

  // MENTION
  const mentionIDs = Object.keys(mentions);
  if (mentionIDs.length > 0) {
    targetID = mentionIDs[0];
  }

  // REPLY
  else if (messageReply) {
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

    return api.sendMessage({
      body: `🤜 slap করা হলো!`,
      attachment: await global.utils.getStreamFromURL(image)
    }, threadID, messageID);

  } catch (e) {
    return api.sendMessage("❌ API error", threadID, messageID);
  }
};
