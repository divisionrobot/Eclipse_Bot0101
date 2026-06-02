const axios = require("axios");

module.exports = {
	config: {
		name: "slap",
		version: "1.0",
		author: "Aether",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Slap someone"
		},
		longDescription: {
			en: "Anime slap GIF"
		},
		category: "fun",
		guide: {
			en: "{pn} @mention/reply"
		}
	},

	onStart: async function ({ api, event }) {
		const { threadID, messageID, mentions, messageReply } = event;

		let targetID;
		let targetName = "Someone";

		const mentionIDs = Object.keys(mentions || {});

		if (mentionIDs.length > 0) {
			targetID = mentionIDs[0];
			targetName = mentions[targetID].replace("@", "");
		}
		else if (messageReply) {
			targetID = messageReply.senderID;
			targetName = "এই ব্যক্তি";
		}

		if (!targetID) {
			return api.sendMessage(
				"❌ | কাউকে mention বা reply করো 😏",
				threadID,
				messageID
			);
		}

		try {
			const res = await axios.get(
				"https://api.waifu.pics/sfw/slap"
			);

			const imageUrl = res.data.url;

			const img = await axios.get(imageUrl, {
				responseType: "stream"
			});

			api.sendMessage(
				{
					body: `🤜 | ${targetName} কে জোরে একটা slap মারা হলো!`,
					attachment: img.data
				},
				threadID,
				messageID
			);

		} catch (err) {
			console.error(err);

			api.sendMessage(
				"❌ | Slap API থেকে ছবি আনা যায়নি!",
				threadID,
				messageID
			);
		}
	}
};
