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
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder
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

const PREFIX = "!";

const OWNER_ROLE_ID = "1481850766049153267";
const PANEL_CHANNEL_ID = "1481879215812116571";
const STAFF_ROLE_ID = "1481850766049153267";
const MEMBER_ROLE_ID = "1481859617721155594";
const CUSTOMER_ROLE_ID = "1481903373916835910";
const WELCOME_CHANNEL_ID = "1481848539406405685";
const STATS_CHANNEL_ID = "1500123888489599076";
const CATEGORY_ID = "1481879162141540403";

// ================== SLASH COMMANDS ==================

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong"),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete messages")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("Amount")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock channel"),

  new SlashCommandBuilder()
    .setName("role")
    .setDescription("Role command")

].map(command => command.toJSON());

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

  client.user.setActivity("Cheapest Custom Discord Bots", {
    type: ActivityType.Playing
  });

  // ================== REGISTER SLASH COMMANDS ==================

  try {

    const rest = new REST({ version: "10" })
      .setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationCommands("1497005576645906442"),
      { body: commands }
    );

    console.log("✅ Slash commands registered.");

  } catch (err) {

    console.log("SLASH COMMAND ERROR:", err);
  }

  // ================== STATS ==================

  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);

  if (statsChannel) {

    const guild = statsChannel.guild;

    await guild.members.fetch().catch(() => {});

    const messages = await statsChannel.messages.fetch({ limit: 10 }).catch(() => null);

    statsMessage = messages?.find(
      m => m.author.id === client.user.id
    );

    if (!statsMessage) {
      statsMessage = await statsChannel.send("📊 Loading stats...");
    }

    updateCustomerStats();

    setInterval(updateCustomerStats, 30000);
  }

  // ================== REACTION ROLE SETUP ==================

  const rrChannel = await client.channels.fetch(REACTION_ROLE_CHANNEL_ID).catch(() => null);

  if (rrChannel) {

    const msg = await rrChannel.messages.fetch(REACTION_ROLE_MESSAGE_ID).catch(() => null);

    if (msg) {

      for (const emojiId of Object.keys(reactionRoles)) {

        const exists = msg.reactions.cache.find(
          r => r.emoji.id === emojiId
        );

        if (!exists) {
          await msg.react(emojiId).catch(() => {});
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
      .setDescription(`
💜 Need services or products?

Click the button below to create a private purchase ticket.

✅ Fast Support
✅ Trusted Service
✅ Professional Staff
      `)
      .setColor("#a855f7")
      .setFooter({
        text: "24/7 Support"
      })
      .setTimestamp();

    const msgs = await panelChannel.messages.fetch({ limit: 10 }).catch(() => null);

    const exists = msgs?.find(
      m =>
        m.author.id === client.user.id &&
        m.components.length
    );

    if (!exists) {

      await panelChannel.send({
        embeds: [embed],
        components: [row]
      });
    }
  }

});

// ================== PREFIX COMMANDS ==================

client.on(Events.MessageCreate, async message => {

  try {

    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content
      .slice(PREFIX.length)
      .trim()
      .split(/ +/);

    const command = args.shift()?.toLowerCase();

    if (command === "ping") {
      return message.reply("🏓 Pong!");
    }

    if (command === "help") {

      const embed = new EmbedBuilder()
        .setTitle("📘 Commands")
        .setColor("#a855f7")
        .setDescription(`
\`!ping\`
\`!help\`
\`!stats\`
        `);

      return message.reply({
        embeds: [embed]
      });
    }

    if (command === "stats") {

      const customers = message.guild.members.cache.filter(
        m => m.roles.cache.has(CUSTOMER_ROLE_ID)
      );

      const online = customers.filter(
        m =>
          m.presence &&
          ["online", "idle", "dnd"].includes(m.presence.status)
      ).size;

      const embed = new EmbedBuilder()
        .setTitle("🔥 LIVE CUSTOMER STATS")
        .setDescription(`
👥 Total Customers: **${customers.size}**
🟢 Online Customers: **${online}**
        `)
        .setColor("#a855f7");

      return message.reply({
        embeds: [embed]
      });
    }

  } catch (err) {

    console.log("COMMAND ERROR:", err);
  }

});

// ================== WELCOME ==================

client.on(Events.GuildMemberAdd, async member => {

  try {

    await member.roles.add(MEMBER_ROLE_ID).catch(() => {});

    const welcomeChannel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);

    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#a855f7")
      .setAuthor({
        name: `${member.user.username} joined the server`,
        iconURL: member.user.displayAvatarURL()
      })
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(`
💜 Welcome ${member}

🛒 Open a ticket anytime.
👥 Member #${member.guild.memberCount}
      `)
      .setTimestamp();

    await welcomeChannel.send({
      content: `🎉 Welcome ${member}!`,
      embeds: [embed]
    });

  } catch (err) {

    console.log("WELCOME ERROR:", err);
  }

});

