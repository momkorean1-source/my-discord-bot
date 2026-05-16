const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================== CONFIG ==================

const PANEL_CHANNEL_ID = "1481879215812116571";
const STAFF_ROLE_ID = "1481850766049153267";
const MEMBER_ROLE_ID = "1481859617721155594";
const CUSTOMER_ROLE_ID = "1481903373916835910";
const WELCOME_CHANNEL_ID = "1481848539406405685";
const STATS_CHANNEL_ID = "1500123888489599076";
const CATEGORY_ID = "1481879162141540403";

let statsMessage;

// ================== READY ==================

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);
  if (!statsChannel) return console.log("❌ Stats channel not found.");

  const guild = statsChannel.guild;

  console.log("⏳ Fetching member cache...");
  await guild.members.fetch({ withPresences: true }).catch(() => {});
  console.log("✅ Member cache ready.");

  // PANEL
  const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);

  if (panelChannel) {
    const messages = await panelChannel.messages.fetch({ limit: 10 });
    const existing = messages.find(m => m.author.id === client.user.id && m.components.length);

    if (!existing) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("create_ticket")
          .setLabel("🛒 OPEN PURCHASE TICKET")
          .setStyle(ButtonStyle.Primary)
      );

      const embed = new EmbedBuilder()
        .setTitle("🛒 ZYN HUB PURCHASE CENTER")
        .setDescription("Click below to open a private ticket.")
        .setColor("#a855f7");

      await panelChannel.send({ embeds: [embed], components: [row] });
    }
  }

  // STATS
  const messages = await statsChannel.messages.fetch({ limit: 10 });
  statsMessage = messages.find(m => m.author.id === client.user.id);

  if (!statsMessage) {
    statsMessage = await statsChannel.send("Loading stats...");
  }

  setInterval(updateCustomerStats, 15000);
  updateCustomerStats();
});

// ================== STATS ==================

async function updateCustomerStats() {
  try {
    const guild = statsMessage.guild;

    const customers = guild.members.cache.filter(m =>
      m.roles.cache.has(CUSTOMER_ROLE_ID)
    );

    const online = customers.filter(m =>
      ["online", "idle", "dnd"].includes(m.presence?.status)
    ).size;

    const embed = new EmbedBuilder()
      .setTitle("🔥 LIVE CUSTOMER STATS")
      .setDescription(
        `👥 Total Customers: **${customers.size}**\n🟢 Online Customers: **${online}**`
      )
      .setColor("#a855f7");

    await statsMessage.edit({ embeds: [embed] }).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}

// ================== JOIN ==================

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20);
}

client.on(Events.GuildMemberAdd, async member => {
  await member.roles.add(MEMBER_ROLE_ID).catch(() => {});

  const channel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("🎉 Welcome")
    .setDescription(`Welcome ${member}`)
    .setColor("#a855f7");

  channel.send({ embeds: [embed] });
});

// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {
  try {

    // ================= SLASH COMMANDS =================
    if (interaction.isChatInputCommand()) {

      // /lock
      if (interaction.commandName === "lock") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
          return interaction.reply({ content: "❌ No permission", ephemeral: true });

        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
          SendMessages: false
        });

        return interaction.reply("🔒 Locked.");
      }

      // /kick
      if (interaction.commandName === "kick") {
        const user = interaction.options.getMember("user");
        await user.kick();
        return interaction.reply(`👢 Kicked ${user.user.tag}`);
      }

      // /ban
      if (interaction.commandName === "ban") {
        const user = interaction.options.getMember("user");
        await user.ban();
        return interaction.reply(`⛔ Banned ${user.user.tag}`);
      }

      // /role give
      if (interaction.commandName === "role") {
        const user = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");

        await user.roles.add(role);
        return interaction.reply(`✅ Gave role ${role.name} to ${user.user.tag}`);
      }

      // /timeout
      if (interaction.commandName === "timeout") {
        const user = interaction.options.getMember("user");
        const minutes = interaction.options.getInteger("minutes");

        await user.timeout(minutes * 60000);
        return interaction.reply(`⏳ Timed out ${user.user.tag}`);
      }

      // /untimeout
      if (interaction.commandName === "untimeout") {
        const user = interaction.options.getMember("user");

        await user.timeout(null);
        return interaction.reply(`✅ Removed timeout`);
      }

      // /clear
      if (interaction.commandName === "clear") {
        const amount = interaction.options.getInteger("amount");

        await interaction.channel.bulkDelete(amount, true);
        return interaction.reply({ content: `🧹 Deleted ${amount}`, ephemeral: true });
      }
    }

    // ================= BUTTONS =================
    if (interaction.isButton()) {

      if (interaction.customId === "create_ticket") {

        const modal = new ModalBuilder()
          .setCustomId("purchase_modal")
          .setTitle("Purchase Request");

        const productInput = new TextInputBuilder()
          .setCustomId("product")
          .setLabel("What do you want to buy?")
          .setStyle(TextInputStyle.Short);

        const descriptionInput = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Describe your need")
          .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
          new ActionRowBuilder().addComponents(productInput),
          new ActionRowBuilder().addComponents(descriptionInput)
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === "claim_ticket") {
        await interaction.channel.setName(`claimed-${safeName(interaction.user.username)}`);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claimed")
            .setLabel(`Claimed by ${interaction.user.username}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.message.edit({ components: [row] });
        return interaction.reply("📌 Claimed.");
      }

      if (interaction.customId === "close_ticket") {
        await interaction.reply("Closing...");
        setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
      }
    }

    // ================= MODAL =================
    if (interaction.isModalSubmit()) {

      if (interaction.customId === "purchase_modal") {

        const product = interaction.fields.getTextInputValue("product");
        const description = interaction.fields.getTextInputValue("description");

        const channel = await interaction.guild.channels.create({
          name: `ticket-${safeName(interaction.user.username)}`,
          type: ChannelType.GuildText,
          parent: CATEGORY_ID,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
            { id: STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
          ]
        });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("claim_ticket").setLabel("Claim").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId("close_ticket").setLabel("Close").setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
          .setTitle("Ticket")
          .addFields(
            { name: "User", value: `<@${interaction.user.id}>` },
            { name: "Product", value: product },
            { name: "Description", value: description }
          )
          .setColor("#a855f7");

        await channel.send({
          content: `<@&${STAFF_ROLE_ID}>`,
          embeds: [embed],
          components: [row]
        });

        return interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
      }
    }

  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.TOKEN);
