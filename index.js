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
  Events,
  Partials,
  ActivityType
} = require("discord.js");

// ================== CLIENT ==================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],

  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
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

  client.user.setActivity("Cheapest Custome Discord Bots Creators", {
    type: ActivityType.Playing
  });

  // ================== STATS ==================

  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);

  if (statsChannel) {
    const guild = statsChannel.guild;

    await guild.members.fetch().catch(() => {});

    const messages = await statsChannel.messages.fetch({ limit: 10 }).catch(() => null);

    statsMessage = messages?.find(m => m.author.id === client.user.id);

    if (!statsMessage) {
      statsMessage = await statsChannel.send("📊 Loading live stats...");
    }

    setInterval(updateCustomerStats, 1000);
    updateCustomerStats();
  }

  // ================== REACTION ROLE SETUP ==================

  const rrChannel = await client.channels.fetch(REACTION_ROLE_CHANNEL_ID).catch(() => null);

  if (rrChannel) {
    const msg = await rrChannel.messages.fetch(REACTION_ROLE_MESSAGE_ID).catch(() => null);

    if (msg) {

      // ADD MISSING REACTIONS

      for (const emojiId of Object.keys(reactionRoles)) {

        const exists = msg.reactions.cache.find(
          r => r.emoji.id === emojiId
        );

        if (!exists) {
          await msg.react(emojiId).catch(() => {});
        }
      }

      // GIVE ROLES TO USERS WHO ALREADY REACTED

      for (const reaction of msg.reactions.cache.values()) {

        const roleId = reactionRoles[reaction.emoji.id];
        if (!roleId) continue;

        const users = await reaction.users.fetch().catch(() => null);
        if (!users) continue;

        for (const [, user] of users) {

          if (user.bot) continue;

          const member = await msg.guild.members.fetch(user.id).catch(() => null);
          if (!member) continue;

          if (!member.roles.cache.has(roleId)) {
            await member.roles.add(roleId).catch(() => {});
          }
        }
      }
    }
  }

  // ================== PANEL ==================

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
      .setDescription(
`💜 Need services or products?

Click the button below to create a private purchase ticket with our team.

✅ Fast Support
✅ Trusted Service
✅ Professional Staff`
      )
      .setColor("#a855f7")
      .setFooter({ text: "Fast support • Safest orders • 24/7" })
      .setTimestamp();

    const msgs = await panelChannel.messages.fetch({ limit: 10 }).catch(() => null);

    const exists = msgs?.find(
      m => m.author.id === client.user.id && m.components.length
    );

    if (!exists) {
      await panelChannel.send({
        embeds: [embed],
        components: [row]
      }).catch(() => {});
    }
  }
});

// ================== WELCOME ==================

client.on(Events.GuildMemberAdd, async member => {

  try {

    await member.roles.add(MEMBER_ROLE_ID).catch(() => {});

    const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);

    if (!welcomeChannel) return;

    const memberCount = member.guild.memberCount;

    const embed = new EmbedBuilder()
      .setColor("#a855f7")
      .setAuthor({
        name: `${member.user.username} joined the server`,
        iconURL: member.user.displayAvatarURL({ dynamic: true })
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(
`💜 Welcome ${member} to **${member.guild.name}**

✨ Enjoy your stay and have fun.
🛒 Need help? Open a ticket anytime.
👥 You are member **#${memberCount}**`
      )
      .addFields(
        {
          name: "📅 Discord Account Created",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
          inline: true
        },
        {
          name: "🆔 User ",
          value: member,
          inline: true
        }
      )
      .setFooter({
        text: `Welcome to ${member.guild.name}`
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Open Ticket")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com"),

      new ButtonBuilder()
        .setLabel("Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com")
    );

    await welcomeChannel.send({
      content: `🎉 Welcome ${member}!`,
      embeds: [embed],
      components: [row]
    });

  } catch (err) {
    console.log("WELCOME ERROR:", err);
  }
});

// ================== REACTION ROLE ADD ==================

client.on(Events.MessageReactionAdd, async (reaction, user) => {

  try {

    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch().catch(() => {});
    }

    if (!reaction.message.guild) return;

    if (
      reaction.message.id !== REACTION_ROLE_MESSAGE_ID ||
      reaction.message.channel.id !== REACTION_ROLE_CHANNEL_ID
    ) return;

    const emojiKey = reaction.emoji.id || reaction.emoji.name;

    const roleId = reactionRoles[emojiKey];

    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);

    if (!member) return;

    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId).catch(() => {});
    }

  } catch (err) {
    console.log("REACTION ROLE ADD ERROR:", err);
  }
});

