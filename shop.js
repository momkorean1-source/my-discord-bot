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
  // SEND PANEL AUTOMATICALLY ON STARTUP
  // =========================================
  client.once(Events.ClientReady, async () => {
    console.log("✅ Professional Shop System Loaded");

    try {
      const channel = await client.channels.fetch(SHOP_CHANNEL_ID);
      if (!channel) return console.log("❌ Shop channel not found");

      // Delete old bot panels
      const messages = await channel.messages.fetch({ limit: 20 });
      const botMessages = messages.filter(
        (m) =>
          m.author.id === client.user.id &&
          m.embeds.length > 0
      );

      if (botMessages.size > 0) {
        await channel.bulkDelete(botMessages, true).catch(() => {});
      }

      // Main Panel
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🚀 ZYN HUB SERVICES")
        .setDescription(`
## Premium Gaming & Discord Services

╭・📦 **AVAILABLE SERVICES**

┆ 🤖 **Discord Custom Bots**

┆ 🦖 **ARK Discord Systems**

┆ ⛏️ **Minecraft Systems**

┆ 🖥️ **Discord Bot Hosting**
╰────────────

╭・🛒 **ORDER INFORMATION**

┆ Open a ticket to order

┆ Tell us what service you want

┆ Fast delivery & setup
╰────────────

> **Select a category below to view pricing & services**
        `)
        .setImage(SHOP_IMAGE)
        .setThumbnail(client.guilds.cache.first()?.iconURL({ dynamic: true }))
        .setFooter({
          text: "Zyn Hub • Premium Services",
        })
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

      console.log("✅ Shop panel sent automatically");
    } catch (err) {
      console.log("❌ Shop panel error:", err);
    }
  });

  // =========================================
  // BUTTON INTERACTIONS
  // =========================================
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // =========================================
    // DISCORD BOTS
    // =========================================
    if (interaction.customId === "custom_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🤖 DISCORD CUSTOM BOTS")
        .setDescription(`
## Custom Discord Development

╭・💰 **PRICING**

┆ Starting Price → \`$10\`

┆ Advanced Systems → \`Up To $60\`

┆ Hosting → \`$5 - $10/month\`
╰────────────

╭・⚙️ **FEATURES**

┆ ✅ Welcome System

┆ ✅ Auto Moderation

┆ ✅ Ticket System

┆ ✅ Logs & Security

┆ ✅ Verification

┆ ✅ Custom Commands

┆ ✅ Leveling Systems

┆ ✅ Fully Custom Bots
╰────────────

> Open a ticket to place your order
        `)
        .setImage(SHOP_IMAGE)
        .setFooter({
          text: "Zyn Hub • Discord Services",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // =========================================
    // ARK
    // =========================================
    if (interaction.customId === "ark_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🦖 ARK DISCORD SYSTEMS")
        .setDescription(`
## Professional ARK Systems

╭・💰 **PRICING**

┆ Starting Price → \`$15\`

┆ Advanced Systems → \`Up To $50\`
╰────────────

╭・⚙️ **SYSTEMS**

┆ ✅ Player Counter

┆ ✅ Server Status

┆ ✅ Verification Bot

┆ ✅ Wipe Countdown

┆ ✅ Logs System

┆ ✅ Crosschat

┆ ✅ Advanced Systems

┆ ✅ Full Setup
╰────────────

> Open a ticket to place your order
        `)
        .setImage(SHOP_IMAGE)
        .setFooter({
          text: "Zyn Hub • ARK Services",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // =========================================
    // MINECRAFT
    // =========================================
    if (interaction.customId === "minecraft_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("⛏️ MINECRAFT SYSTEMS")
        .setDescription(`
## Professional Minecraft Systems

╭・💰 **PRICING**

┆ Starting Price → \`$10\`

┆ Advanced Systems → \`Up To $30\`
╰────────────

╭・⚙️ **FEATURES**

┆ ✅ Server Status

┆ ✅ Welcome System

┆ ✅ Moderation

┆ ✅ Auto Roles

┆ ✅ Commands

┆ ✅ Full Custom Systems

┆ ✅ Server Integration
╰────────────

> Open a ticket to place your order
        `)
        .setImage(SHOP_IMAGE)
        .setFooter({
          text: "Zyn Hub • Minecraft Services",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // =========================================
    // HOSTING
    // =========================================
    if (interaction.customId === "hosting") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🖥️ DISCORD BOT HOSTING")
        .setDescription(`
## Reliable Bot Hosting

╭・💰 **PLANS**

┆ Basic → \`$5/month\`

┆ Standard → \`$7/month\`

┆ Premium → \`$12/month\`
╰────────────

╭・🚀 **INCLUDED**

┆ ✅ Stable Hosting

┆ ✅ Fast Performance

┆ ✅ Reliable Uptime

┆ ✅ Discord Bots Only
╰────────────

> Open a ticket to place your order
        `)
        .setImage(SHOP_IMAGE)
        .setFooter({
          text: "Zyn Hub • Hosting",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // =========================================
    // ORDER BUTTON
    // =========================================
    if (interaction.customId === "order_now") {
      return interaction.reply({
        content:
          "🛒 **Open a ticket from the ticket panel and tell us what service you want.**",
        ephemeral: true,
      });
    }
  });
};
