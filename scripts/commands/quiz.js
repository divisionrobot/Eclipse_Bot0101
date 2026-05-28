const axios = require("axios");

module.exports.config = {
  name: "quiz",
  version: "3.0.0",
  permission: 0,
  credits: "R.I Fixed Version",
  description: "Working quiz game (fixed API)",
  prefix: false,
  category: "game",
  usages: "quiz",
  cooldowns: 5
};

const timeoutDuration = 30 * 1000;

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, messageID } = event;

  try {
    // ✅ Stable API (Open Trivia DB)
    const res = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const data = res.data.results[0];

    const question = data.question;
    const correct = data.correct_answer;
    const incorrect = data.incorrect_answers;

    // shuffle options
    const options = [...incorrect, correct].sort(() => Math.random() - 0.5);

    const correctIndex = options.indexOf(correct);

    let msg =
      `🧠 QUIZ TIME!\n\n` +
      `❓ ${question}\n\n`;

    options.forEach((opt, i) => {
      msg += `${i}. ${opt}\n`;
    });

    msg += `\n⏳ 30 seconds! Reply 0-3`;

    return api.sendMessage(msg, threadID, (err, info) => {
      const timeout = setTimeout(() => {
        api.unsendMessage(info.messageID);
        api.sendMessage(
          `⏰ Time over!\n✅ Correct Answer: ${correct}`,
          threadID
        );
      }, timeoutDuration);

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        answer: correctIndex,
        correctAnswer: correct,
        timeout
      });
    });

  } catch (e) {
    console.log(e);
    return api.sendMessage(
      "❌ Quiz load failed! Try again later.",
      threadID,
      messageID
    );
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, senderID, body, messageID } = event;

  if (senderID !== handleReply.author) return;

  const userAnswer = parseInt(body.trim());

  if (isNaN(userAnswer)) {
    return api.sendMessage(
      "⚠️ 0-3 এর মধ্যে উত্তর দাও!",
      threadID,
      messageID
    );
  }

  clearTimeout(handleReply.timeout);

  api.unsendMessage(handleReply.messageID);

  if (userAnswer === handleReply.answer) {
    return api.sendMessage(
      "✅ Correct Answer! 🎉",
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(
      `❌ Wrong!\n✔️ Correct: ${handleReply.correctAnswer}`,
      threadID,
      messageID
    );
  }
};
