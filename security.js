const { Events, PermissionsBitField } = require("discord.js");

// ================== MEMORY ==================

const userWarnings = new Map();
const userMessages = new Map();

// ================== CONFIG ==================

const OWNER_ROLE_ID = "1481850766049153267";

// ================== RULES ==================

const LINK_REGEX = /(https?:\/\/|discord\.gg|www\.)/i;

const BAD_WORDS = [

  // basic
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "dick",
  "piss",
  "motherfucker",
  "mf",
  "wtf",
  "slut",
  "whore",
  "retard",
  "stfu",
  "fucker",
  "bastard",

  // racism
  "nigger",
  "nigga",
  "kys",
  "fag",
  "faggot",
  "gayass",

  // bypasses
  "fucc",
  "fuk",
  "fu*k",
  "sh1t",
  "biatch",
  "btch",
  "ashole",
  "d1ck",

  // arabic bad words
  "كس",
  "كسمك",
  "كسم",
  "شرموطة",
  "خول",
  "متناك",
  "زب",
  "طيز",
  "حمار",
  "كلب",

  // toxic
  "idiot",
  "loser",
  "trash",
  "noob",
  "ez",
  "kill yourself",
  "dumbass",
  "clown",

  // discord toxicity
  "raid",
  "nuke",
  "crash server",
  "ddos"
];  

// ================== CLEANUP ==================

setInterval(() => {

  const now = Date.now();

  for (const [userId, timestamps] of userMessages.entries()) {

    const filtered = timestamps.filter(
      t => now - t < 5000
    );

    if (filtered.length === 0) {

      userMessages.delete(userId);

    } else {

      userMessages.set(userId, filtered);
    }
  }

}, 60000);

// ================== WARNING SYSTEM ==================

async function warnUser(message, userId, reason) {

  if (!userWarnings.has(userId)) {
    userWarnings.set(userId, 0);
  }

  let warns = userWarnings.get(userId) + 1;

  userWarnings.set(userId, warns);

  await message.channel.send(
    `⚠️ <@${userId}> Warning: **${reason}** (${warns}/3)`
  ).catch(() => {});

  const member = await message.guild.members.fetch(userId).catch(() => null);

  if (!member) return;

  if (warns >= 3) {

    try {

      await member.timeout(
        10 * 60 * 1000,
        "3 warnings reached"
      );

      userWarnings.set(userId, 0);

      await message.channel.send(
        `🔨 <@${userId}> timed out for 10 minutes`
      ).catch(() => {});

    } catch (err) {

      console.log("TIMEOUT ERROR:", err);
    }
  }
}

// ================== MAIN SYSTEM ==================

module.exports = (client) => {

  client.on(Events.MessageCreate, async (message) => {

    try {

      if (!message.guild) return;
      if (message.author.bot) return;

      const member = message.member;

      if (!member) return;

      // ================== IGNORE OWNER ROLE ==================

      if (member.roles.cache.has(OWNER_ROLE_ID)) return;

      // ================== IGNORE ADMINS ==================

      if (
        member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) return;

      // ================== IGNORE SERVER OWNER ==================

      if (message.guild.ownerId === member.id) return;

      const userId = message.author.id;

      const content = message.content.toLowerCase();

      const now = Date.now();

      // ================== ANTI LINK ==================

      if (LINK_REGEX.test(message.content)) {

        await message.delete().catch(() => {});

        return warnUser(
          message,
          userId,
          "Links are not allowed"
        );
      }

      // ================== ANTI BAD WORDS ==================

      if (
        BAD_WORDS.some(
          word => content.includes(word)
        )
      ) {

        await message.delete().catch(() => {});

        return warnUser(
          message,
          userId,
          "Bad words are not allowed"
        );
      }

      // ================== ANTI SPAM ==================

      if (!userMessages.has(userId)) {

        userMessages.set(userId, []);
      }

      const timestamps = userMessages.get(userId);

      timestamps.push(now);

      const recent = timestamps.filter(
        t => now - t < 5000
      );

      userMessages.set(userId, recent);

      if (recent.length > 5) {

        await message.delete().catch(() => {});

        return warnUser(
          message,
          userId,
          "Spamming detected"
        );
      }

    } catch (err) {

      console.log("SECURITY ERROR:", err);
    }

  });

};
