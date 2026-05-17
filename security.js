const { Events } = require("discord.js");

// ================== MEMORY ==================

const userWarnings = new Map();
const userMessages = new Map();

// ================== RULES ==================

const LINK_REGEX = /(https?:\/\/|discord\.gg|www\.)/i;

const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "dick",
  "piss",
  "nigger",
  "nigga"
];

// cleanup old spam memory every 60 sec (IMPORTANT FIX)
setInterval(() => {
  const now = Date.now();

  for (const [userId, timestamps] of userMessages.entries()) {
    const filtered = timestamps.filter(t => now - t < 5000);

    if (filtered.length === 0) {
      userMessages.delete(userId);
    } else {
      userMessages.set(userId, filtered);
    }
  }
}, 60000);

// ================== WARNING SYSTEM ==================

async function warnUser(message, userId, reason) {
  if (!userWarnings.has(userId)) userWarnings.set(userId, 0);

  let warns = userWarnings.get(userId) + 1;
  userWarnings.set(userId, warns);

  message.channel.send(
    `⚠️ <@${userId}> Warning: **${reason}** (${warns}/3)`
  );

  const member = await message.guild.members.fetch(userId).catch(() => null);
  if (!member) return;

  if (warns >= 3) {
    try {
      await member.timeout(10 * 60 * 1000, "3 warnings reached");
      userWarnings.set(userId, 0);

      message.channel.send(
        `🔨 <@${userId}> timed out for 10 minutes`
      );
    } catch (err) {
      console.log("TIMEOUT ERROR:", err);
    }
  }
}

// ================== MAIN SYSTEM ==================

module.exports = (client) => {
  client.on(Events.MessageCreate, async (message) => {
    try {
      if (!message.guild || message.author.bot) return;

      const userId = message.author.id;
      const content = message.content.toLowerCase();
      const now = Date.now();

      // ================== ANTI LINK ==================

      if (LINK_REGEX.test(message.content)) {
        await message.delete().catch(() => {});
        return warnUser(message, userId, "Links are not allowed");
      }

      // ================== ANTI BAD WORDS ==================

      if (BAD_WORDS.some(word => content.includes(word))) {
        await message.delete().catch(() => {});
        return warnUser(message, userId, "Bad words are not allowed");
      }

      // ================== ANTI SPAM ==================

      if (!userMessages.has(userId)) {
        userMessages.set(userId, []);
      }

      const timestamps = userMessages.get(userId);

      timestamps.push(now);

      const recent = timestamps.filter(t => now - t < 5000);

      userMessages.set(userId, recent);

      if (recent.length > 5) {
        await message.delete().catch(() => {});
        return warnUser(message, userId, "Spamming detected");
      }

    } catch (err) {
      console.log("SECURITY ERROR:", err);
    }
  });
};
