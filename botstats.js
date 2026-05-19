const {
  EmbedBuilder,
  ChannelType
} = require("discord.js");

module.exports = (client) => {

  // ================== CONFIG ==================

  const BOT_STATS_CHANNEL_ID = "1506322938956087430";

  let statsMessage;

  // ================== READY ==================

  client.once("ready", async () => {

    try {

      const channel = await client.channels.fetch(BOT_STATS_CHANNEL_ID).catch(() => null);

      if (!channel) {
        return console.log("❌ Bot stats channel not found.");
      }

      // Find old bot message
      const messages = await channel.messages.fetch({ limit: 10 }).catch(() => null);

      statsMessage = messages?.find(
        m => m.author.id === client.user.id
      );

      // Create if missing
      if (!statsMessage) {
        statsMessage = await channel.send("🤖 Loading bot stats...");
      }

      // Update instantly
      updateBotStats();

      // Auto update every 30 sec
      setInterval(updateBotStats, 30000);

      console.log("✅ Bot stats system loaded.");

    } catch (err) {

      console.log("BOT STATS READY ERROR:", err);
    }

  });

  // ================== FUNCTION ==================

  async function updateBotStats() {

    try {

      if (!statsMessage) return;

      const guild = statsMessage.guild;

      await guild.members.fetch().catch(() => {});

      // Find bots
      const bots = guild.members.cache.filter(
        m => m.user.bot
      );

      // Online bots
      const onlineBots = bots.filter(
        m =>
          m.presence &&
          ["online", "idle", "dnd"].includes(m.presence.status)
      );

      // Mention all bots
      const botMentions = bots.map(
        bot => `<@${bot.id}>`
      ).join("\n");

      const embed = new EmbedBuilder()
        .setColor("#a855f7")
        .setTitle("🤖 ACTIVE BOT NETWORK")
        .setDescription(`
🚀 Professional automation systems currently active inside this server.

━━━━━━━━━━━━━━

🤖 Total Bots: **${bots.size}**
🟢 Online Bots: **${onlineBots.size}**

━━━━━━━━━━━━━━

${botMentions || "No bots detected."}
        `)
        .setFooter({
          text: "Live bot monitoring system"
        })
        .setTimestamp();

      await statsMessage.edit({
        content: null,
        embeds: [embed]
      });

    } catch (err) {

      console.log("BOT STATS UPDATE ERROR:", err);
    }

  }

};
