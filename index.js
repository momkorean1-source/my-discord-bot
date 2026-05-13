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
    GatewayIntentBits.GuildPresences // ⚠️ MUST be enabled in Developer Portal
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

  // Fetch stats channel and guild
  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);
  if (!statsChannel) return console.log("❌ Stats channel not found.");

  const guild = statsChannel.guild;

  // IMPORTANT: Only fetch members ONCE on startup to populate cache.
  // This avoids the Opcode 8 Rate Limit error.
  console.log("⏳ Fetching member cache...");
  await guild.members.fetch({ withPresences: true }).catch(e => console.log("Fetch error:", e));
  console.log("✅ Member cache ready.");

  // ================== TICKET PANEL ==================

  const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);
  if (panelChannel) {
    const messages = await panelChannel.messages.fetch({ limit: 10 });
    const existingPanel = messages.find(m => m.author.id === client.user.id && m.components.length);

    if (!existingPanel) {
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

  // ================== STATS MESSAGE INITIALIZATION ==================

  const messages = await statsChannel.messages.fetch({ limit: 10 });
  statsMessage = messages.find(m => m.author.id === client.user.id);

  if (!statsMessage) {
    statsMessage = await statsChannel.send("Loading stats...");
  }

  // Update every 15s (Safer than 5s to avoid edit rate limits)
  setInterval(updateCustomerStats, 15000);
  updateCustomerStats();
});

// ================== LIVE STATS ==================

async function updateCustomerStats() {
  try {
    if (!statsMessage) return;
    const guild = statsMessage.guild;

    // Use cache instead of fetching every 15 seconds
    const customers = guild.members.cache.filter(member =>
      member.roles.cache.has(CUSTOMER_ROLE_ID)
    );

    const totalCustomers = customers.size;

    const onlineCustomers = customers.filter(member => {
      const status = member.presence?.status;
      return ["online", "idle", "dnd"].includes(status);
    }).size;

    const embed = new EmbedBuilder()
      .setTitle("🔥 LIVE CUSTOMER STATS")
      .setDescription(
        `👥 Total Customers: **${totalCustomers}**\n🟢 Online Customers: **${onlineCustomers}**`
      )
      .setColor("#a855f7")
      .setFooter({ text: "Updates every 15s" });

    await statsMessage.edit({ embeds: [embed] }).catch(() => { });

  } catch (err) {
    console.log("Stats error:", err);
  }
}

// ================== MEMBER JOIN ==================

client.on(Events.GuildMemberAdd, async member => {
  try {
    await member.roles.add(MEMBER_ROLE_ID).catch(() => { });

    const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("🎉 Welcome to ZYN HUB")
      .setDescription(`👋 Welcome ${member}\n💎 You are verified!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor("#a855f7");

    await welcomeChannel.send({ embeds: [embed] });

  } catch (err) {
    console.log(err);
  }
});
function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20);
}
// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === "create_ticket") {
        const existingTicket = interaction.guild.channels.cache.find(
          c => c.name.startsWith(`ticket-${safeName(interaction.user.username)}`)
        );

        if (existingTicket) {
          return interaction.reply({
            content: `❌ You already have a ticket: ${existingTicket}`,
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("purchase_modal")
          .setTitle("Purchase Request");

        const productInput = new TextInputBuilder()
          .setCustomId("product")
          .setLabel("What do you want to buy?")
          .setStyle(TextInputStyle.Short);

        const descriptionInput = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Describe what you need")
          .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
          new ActionRowBuilder().addComponents(productInput),
          new ActionRowBuilder().addComponents(descriptionInput)
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === "claim_ticket") {
        const newName = `claimed-${safeName(interaction.user.username)}`;

        await interaction.channel.setName(newName).catch(() => { });
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
          return interaction.reply({ content: "❌ Staff only.", ephemeral: true });
        }

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claimed")
            .setLabel(`✅ Claimed by ${interaction.user.username}`)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("🔒 Close Ticket")
            .setStyle(ButtonStyle.Danger)
        );

        await interaction.message.edit({ components: [buttons] });
        await interaction.reply({ content: `📌 Ticket claimed by ${interaction.user}` });
      }

      if (interaction.customId === "close_ticket") {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
          return interaction.reply({ content: "❌ Staff only.", ephemeral: true });
        }
        await interaction.reply({ content: "🔒 Closing ticket..." });
        setTimeout(() => interaction.channel.delete().catch(() => { }), 3000);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "purchase_modal") {
        const product = interaction.fields.getTextInputValue("product");
        const description = interaction.fields.getTextInputValue("description");

        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${safeName(interaction.user.username)}`,
          type: ChannelType.GuildText,
          parent: CATEGORY_ID,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
            { id: STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
          ]
        });

        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("claim_ticket").setLabel("📌 Claim Ticket").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId("close_ticket").setLabel("🔒 Close Ticket").setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
          .setTitle("🛒 Purchase Ticket")
          .addFields(
            { name: "Customer", value: `<@${interaction.user.id}>` },
            { name: "Product", value: product },
            { name: "Description", value: description }
          )
          .setColor("#a855f7");

        await ticketChannel.send({ content: `<@&${STAFF_ROLE_ID}> | <@${interaction.user.id}>`, embeds: [embed], components: [buttons] });
        await interaction.reply({ content: `✅ Ticket created: ${ticketChannel}`, ephemeral: true });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
client.login(process.env.TOKEN);
