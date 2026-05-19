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

      // ================== FIND OLD MESSAGE ==================

      const messages = await channel.messages.fetch({ limit: 20 }).catch(() => null);

      statsMessage = messages?.find(
        m =>
          m.author.id === client.user.id &&
          m.embeds.length
      );

      // ================== CREATE IF MISSING ==================

      if (!statsMessage) {

        statsMessage = await channel.send({
          content: "🤖 Initializing enterprise bot monitoring system..."
        });
      }

      // ================== FIRST UPDATE ==================

      await updateBotStats();

      // ================== AUTO UPDATE ==================

      setInterval(updateBotStats, 30000);

      console.log("✅ Enterprise bot monitor loaded.");

    } catch (err) {

      console.log("BOT MONITOR READY ERROR:", err);
    }

  });

  // ================== UPDATE FUNCTION ==================

  async function updateBotStats() {

    try {

      if (!statsMessage) return;

      const guild = statsMessage.guild;

      await guild.members.fetch().catch(() => {});

      // ================== GET BOTS ==================

      const bots = guild.members.cache.filter(
        member => member.user.bot
      );

      // ================== ONLINE BOTS ==================

      const onlineBots = bots.filter(
        member =>
          member.presence &&
          ["online", "idle", "dnd"].includes(member.presence.status)
      );

      // ================== OFFLINE BOTS ==================

      const offlineBots = bots.filter(
        member =>
          !member.presence ||
          member.presence.status === "offline"
      );

      // ================== BOT LIST ==================

      const onlineList = onlineBots.map(
        bot => `🟢 <@${bot.id}>`
      ).join("\n");

      const offlineList = offlineBots.map(
        bot => `⚫ <@${bot.id}>`
      ).join("\n");

      // ================== EMBED ==================

      const embed = new EmbedBuilder()

        .setColor("#6d28d9")

        .setTitle("🤖 ZYN ENTERPRISE BOT NETWORK")

        .setDescription(`
🚀 Advanced automation infrastructure currently deployed inside this server.

━━━━━━━━━━━━━━━━━━

📡 **SYSTEM OVERVIEW**

🤖 Total Active Bots: **${bots.size}**
🟢 Online Systems: **${onlineBots.size}**
⚫ Offline Systems: **${offlineBots.size}**

━━━━━━━━━━━━━━━━━━

🟢 **ONLINE SYSTEMS**

${onlineList || "No online systems detected."}

━━━━━━━━━━━━━━━━━━

⚫ **OFFLINE SYSTEMS**

${offlineList || "No offline systems detected."}

━━━━━━━━━━━━━━━━━━

🛡️ Real-time automated infrastructure monitoring enabled.
        `)

        .setFooter({
          text: `${guild.name} • Enterprise Monitoring Suite`
        })

        .setTimestamp();

      // ================== EDIT MESSAGE ==================

      await statsMessage.edit({
        content: null,
        embeds: [embed]
      });

    } catch (err) {

      console.log("BOT MONITOR UPDATE ERROR:", err);
    }

  }

};
