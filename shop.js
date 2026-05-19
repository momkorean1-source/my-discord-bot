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
    "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png";

  // =========================
  // SERVICE PREVIEW DATA
  // =========================
  const services = {
    normal_welcomer: {
      title: "👋 Normal Welcomer",
      id: "1506405315543826512",
      media: SHOP_IMAGE,
      desc: "Basic welcome system for your server.",
    },
    pro_welcomer: {
      title: "🔥 PRO Welcomer",
      id: "1506405499770507387",
      media: SHOP_IMAGE,
      desc: "Advanced welcome system with customization.",
    },
    custom_commands: {
      title: "⚙️ Custom Commands",
      id: "1506406025597681907",
      media: SHOP_IMAGE,
      desc: "Custom bot commands made for your server.",
    },
    pro_wipe: {
      title: "💥 PRO Wipe Countdown",
      id: "1501981686353891500",
      media: SHOP_IMAGE,
      desc: "Advanced wipe countdown system with full setup.",
    },
    normal_wipe: {
      title: "⏳ Normal Wipe Countdown",
      id: "1502434930733486200",
      media: SHOP_IMAGE,
      desc: "Simple wipe countdown system.",
    },
    dm_welcomer: {
      title: "📩 DM Welcomer",
      id: "1505541405874061332",
      media: SHOP_IMAGE,
      desc: "Sends welcome message in DMs automatically.",
    },
    security: {
      title: "🛡️ Security System",
      id: "1505525021139931176",
      media: SHOP_IMAGE,
      desc: "Anti-raid & server protection system.",
    },
    ca_leaderboard: {
      title: "🏆 CA Leaderboard System",
      id: "1505247151071035522",
      media: SHOP_IMAGE,
      desc: "Tribe system with stats, credits & ranking.",
    },
  };

  // =========================
  // START PANEL
  // =========================
  client.once(Events.ClientReady, async () => {
    console.log("✅ Shop System Loaded");

    const channel = await client.channels.fetch(SHOP_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor("#8b5cf6")
      .setTitle("🚀 ZYN HUB SHOP")
      .setDescription(`
Select a category below to view services.

⚠️ **Reminder: These are examples. We can do better if you ask for it.**
      `)
      .setImage(SHOP_IMAGE);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("main_bots")
        .setLabel("Main Bots")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("discord_bots")
        .setLabel("Discord Bots")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("hosting")
        .setLabel("Hosting")
        .setStyle(ButtonStyle.Secondary)
    );

    await channel.send({ embeds: [embed], components: [row] });
  });

  // =========================
  // BUTTON HANDLER
  // =========================
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // =========================
    // MAIN BOTS CATEGORY
    // =========================
    if (interaction.customId === "main_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🤖 MAIN BOT SYSTEMS")
        .setDescription(`
1 Bot that has multiple tools
✔ Good for less hosting
✔ Cheap & efficient
✔ All-in-one system

⚠️ Reminder: These are examples. We can build better if you ask for it.
        `)
        .setImage(SHOP_IMAGE);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("normal_welcomer")
          .setLabel("Normal Welcomer")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("pro_welcomer")
          .setLabel("PRO Welcomer")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("custom_commands")
          .setLabel("Custom Commands")
          .setStyle(ButtonStyle.Secondary)
      );

      return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    // =========================
    // SHOW SERVICE PREVIEW FUNCTION
    // =========================
    const showService = (key) => {
      const s = services[key];

      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle(s.title)
        .setDescription(`
📦 ID: ${s.id}

${s.desc}

⚠️ Reminder: These are examples. We can do better if you ask for it.
        `)
        .setImage(s.media);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    };

    // =========================
    // SERVICE BUTTONS
    // =========================
    if (interaction.customId === "normal_welcomer") return showService("normal_welcomer");
    if (interaction.customId === "pro_welcomer") return showService("pro_welcomer");
    if (interaction.customId === "custom_commands") return showService("custom_commands");

    if (interaction.customId === "pro_wipe") return showService("pro_wipe");
    if (interaction.customId === "normal_wipe") return showService("normal_wipe");
    if (interaction.customId === "dm_welcomer") return showService("dm_welcomer");
    if (interaction.customId === "security") return showService("security");
    if (interaction.customId === "ca_leaderboard") return showService("ca_leaderboard");

    // =========================
    // HOSTING (simple)
    // =========================
    if (interaction.customId === "hosting") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🖥️ BOT HOSTING")
        .setDescription(`
✔ $5 - Basic
✔ $7 - Standard
✔ $12 - Premium

⚠️ Reminder: These are examples. We can do better if you ask for it.
        `)
        .setImage(SHOP_IMAGE);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });
};
