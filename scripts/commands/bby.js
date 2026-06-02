const axios = require("axios");

const ADMIN_ID = "61584553674661";

module.exports.config = {
  name: "bby",
  version: "3.0.0",
  permission: 0,
  prefix: false,
  credits: "IMRAN + API VERSION",
  description: "Teach + Chat bot (API based)",
  category: "ai"
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ").trim();

  // =====================
  // 1. RANDOM "bby"
  // =====================
  if (!input) {
    const replies = [
      "হ্যাঁ জানু 😘",
      "বলো বাবু 💖",
      "শুনছি জান 🥰",
      "কি হইছে বলো তো? 😏"
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(reply, threadID, messageID);
  }

  // =====================
  // 2. TEACH
  // =====================
  if (args[0] === "teach") {
    const text = input.replace("teach", "").trim();
    const [ask, ans] = text.split("=").map(s => s.trim());

    if (!ask || !ans) {
      return api.sendMessage("❌ Format: bby teach hi = hello", threadID, messageID);
    }

    try {
      await axios.post("https://bby-api-1tha.onrender.com/teach", {
        ask,
        ans
      });

      return api.sendMessage(`✅ শেখানো হয়ে গেছে:\n${ask} = ${ans}`, threadID, messageID);

    } catch (e) {
      return api.sendMessage("❌ API error!", threadID, messageID);
    }
  }

  // =====================
  // 3. DELETE (ADMIN ONLY)
  // =====================
  if (args[0] === "teachdel") {

    if (senderID !== ADMIN_ID) {
      return api.sendMessage("❌ Only admin can use this", threadID, messageID);
    }

    const text = input.replace("teachdel", "").trim();
    const [key] = text.split("=").map(s => s.trim());

    try {
      await axios.post("https://bby-api-1tha.onrender.com/delete", {
        key
      });

      return api.sendMessage(`🗑️ Deleted: ${key}`, threadID, messageID);

    } catch (e) {
      return api.sendMessage("❌ API error!", threadID, messageID);
    }
  }

  // =====================
  // 4. CHAT
  // =====================
  try {
    const res = await axios.get(
      `https://bby-api-1tha.onrender.com/chat?text=${encodeURIComponent(input)}`
    );

    return api.sendMessage(res.data.reply, threadID, messageID);

  } catch (e) {
    return api.sendMessage("❌ API কাজ করছে না", threadID, messageID);
  }
};
