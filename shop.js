const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
} = require("discord.js");

module.exports = (client) => {
  const SHOP_CHANNEL_ID = "1505281157753995314";

  // =========================
  // SERVICES DATABASE
  // =========================
  const services = {
    normal_welcomer: {
      title: "👋 Normal Welcomer",
      id: "1506405315543826512",
      type: "image",
      media:
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png",
      desc: "Basic welcome system for your server.",
    },

    pro_welcomer: {
      title: "🔥 PRO Welcomer",
      id: "1506405499770507387",
      type: "video",
      media: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // replace with your real demo
      desc: "Advanced welcome system with embeds, roles & customization.",
    },

    custom_commands: {
      title: "⚙️ Custom Commands",
      id: "1506406025597681907",
      type: "image",
      media:
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png",
      desc: "Custom bot commands made exactly for your server.",
    },

    pro_wipe: {
      title: "💥 PRO Wipe Countdown",
      id: "1501981686353891500",
      type: "video",
      media: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      desc: "Advanced countdown system with live wipe tracking.",
    },

    normal_wipe: {
      title: "⏳ Normal Wipe Countdown",
      id: "1502434930733486200",
      type: "image",
      media:
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png",
      desc: "Simple wipe countdown system.",
    },

    dm_welcomer: {
      title: "📩 DM Welcomer",
      id: "1505541405874061332",
      type: "image",
      media:
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png",
      desc: "Sends automatic welcome messages in DM.",
    },

    security: {
      title: "🛡️ Security System",
      id: "1505525021139931176",
      type: "video",
      media: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      desc: "Anti-raid, anti-nuke & full server protection.",
    },

    ca_leaderboard: {
      title: "🏆 CA Leaderboard System",
      id: "1505247151071035522",
      type: "image",
      media:
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png",
      desc:
        "Tribe system with stats, credits, ranking system & 5 commands (/register /add /remove /eliminate /winner).",
    },
  };

  // =========================
  // READY PANEL
  // =========================
  client.once(Events.ClientReady, async () => {
    console.log("✅ Shop System Loaded");

    const channel = await client.channels.fetch(SHOP_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setColor("#8b5cf6")
      .setTitle("🚀 ZYN HUB SHOP")
      .setDescription(`
Select a category below.

⚠️ Reminder: These are examples — we can build MUCH better if you request.
      `)
      .setImage(
        "https://cdn.discordapp.com/attachments/1505281157753995314/1506399117277003927/zyn_hub.png"
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("main_bots")
        .setLabel("Main Bots")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("systems")
        .setLabel("Systems")
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [row] });
  });

  // =========================
  // HELP FUNCTION
  // =========================
  const showService = async (interaction, key) => {
    const s = services[key];

    const embed = new EmbedBuilder()
      .setColor("#8b5cf6")
      .setTitle(s.title)
      .setDescription(`
📦 ID: ${s.id}

${s.desc}

⚠️ Reminder: these are examples — we can build better if you ask.
      `)
      .setFooter({ text: "Zyn Hub • Premium Development" });

    // IMAGE or VIDEO handling
    if (s.type === "image") {
      embed.setImage(s.media);
    } else if (s.type === "video") {
      embed.setURL(s.media); // makes title clickable video link
      embed.setDescription(
        embed.data.description + `\n\n🎬 Preview: ${s.media}`
      );
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  };

  // =========================
  // INTERACTIONS
  // =========================
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    // MAIN MENU
    if (interaction.customId === "main_bots") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("🤖 MAIN BOT SYSTEMS")
        .setDescription(`
1 Powerful bot = multiple tools
✔ Less hosting cost
✔ Faster performance
✔ All-in-one system

⚠️ Reminder: examples only — better versions available.
        `);

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

      return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    }

    // SYSTEM MENU
    if (interaction.customId === "systems") {
      const embed = new EmbedBuilder()
        .setColor("#8b5cf6")
        .setTitle("⚙️ SYSTEMS CATEGORY")
        .setDescription(`
Select a system to preview.

⚠️ Reminder: all are examples, we can improve them.
        `);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("pro_wipe")
          .setLabel("PRO Wipe")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("normal_wipe")
          .setLabel("Normal Wipe")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("dm_welcomer")
          .setLabel("DM Welcomer")
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId("security")
          .setLabel("Security")
          .setStyle(ButtonStyle.Danger)
      );

      return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    }

    // SERVICE ROUTING
    if (services[interaction.customId]) {
      return showService(interaction, interaction.customId);
    }
  });
};
