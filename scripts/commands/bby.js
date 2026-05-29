const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "bby-teach.json");

// load data
function load() {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file));
}

// save data
function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "bby",
  version: "1.0.0",
  permission: 0,
  prefix: false,
  credits: "IMRAN",
  description: "Teach + chat bot with memory",
  category: "ai"
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  let data = load();
  const input = args.join(" ");

  // -------------------------
  // bby ONLY REPLY
  // -------------------------
  if (!args[0]) {
    const replies = [
      "হ্যাঁ জানু 😘",
      "বলো বাবু 💖",
      "শুনছি জান 🥰",
      "কি হইছে বলো তো? 😏"
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];
    return api.sendMessage(reply, threadID, messageID);
  }

  // -------------------------
  // TEACH ADD
  // -------------------------
  if (args[0] === "teach") {
    const text = input.replace("teach", "").trim();
    const [ask, ans] = text.split("=").map(s => s.trim().toLowerCase());

    if (!ask || !ans) {
      return api.sendMessage("❌ Format: bby teach hi = hello", threadID, messageID);
    }

    if (!data[ask]) data[ask] = [];

    data[ask].push(ans);
    save(data);

    return api.sendMessage(`✅ Saved:\n${ask} = ${ans}`, threadID, messageID);
  }

  // -------------------------
  // DELETE SPECIFIC ANSWER
  // -------------------------
  if (args[0] === "teachdel") {
    const text = input.replace("teachdel", "").trim();
    const [key, value] = text.split("=").map(s => s.trim().toLowerCase());

    if (!data[key]) {
      return api.sendMessage("❌ এই teach নাই", threadID, messageID);
    }

    const index = data[key].indexOf(value);

    if (index === -1) {
      return api.sendMessage("❌ এই answer পাওয়া যায় নাই", threadID, messageID);
    }

    data[key].splice(index, 1);

    if (data[key].length === 0) {
      delete data[key];
    }

    save(data);

    return api.sendMessage(`🗑️ Deleted: ${value}`, threadID, messageID);
  }

  // -------------------------
  // LIST ALL TEACH
  // -------------------------
  if (args[0] === "teachlist") {
    let msg = "📚 Teach List:\n\n";

    for (let key in data) {
      msg += `${key}:\n`;
      data[key].forEach((v, i) => {
        msg += `  ${i + 1}. ${v}\n`;
      });
      msg += `\n`;
    }

    return api.sendMessage(msg || "No data found", threadID, messageID);
  }

  // -------------------------
  // NORMAL CHAT
  // -------------------------
  const key = input.toLowerCase();

  if (data[key]) {
    const replies = data[key];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    return api.sendMessage(reply, threadID, messageID);
  }

  return api.sendMessage("🤖 কিছু শেখাও আগে!", threadID, messageID);
};
