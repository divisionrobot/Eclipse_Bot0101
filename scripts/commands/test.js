module.exports.config = {
  name: "test",
  version: "1.0.0",
  permission: 0,
  credits: "you",
  description: "test",
  prefix: true
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage(
    "TEST WORKING ✅",
    event.threadID,
    event.messageID
  );
};
