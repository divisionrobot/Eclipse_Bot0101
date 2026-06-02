const axios = require("axios");

const API_URL = "https://bby-api-1tha.onrender.com";
const ADMIN_ID = "61584553674661";

module.exports.config = {
  name: "bby",
  version: "3.0.0",
  permission: 0,
  prefix: false,
  credits: "IMRAN",
  description: "Teach + Chat bot (API)",
  category: "ai"
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ").trim();

  // =====================
  // RANDOM REPLY
  // =====================
  if (!input) {
    const replies = [
      "হ্যাঁ জানু 😘",
      "বলো বাবু 💖",
      "শুনছি জান 🥰",
      "কি হইছে? 😏"
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(reply, threadID, messageID);
  }

  // =====================
  // TEACH
  // =====================
  if (args[0] === "teach") {
    const text = input.replace("teach", "").trim();
    const [ask, ans] = text.split("=").map(s => s.trim());

    if (!ask || !ans) {
      return api.sendMessage("❌ Format: bby teach hi = hello", threadID, messageID);
    }

    try {
      await axios.post(`${API_URL}/teach`, { ask, ans });

      return api.sendMessage(
        `✅ শেখানো হয়েছে:\n${ask} = ${ans}`,
        threadID,
        messageID
      );
    } catch (e) {
      return api.sendMessage("❌ API error (teach)", threadID, messageID);
    }
  }

  // =====================
  // DELETE (ADMIN ONLY)
  // =====================
  if (args[0] === "teachdel") {
    if (senderID !== ADMIN_ID) {
      return api.sendMessage("❌ Only admin can use this", threadID, messageID);
    }

    const key = input.replace("teachdel", "").trim();

    try {
      await axios.post(`${API_URL}/delete`, { key });

      return api.sendMessage(`🗑️ Deleted: ${key}`, threadID, messageID);
    } catch (e) {
      return api.sendMessage("❌ API error (delete)", threadID, messageID);
    }
  }

  // =====================
  // CHAT
  // =====================
  try {
    const res = await axios.get(
      `${API_URL}/chat?text=${encodeURIComponent(input)}`
    );

    return api.sendMessage(res.data.reply, threadID, messageID);

  } catch (e) {
    return api.sendMessage("❌ API not working", threadID, messageID);
  }
};
