const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

module.exports = (client) => {
  client.once(Events.ClientReady, async () => {
    console.log("✅ Professional Shop System Loaded");
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // ==========================
    // DISCORD BOTS
    // ==========================
    if (interaction.customId === "custom_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🤖 Premium Discord Bot Development")
        .setDescription(`
> **Professional custom Discord bots built for your community**

╭・💰 **Pricing**
┆ **Starting Price:** \`$10\`
┆ **Advanced Systems:** \`Up To $60\`
┆ **Hosting:** \`$5 - $10/month\`
╰────────────

╭・✨ **Included Features**
┆ ✅ Welcome System
┆ ✅ Auto Moderation
┆ ✅ Tickets & Logs
┆ ✅ Verification System
┆ ✅ Security Features
┆ ✅ Custom Commands
┆ ✅ Leveling Systems
┆ ✅ Fully Custom Development
╰────────────

> ⚡ Fast Delivery  
> 🛡️ Trusted Service  
> 🎁 Free Setup Included
        `)
        .setFooter({
          text: "Open a ticket to place your order",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // ==========================
    // ARK SYSTEMS
    // ==========================
    if (interaction.customId === "ark_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🦖 Premium ARK Discord Systems")
        .setDescription(`
> **Professional ARK integrations for your Discord server**

╭・💰 **Pricing**
┆ **Starting Price:** \`$15\`
┆ **Advanced Systems:** \`Up To $50\`
╰────────────

╭・🛠️ **Available Systems**
┆ ✅ Player Counter
┆ ✅ Server Status
┆ ✅ Verification Bot
┆ ✅ Wipe Countdown
┆ ✅ Logs System
┆ ✅ Crosschat
┆ ✅ Advanced Systems
┆ ✅ Full Setup Included
╰────────────

> ⚡ Fast Delivery  
> 🛡️ Trusted Service  
> 🎯 Optimized Systems
        `)
        .setFooter({
          text: "Open a ticket to place your order",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // ==========================
    // MINECRAFT
    // ==========================
    if (interaction.customId === "minecraft_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("⛏️ Premium Minecraft Discord Systems")
        .setDescription(`
> **Professional Minecraft integrations & custom systems**

╭・💰 **Pricing**
┆ **Starting Price:** \`$5\`
┆ **Advanced Systems:** \`Up To $30\`
╰────────────

╭・⚙️ **Available Systems**
┆ ✅ Server Status
┆ ✅ Welcome System
┆ ✅ Moderation
┆ ✅ Auto Roles
┆ ✅ Commands
┆ ✅ Full Custom Systems
┆ ✅ Server Integration
╰────────────

> ⚡ Fast Delivery  
> 🛡️ Trusted Service  
> 💎 Affordable Pricing
        `)
        .setFooter({
          text: "Open a ticket to place your order",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // ==========================
    // DISCORD BOT HOSTING
    // ==========================
    if (interaction.customId === "hosting") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🖥️ Discord Bot Hosting")
        .setDescription(`
> **Reliable hosting made only for Discord bots**

╭・💰 **Hosting Plans**
┆ **Basic Hosting** → \`$5/month\`
┆ **Standard Hosting** → \`$7/month\`
┆ **Premium Hosting** → \`$12/month\`
╰────────────

╭・🚀 **Hosting Features**
┆ ✅ Stable Performance
┆ ✅ 24/7 Uptime
┆ ✅ Fast Response
┆ ✅ Reliable Hosting
┆ ✅ Discord Bots Only
╰────────────

> ⚡ Optimized Performance  
> 🛡️ Trusted Hosting
        `)
        .setFooter({
          text: "Open a ticket to place your order",
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    // ==========================
    // ORDER
    // ==========================
    if (interaction.customId === "order_now") {
      return interaction.reply({
        content:
          "🛒 **Ready to order? Open a ticket from the ticket panel and tell us what service you want.**",
        ephemeral: true,
      });
    }
  });

  // ==========================
  // !SHOP COMMAND
  // ==========================
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content === "!shop") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🚀 Zyn Hub Premium Services")
        .setDescription(`
> **Professional Custom Services**

╭・📦 **Available Services**
┆ 🤖 Discord Bot Development
┆ 🦖 ARK Discord Systems
┆ ⛏️ Minecraft Integrations
┆ 🖥️ Discord Bot Hosting
╰────────────

╭・✨ **Why Choose Us?**
┆ ⚡ Fast Delivery
┆ 🛡️ Trusted Service
┆ 💰 Affordable Pricing
┆ 🎁 Free Setup Included
╰────────────

> **Select a category below to view pricing & services**
        `)
        .setImage("https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png")
        .setFooter({
          text: "Zyn Hub • Premium Services",
        });

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
          .setLabel("Order Now")
          .setEmoji("🛒")
          .setStyle(ButtonStyle.Danger)
      );

      await message.channel.send({
        embeds: [embed],
        components: [row1, row2],
      });
    }
  });
};