// ================== REACTION ROLE REMOVE ==================

client.on(Events.MessageReactionRemove, async (reaction, user) => {

  try {

    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch().catch(() => {});
    }

    if (!reaction.message.guild) return;

    if (
      reaction.message.id !== REACTION_ROLE_MESSAGE_ID ||
      reaction.message.channel.id !== REACTION_ROLE_CHANNEL_ID
    ) return;

    const emojiKey = reaction.emoji.id || reaction.emoji.name;

    const roleId = reactionRoles[emojiKey];

    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);

    if (!member) return;

    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId).catch(() => {});
    }

  } catch (err) {
    console.log("REACTION ROLE REMOVE ERROR:", err);
  }
});

// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {

  try {

    // ================== BUTTONS ==================

    if (interaction.isButton()) {

      // ================== CREATE TICKET ==================

      if (interaction.customId === "create_ticket") {

        const ticketName =
          `ticket-${interaction.user.username}`
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 20);

        const existingChannel = interaction.guild.channels.cache.find(
          c => c.name === ticketName
        );

        if (existingChannel) {
          return interaction.reply({
            content: `❌ You already have a ticket: ${existingChannel}`,
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("purchase_modal")
          .setTitle("Purchase Ticket");

        const product = new TextInputBuilder()
          .setCustomId("product")
          .setLabel("What do you want to purchase?")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const description = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Describe it")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(product),
          new ActionRowBuilder().addComponents(description)
        );

        return interaction.showModal(modal);
      }

      // ================== CLAIM ==================

      if (interaction.customId === "claim_ticket") {

        await interaction.deferReply({
          ephemeral: true
        });

        const channel = interaction.channel;

        await channel.setName(
          `claimed-${interaction.user.username}`
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 25)
        ).catch(() => {});

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

        await interaction.message.edit({
          components: [row]
        }).catch(() => {});

        return interaction.editReply({
          content: "📌 Ticket claimed successfully!"
        });
      }

      // ================== CLOSE ==================

      if (interaction.customId === "close_ticket") {

        await interaction.reply({
          content: "❌ Closing ticket in 3 seconds..."
        });

        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 3000);
      }
    }

    // ================== MODAL ==================

    if (interaction.isModalSubmit()) {

      if (interaction.customId === "purchase_modal") {

        await interaction.deferReply({
          ephemeral: true
        });

        const product = interaction.fields.getTextInputValue("product");

        const description =
          interaction.fields.getTextInputValue("description");

        const channel = await interaction.guild.channels.create({

          name:
            `ticket-${interaction.user.username}`
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, "")
              .slice(0, 20),

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
            {
              name: "📦 Product",
              value: product
            },
            {
              name: "📝 Description",
              value: description
            }
          )
          .setColor("#a855f7")
          .setFooter({
            text: `User ID: ${interaction.user.id}`
          })
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

        return interaction.editReply({
          content: `✅ Ticket created: ${channel}`
        });
      }
    }

  } catch (err) {
    console.log("INTERACTION ERROR:", err);
  }
});

// ================== STATS ==================

async function updateCustomerStats() {

  try {

    if (!statsMessage) return;

    const guild = statsMessage.guild;

    if (!guild) return;

    await guild.members.fetch().catch(() => {});

    const customers = guild.members.cache.filter(
      m => m.roles.cache.has(CUSTOMER_ROLE_ID)
    );

    const online = customers.filter(
      m =>
        m.presence &&
        ["online", "idle", "dnd"].includes(m.presence.status)
    ).size;

    const embed = new EmbedBuilder()
      .setTitle("🔥 LIVE CUSTOMER STATS")
      .setDescription(
`👥 Total Customers: **${customers.size}**
🟢 Online Customers: **${online}**`
      )
      .setColor("#a855f7")
      .setTimestamp();

    await statsMessage.edit({
      embeds: [embed]
    }).catch(() => {});

  } catch (e) {
    console.log("STATS ERROR:", e);
  }
}

// ================== ERRORS ==================

process.on("unhandledRejection", err =>
  console.log("UNHANDLED REJECTION:", err)
);

process.on("uncaughtException", err =>
  console.log("UNCAUGHT EXCEPTION:", err)
);

// ================== LOGIN ==================

client.login(process.env.TOKEN);
