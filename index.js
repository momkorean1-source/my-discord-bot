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
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
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

// ================== REACTION ROLES ==================

const REACTION_ROLE_MESSAGE_ID = "1505257411349581865";
const REACTION_ROLE_CHANNEL_ID = "1481857825066975303";

const reactionRoles = {
  "1463019802430935051": "1505257038958301224",
  "1411628099480715374": "1505257038958301224",
  "1245798051050819584": "1481860425305034864",
  "1135251088782672013": "1505255546402639942"
};

// ================== GLOBAL ==================

let statsMessage;

// ================== READY ==================

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);
  if (!statsChannel) return;

  const guild = statsChannel.guild;
  await guild.members.fetch().catch(() => {});

  // ================= REACTION ROLES =================

  const rrChannel = await client.channels.fetch(REACTION_ROLE_CHANNEL_ID).catch(() => null);

  if (rrChannel) {
    const msg = await rrChannel.messages.fetch(REACTION_ROLE_MESSAGE_ID).catch(() => null);

    if (msg) {
      for (const emojiId of Object.keys(reactionRoles)) {
        const exists = msg.reactions.cache.find(r => r.emoji.id === emojiId);
        if (!exists) await msg.react(emojiId).catch(() => {});
      }
    }
  }

  // ================= STATS SAFE INIT =================

  const messages = await statsChannel.messages.fetch({ limit: 10 }).catch(() => null);
  statsMessage = messages?.find(m => m.author.id === client.user.id);

  if (!statsMessage) {
    statsMessage = await statsChannel.send("📊 Loading live stats...");
  }

  setInterval(updateCustomerStats, 15000);
  updateCustomerStats();

  // ================= TICKET PANEL =================

  const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);

  if (panelChannel) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create_ticket")
        .setLabel("🛒 OPEN PURCHASE TICKET")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle("🛒 PREMIUM PURCHASE CENTER")
      .setDescription("Click below to open a private purchase ticket with our team.")
      .setColor("#a855f7")
      .setFooter({ text: "Fast support • Safe orders • 24/7" });

    const msgs = await panelChannel.messages.fetch({ limit: 10 }).catch(() => null);
    const exists = msgs?.find(m => m.author.id === client.user.id && m.components.length);

    if (!exists) {
      panelChannel.send({ embeds: [embed], components: [row] });
    }
  }
});

// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {
  try {

    // ================= BUTTONS =================
    if (interaction.isButton()) {

      // OPEN TICKET
      if (interaction.customId === "create_ticket") {

        const modal = new ModalBuilder()
          .setCustomId("purchase_modal")
          .setTitle("Purchase Ticket");

        const product = new TextInputBuilder()
          .setCustomId("product")
          .setLabel("What do you want to purchase?")
          .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Describe it")
          .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
          new ActionRowBuilder().addComponents(product),
          new ActionRowBuilder().addComponents(description)
        );

        return interaction.showModal(modal);
      }

      // CLAIM TICKET
      if (interaction.customId === "claim_ticket") {
        const channel = interaction.channel;

        await channel.setName(`claimed-${interaction.user.username}`).catch(() => {});

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claimed_locked")
            .setLabel(`Claimed by ${interaction.user.username}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.message.edit({ components: [row] }).catch(() => {});

        return interaction.reply({
          content: "📌 Ticket claimed!",
          ephemeral: true
        });
      }

      // CLOSE TICKET
      if (interaction.customId === "close_ticket") {
        await interaction.reply("❌ Closing ticket...");
        setTimeout(() => interaction.channel.delete().catch(() => {}), 2500);
      }
    }

    // ================= MODAL =================
    if (interaction.isModalSubmit()) {

      if (interaction.customId === "purchase_modal") {

        const product = interaction.fields.getTextInputValue("product");
        const description = interaction.fields.getTextInputValue("description");

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          parent: CATEGORY_ID,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
              ]
            },
            {
              id: STAFF_ROLE_ID,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
              ]
            }
          ]
        });

        const embed = new EmbedBuilder()
          .setTitle("🛒 New Purchase Ticket")
          .setDescription(`👤 Opened by <@${interaction.user.id}>`)
          .addFields(
            { name: "Product", value: product },
            { name: "Description", value: description }
          )
          .setColor("#a855f7")
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claim_ticket")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: `<@&${STAFF_ROLE_ID}> <@${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        return interaction.reply({
          content: `✅ Ticket created: ${channel}`,
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.log("INTERACTION ERROR:", err);
  }
});

// ================== STATS (CRASH FIXED) ==================

async function updateCustomerStats() {
  try {
    if (!statsMessage) return;

    const guild = statsMessage.guild;
    if (!guild) return;

    await guild.members.fetch().catch(() => {});

    const customers = guild.members.cache.filter(m =>
      m.roles.cache.has(CUSTOMER_ROLE_ID)
    );

    const online = customers.filter(m =>
      m.presence && ["online", "idle", "dnd"].includes(m.presence.status)
    ).size;

    const embed = new EmbedBuilder()
      .setTitle("🔥 LIVE CUSTOMER STATS")
      .setDescription(
        `👥 Total Customers: **${customers.size}**\n🟢 Online Customers: **${online}**`
      )
      .setColor("#a855f7")
      .setTimestamp();

    await statsMessage.edit({ embeds: [embed] }).catch(() => {});
  } catch (e) {
    console.log("STATS ERROR:", e);
  }
}

client.login(process.env.TOKEN);
