const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

module.exports = (client) => {
  const SHOP_CHANNEL_ID = "1505281157753995314";

  const SHOP_IMAGE =
    "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png?ex=6a0e1f01&is=6a0ccd81&hm=292bc36dfc205c337ad8ce9fa4c214c677b6839f8779918bd699f2f12e044962&";

  // =========================================
  // STARTUP PANEL
  // =========================================
  client.once(Events.ClientReady, async () => {
    console.log("✅ Professional Shop System Loaded");

    try {
      const channel = await client.channels.fetch(SHOP_CHANNEL_ID);
      if (!channel) return console.log("❌ Shop channel not found");

      const messages = await channel.messages.fetch({ limit: 20 });
      const botMessages = messages.filter(
        (m) => m.author.id === client.user.id && m.embeds.length > 0
      );

      if (botMessages.size > 0) {
        await channel.bulkDelete(botMessages, true).catch(() => {});
      }

      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🚀 ZYN HUB SERVICES")
        .setDescription(`
## Premium Gaming & Discord Services

╭・📦 **AVAILABLE SERVICES**
┆ 🤖 Discord Custom Bots
┆ 🦖 ARK Discord Systems
┆ ⛏️ Minecraft Systems
┆ 🖥️ Bot Hosting
┆ 🛡️ Advanced Systems
╰────────────

╭・🛒 **ORDER INFORMATION**
┆ Open a ticket to order
┆ Tell us what you want
┆ Fast delivery & setup
╰────────────

> Select a category below to continue
        `)
        .setImage(SHOP_IMAGE)
        .setTimestamp();

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("custom_bots")
          .setLabel("Discord Bots")
          .setEmoji("🤖")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("ark_bots")
          .setLabel("ARK Systems")
          .setEmoji("🦖")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("minecraft_bots")
          .setLabel("Minecraft")
          .setEmoji("⛏️")
          .setStyle(ButtonStyle.Secondary)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("hosting")
          .setLabel("Bot Hosting")
          .setEmoji("🖥️")
          .setStyle(ButtonStyle.Primary),

        // 🔥 NEW SYSTEMS BUTTON
        new ButtonBuilder()
          .setCustomId("systems")
          .setLabel("Systems")
          .setEmoji("🛡️")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("order_now")
          .setLabel("Order")
          .setEmoji("🛒")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        embeds: [embed],
        components: [row1, row2],
      });

      console.log("✅ Shop panel sent");
    } catch (err) {
      console.log("❌ Shop error:", err);
    }
  });

  // =========================================
  // BUTTON SYSTEM
  // =========================================
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // =========================================
    // SYSTEMS CATEGORY (NEW)
    // =========================================
    if (interaction.customId === "systems") {
      const embed = new EmbedBuilder()
        .setColor("#ff4fd8")
        .setTitle("🛡️ ADVANCED SYSTEMS")
        .setDescription(`
## Security & Server Systems

╭・🛡️ **SECURITY SYSTEM**
┆ Anti-raid protection
┆ Anti-nuke protection
┆ Auto moderation
┆ Join verification

╭・⏳ **WIPE SYSTEMS**
┆ Normal Wipe Countdown
┆ Pro Wipe System (live updates + embeds)

╭・📊 **SERVER STATS**
┆ Online members counter
┆ Boost tracker
┆ Channel stats
┆ Game server status

⚠️ Reminder: All systems are examples — we can build MUCH better versions.
        `)
        .setImage(SHOP_IMAGE);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("security_system")
          .setLabel("Security")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("wipe_systems")
          .setLabel("Wipe Systems")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("server_stats")
          .setLabel("Server Stats")
          .setStyle(ButtonStyle.Success)
      );

      return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    }

    // =========================================
    // SECURITY SYSTEM
    // =========================================
    if (interaction.customId === "security_system") {
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("🛡️ SECURITY SYSTEM")
        .setDescription(`
✔ Anti-Nuke Protection
✔ Anti-Raid System
✔ Auto Kick Suspicious Users
✔ Logging System
✔ Verification Gate

⚠️ Reminder: This is an example system — we can make it stronger & smarter.
        `)
        .setImage(SHOP_IMAGE);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // =========================================
    // WIPE SYSTEMS
    // =========================================
    if (interaction.customId === "wipe_systems") {
      const embed = new EmbedBuilder()
        .setColor("#ffaa00")
        .setTitle("⏳ WIPE SYSTEMS")
        .setDescription(`
✔ Normal Wipe Countdown
✔ Pro Wipe System (live updates)
✔ ARK integration support
✔ Auto announcements

⚠️ Reminder: Example system — can be fully customized.
        `)
        .setImage(SHOP_IMAGE);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // =========================================
    // SERVER STATS
    // =========================================
    if (interaction.customId === "server_stats") {
      const embed = new EmbedBuilder()
        .setColor("#00ffcc")
        .setTitle("📊 SERVER STATS SYSTEM")
        .setDescription(`
✔ Online Members Counter
✔ Boost Tracker
✔ Channel Statistics
✔ Game Server Status
✔ Live Updating Panel

⚠️ Reminder: We can connect this to real APIs for live data.
        `)
        .setImage(SHOP_IMAGE);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // =========================================
    // PLACEHOLDER HANDLERS (keep your old ones)
    // =========================================
    if (interaction.customId === "custom_bots") {
      return interaction.reply({ content: "Discord Bots section", ephemeral: true });
    }

    if (interaction.customId === "ark_bots") {
      return interaction.reply({ content: "ARK section", ephemeral: true });
    }

    if (interaction.customId === "minecraft_bots") {
      return interaction.reply({ content: "Minecraft section", ephemeral: true });
    }

    if (interaction.customId === "hosting") {
      return interaction.reply({ content: "Hosting section", ephemeral: true });
    }

    if (interaction.customId === "order_now") {
      return interaction.reply({
        content: "🛒 Open a ticket to place your order.",
        ephemeral: true,
      });
    }
  });
};
