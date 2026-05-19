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

** 10$-60$ [ hosting 5$-10$/monthly ]**
• Welcome System  
• Auto Moderation  
• Basic Commands  
• Tickets  
• Logs  
• Verification  
• Moderation  
• Custom Commands  
• Security System  
• Leveling  
• Custom Setup  
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

**15$ - 50$ [ hosting 5$-15$/monthly ]**
• Player Counter  
• Server Status  
• Verification Bot  
• Wipe Countdown  
• Logs  
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

**5$-30$ [ hosting 5$-15$/monthly ]**
• Server Status  
• Welcome System  
• Moderation  
• Auto Roles  
• Commands  
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

**Basic Hosting — $5/month**
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
        .setImage("https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png?ex=6a0e1f01&is=6a0ccd81&hm=292bc36dfc205c337ad8ce9fa4c214c677b6839f8779918bd699f2f12e044962&")
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