// ================== REACTION ADD ==================

client.on(Events.MessageReactionAdd, async (reaction, user) => {

  try {

    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.message.id !== REACTION_ROLE_MESSAGE_ID) return;

    const roleId = reactionRoles[reaction.emoji.id];

    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);

    if (!member.roles.cache.has(roleId)) {

      await member.roles.add(roleId).catch(() => {});
    }

  } catch (err) {

    console.log("REACTION ADD ERROR:", err);
  }

});

// ================== REACTION REMOVE ==================

client.on(Events.MessageReactionRemove, async (reaction, user) => {

  try {

    if (user.bot) return;

    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.message.id !== REACTION_ROLE_MESSAGE_ID) return;

    const roleId = reactionRoles[reaction.emoji.id];

    if (!roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);

    if (member.roles.cache.has(roleId)) {

      await member.roles.remove(roleId).catch(() => {});
    }

  } catch (err) {

    console.log("REACTION REMOVE ERROR:", err);
  }

});

// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {

  try {

    // ================== SLASH COMMANDS ==================

    if (interaction.isChatInputCommand()) {

      if (!interaction.member.roles.cache.has(OWNER_ROLE_ID)) {
        return interaction.reply({
          content: "❌ Only owner can use commands.",
          ephemeral: true
        });
      }

      if (interaction.commandName === "ping") {
        return interaction.reply("🏓 Pong!");
      }

      if (interaction.commandName === "clear") {

        const amount = interaction.options.getInteger("amount");

        await interaction.channel.bulkDelete(amount, true);

        return interaction.reply({
          content: `✅ Deleted ${amount} messages.`,
          ephemeral: true
        });
      }

      if (interaction.commandName === "lock") {

        await interaction.channel.permissionOverwrites.edit(
          interaction.guild.id,
          {
            SendMessages: false
          }
        );

        return interaction.reply("🔒 Channel locked.");
      }

      if (interaction.commandName === "role") {
        return interaction.reply("✅ Role command works.");
      }
    }

    // ================== BUTTONS ==================

    if (interaction.isButton()) {

      if (interaction.customId === "create_ticket") {

        const existing = interaction.guild.channels.cache.find(
          c => c.name === `ticket-${interaction.user.username.toLowerCase()}`
        );

        if (existing) {

          return interaction.reply({
            content: `❌ You already have a ticket: ${existing}`,
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("purchase_modal")
          .setTitle("Purchase Ticket");

        const product = new TextInputBuilder()
          .setCustomId("product")
          .setLabel("Product")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const description = new TextInputBuilder()
          .setCustomId("description")
          .setLabel("Description")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(product),
          new ActionRowBuilder().addComponents(description)
        );

        return interaction.showModal(modal);
      }

      if (interaction.customId === "claim_ticket") {

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

        await interaction.message.edit({
          components: [row]
        });

        return interaction.reply({
          content: "📌 Ticket claimed!",
          ephemeral: true
        });
      }

      if (interaction.customId === "close_ticket") {

        await interaction.reply({
          content: "❌ Closing ticket in 3 seconds..."
        });

        setTimeout(() => {

          interaction.channel.delete().catch(() => {});

        }, 3000);
      }
    }

    // ================== MODALS ==================

    if (interaction.isModalSubmit()) {

      if (interaction.customId === "purchase_modal") {

        const product =
          interaction.fields.getTextInputValue("product");

        const description =
          interaction.fields.getTextInputValue("description");

        const cleanName = interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 15);

        const channel = await interaction.guild.channels.create({

          name: `ticket-${cleanName}`,

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
          .setColor("#a855f7")
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

// ================== STATS ==================

async function updateCustomerStats() {

  try {

    if (!statsMessage) return;

    const guild = statsMessage.guild;

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
      .setDescription(`
👥 Total Customers: **${customers.size}**
🟢 Online Customers: **${online}**
      `)
      .setColor("#a855f7")
      .setTimestamp();

    await statsMessage.edit({
      content: null,
      embeds: [embed]
    });

  } catch (err) {

    console.log("STATS ERROR:", err);
  }

}

// ================== ERRORS ==================

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION:", err);
});

// ================== LOGIN ==================

client.login(process.env.TOKEN);

// ================== SECURITY ==================

require("./security")(client);
require("./dmwelcome")(client);
require("./botstats")(client);
require("./text")(client);
require("./shop")(client);
