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
  "1463019802430935051": "1505257038958301224", // minecraft
  "1411628099480715374": "1505257038958301224", // website
  "1245798051050819584": "1481860425305034864", // ark
  "1135251088782672013": "1505255546402639942"  // custom bot
};

// ================== GLOBAL ==================

let statsMessage;

// ================== READY ==================

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const statsChannel = await client.channels.fetch(STATS_CHANNEL_ID).catch(() => null);
  if (!statsChannel) return console.log("❌ Stats channel not found.");

  const guild = statsChannel.guild;

  await guild.members.fetch().catch(() => {});

  // ================= REACTION MESSAGE SETUP =================
  const rrChannel = await client.channels.fetch(REACTION_ROLE_CHANNEL_ID).catch(() => null);

  if (rrChannel) {
    const msg = await rrChannel.messages.fetch(REACTION_ROLE_MESSAGE_ID).catch(() => null);

    if (msg) {
      console.log("✅ Reaction role message found");

      for (const emojiId of Object.keys(reactionRoles)) {
        const exists = msg.reactions.cache.find(r => r.emoji.id === emojiId);
        if (!exists) {
          await msg.react(emojiId).catch(() => {});
        }
      }
    }
  }

  // ================= STATS INIT FIX =================
  const messages = await statsChannel.messages.fetch({ limit: 10 }).catch(() => null);
  statsMessage = messages?.find(m => m.author.id === client.user.id);

  if (!statsMessage) {
    statsMessage = await statsChannel.send("📊 Loading live stats...");
  }

  setInterval(updateCustomerStats, 15000);
  updateCustomerStats();
});

// ================== REACTION ROLES ==================

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch().catch(() => {});
  if (reaction.message.partial) await reaction.message.fetch().catch(() => {});

  if (reaction.message.id !== REACTION_ROLE_MESSAGE_ID) return;

  const roleId = reactionRoles[reaction.emoji.id];
  if (!roleId) return;

  const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  await member.roles.add(roleId).catch(() => {});
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch().catch(() => {});
  if (reaction.message.partial) await reaction.message.fetch().catch(() => {});

  if (reaction.message.id !== REACTION_ROLE_MESSAGE_ID) return;

  const roleId = reactionRoles[reaction.emoji.id];
  if (!roleId) return;

  const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
  if (!member) return;

  await member.roles.remove(roleId).catch(() => {});
});

// ================== STATS (FIXED) ==================

async function updateCustomerStats() {
  try {
    if (!statsMessage) return;

    const guild = statsMessage.guild;

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

// ================== JOIN (IMPROVED WELCOME) ==================

client.on(Events.GuildMemberAdd, async member => {
  await member.roles.add(MEMBER_ROLE_ID).catch(() => {});

  const channel = await client.channels.fetch(WELCOME_CHANNEL_ID).catch(() => null);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 Welcome to the Server!")
    .setDescription(
      `Hey ${member} 👋\n\nWelcome to **${member.guild.name}**!\nWe're happy to have you here 💜`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setColor("#a855f7")
    .setFooter({ text: "Enjoy your stay!" })
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// ================== INTERACTIONS ==================

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      // unchanged
    }

    if (interaction.isButton()) {
      // unchanged
    }

    if (interaction.isModalSubmit()) {
      // unchanged
    }
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.TOKEN);
