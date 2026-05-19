const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

module.exports = (client) => {

  client.once(Events.ClientReady, async () => {
    console.log("✅ Shop system loaded.");
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // ==========================
    // CUSTOM DISCORD BOTS
    // ==========================
    if (interaction.customId === "custom_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🤖 Custom Discord Bots")
        .setDescription(`
## 💰 Cheap Prices

**Basic — $5**
• Welcome System  
• Auto Moderation  
• Basic Commands  

**Standard — $10**
• Tickets  
• Logs  
• Verification  
• Moderation  

**Premium — $15**
• Custom Commands  
• Security System  
• Leveling  
• Custom Setup  

**Ultimate — $25+**
• Fully Custom Bot  
• Everything Included  
• Fast Support

✅ Trusted Service  
✅ Fast Delivery  
✅ Free Setup
        `)
        .setFooter({
          text: "Open a ticket to order"
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    // ==========================
    // ARK DISCORD BOTS
    // ==========================
    if (interaction.customId === "ark_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🦖 ARK Discord Bots")
        .setDescription(`
## 💰 Cheap Prices

**Basic — $4**
• Player Counter  
• Server Status  

**Standard — $8**
• Verification Bot  
• Wipe Countdown  
• Logs  

**Premium — $12**
• Crosschat  
• Advanced Systems  
• Full Setup

✅ Trusted Service  
✅ Fast Delivery  
✅ Affordable Prices
        `)
        .setFooter({
          text: "Open a ticket to order"
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    // ==========================
    // MINECRAFT BOTS
    // ==========================
    if (interaction.customId === "minecraft_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("⛏️ Minecraft Custom Bots")
        .setDescription(`
## 💰 Cheap Prices

**Basic — $4**
• Server Status  
• Welcome System  

**Standard — $8**
• Moderation  
• Auto Roles  
• Commands  

**Premium — $12**
• Full Custom Bot  
• Server Integration

✅ Trusted Service  
✅ Fast Delivery  
✅ Cheap Pricing
        `)
        .setFooter({
          text: "Open a ticket to order"
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    // ==========================
    // HOSTING
    // ==========================
    if (interaction.customId === "hosting") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🖥️ Hosting Plans")
        .setDescription(`
## 💰 Hosting Prices

**Basic Hosting — $3/month**
• Good Performance  
• Stable Hosting  

**Standard Hosting — $7/month**
• Better Performance  
• Fast Support  

**Premium Hosting — $12/month**
• Best Performance  
• Priority Support

✅ Trusted Hosting  
✅ Stable Performance
        `)
        .setFooter({
          text: "Open a ticket to order"
        });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    // ==========================
    // ORDER BUTTON
    // ==========================
    if (interaction.customId === "order_now") {
      return interaction.reply({
        content:
          "🛒 **To order, please open a ticket in the ticket panel and tell us what service you want.**",
        ephemeral: true,
      });
    }
  });

  // ==========================
  // SEND SHOP PANEL COMMAND
  // ==========================
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content === "!shop") {

      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🛍️ Professional Bot Shop")
        .setDescription(`
Welcome to our **Professional Services Shop**

🔥 High Quality Services  
💰 Cheap Prices  
⚡ Fast Delivery  
✅ Trusted Service  

Choose a category below:
        `)
        .setImage("https://i.imgur.com/V9N2K9T.png")
        .setFooter({
          text: "Trusted • Fast • Cheap"
        });

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("custom_bots")
          .setLabel("Custom Bots")
          .setEmoji("🤖")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("ark_bots")
          .setLabel("ARK Bots")
          .setEmoji("🦖")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("minecraft_bots")
          .setLabel("Minecraft Bots")
          .setEmoji("⛏️")
          .setStyle(ButtonStyle.Secondary)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("hosting")
          .setLabel("Hosting")
          .setEmoji("🖥️")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("order_now")
          .setLabel("Order Now")
          .setEmoji("🛒")
          .setStyle(ButtonStyle.Danger)
      );

      message.channel.send({
        embeds: [embed],
        components: [row1, row2]
      });
    }
  });
};
