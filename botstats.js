const {
  EmbedBuilder
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
          content: "🤖 Initializing enterprise bot service panel..."
        });

      }

      // ================== FIRST UPDATE ==================

      await updateBotStats();

      // ================== AUTO UPDATE ==================

      setInterval(updateBotStats, 30000);

      console.log("✅ Enterprise bot service monitor loaded.");

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

      // REMOVE THIS BOT FROM THE LIST
      const bots = guild.members.cache.filter(
        member =>
          member.user.bot &&
          member.id !== client.user.id
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

      // ================== FORMAT BOT NAMES ==================

      const onlineList = onlineBots.map(bot => {
        return `🟢 ${bot.user.username}`;
      }).join("\n");

      const offlineList = offlineBots.map(bot => {
        return `⚫ ${bot.user.username}`;
      }).join("\n");

      // ================== EMBED ==================

      const embed = new EmbedBuilder()

        .setColor("#6d28d9")

        .setTitle("🤖 ZYN CUSTOM BOT SERVICES")

        .setDescription(`
🚀 Premium Discord bot solutions currently active inside this server.

━━━━━━━━━━━━━━━━━━

📡 **SERVICE OVERVIEW**

🤖 Total Client Bots: **${bots.size}**
🟢 Online Services: **${onlineBots.size}**
⚫ Offline Services: **${offlineBots.size}**

━━━━━━━━━━━━━━━━━━

🛠️ **BOTS WE ARE SERVICING**

${onlineList || "No active client bots detected."}

━━━━━━━━━━━━━━━━━━

⚫ **OFFLINE CLIENT BOTS**

${offlineList || "No offline systems detected."}

━━━━━━━━━━━━━━━━━━

💼 Custom Discord bot development, automation systems, API integrations, dashboards, moderation tools, economy systems, AI bots & advanced infrastructure.

🛡️ Real-time automated monitoring enabled.
        `)

        .setFooter({
          text: `${guild.name} • ZYN Enterprise Services`
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
