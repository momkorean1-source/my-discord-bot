const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionsBitField,
  Events
} = require('discord.js');

module.exports = (client) => {

  // ================== CONFIG ==================
  const PANEL_CHANNEL_ID = "1481879215812116571";
  const STAFF_LOG_CHANNEL = "1481850766049153267";
  const TICKET_CATEGORY_ID = "1481879162141540403"; // optional
  const STAFF_ROLE_ID = "1481850766049153267";
  // ============================================

  // Hidden discount codes (not shown anywhere)
  const discountCodes = {
    HRN: 15,
    Neon: 20,
    99111: 30
  };

  const activeDiscounts = new Map();
  const openOrders = new Map();

  function generateOrderID() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  client.on(Events.InteractionCreate, async interaction => {

    // ================= /PANEL =================
    if (interaction.isChatInputCommand() && interaction.commandName === 'panel') {

      if (interaction.channel.id !== PANEL_CHANNEL_ID)
        return interaction.reply({ content: "❌ Use this in the shop channel only.", ephemeral: true });

      const embed = new EmbedBuilder()
        .setColor("#111214")
        .setTitle("💎 ZYN ELITE ORDER SYSTEM")
        .setDescription(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Premium Custom Discord Bots
⚡ Fast & Secure Development
🛡 Advanced Protection Systems
🎨 Fully Custom Designs
━━━━━━━━━━━━━━━━━━━━━━━━━━

Click the button below to start your order.
        `)
        .setFooter({ text: "Professional • Secure • Trusted" });

      const button = new ButtonBuilder()
        .setCustomId('create_order')
        .setLabel('🛒 Start Order')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.channel.send({ embeds: [embed], components: [row] });
      return interaction.reply({ content: "✅ Panel deployed.", ephemeral: true });
    }

    // ================= /USECODE =================
    if (interaction.isChatInputCommand() && interaction.commandName === 'usecode') {

      const code = interaction.options.getString('code');

      if (discountCodes[code]) {
        activeDiscounts.set(interaction.user.id, discountCodes[code]);
        return interaction.reply({
          content: "✅ Discount successfully applied to your next order.",
          ephemeral: true
        });
      } else {
        return interaction.reply({
          content: "❌ Invalid discount code.",
          ephemeral: true
        });
      }
    }

    // ================= CREATE ORDER BUTTON =================
    if (interaction.isButton() && interaction.customId === 'create_order') {

      if (openOrders.has(interaction.user.id))
        return interaction.reply({
          content: "❌ You already have an open order.",
          ephemeral: true
        });

      const modal = new ModalBuilder()
        .setCustomId('order_modal')
        .setTitle('Create Your Elite Order');

      const product = new TextInputBuilder()
        .setCustomId('product')
        .setLabel("What service do you need?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const budget = new TextInputBuilder()
        .setCustomId('budget')
        .setLabel("Your Budget?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel("Describe your request")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(product),
        new ActionRowBuilder().addComponents(budget),
        new ActionRowBuilder().addComponents(details)
      );

      return interaction.showModal(modal);
    }

    // ================= MODAL SUBMIT =================
    if (interaction.isModalSubmit() && interaction.customId === 'order_modal') {

      const product = interaction.fields.getTextInputValue('product');
      const budget = interaction.fields.getTextInputValue('budget');
      const details = interaction.fields.getTextInputValue('details');

      const orderID = generateOrderID();
      const discount = activeDiscounts.get(interaction.user.id) || 0;

      const channel = await interaction.guild.channels.create({
        name: `order-${orderID}`,
        type: ChannelType.GuildText,
        parent: TICKET_CATEGORY_ID || null,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          },
          {
            id: STAFF_ROLE_ID,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          }
        ]
      });

      openOrders.set(interaction.user.id, channel.id);

      const embed = new EmbedBuilder()
        .setColor("#00ff99")
        .setTitle(`🧾 Order #${orderID}`)
        .setDescription(`
👤 Client: <@${interaction.user.id}>
📦 Service: ${product}
💰 Budget: ${budget}
🎟 Discount Applied: ${discount}%

━━━━━━━━━━━━━━━━━━
📝 Order Details:
${details}
        `)
        .setFooter({ text: "Awaiting Staff Review" });

      const closeBtn = new ButtonBuilder()
        .setCustomId(`close_${interaction.user.id}`)
        .setLabel("🔒 Close Order")
        .setStyle(ButtonStyle.Danger);

      await channel.send({
        content: `<@${interaction.user.id}> <@&${STAFF_ROLE_ID}>`,
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(closeBtn)]
      });

      const logChannel = interaction.guild.channels.cache.get(STAFF_LOG_CHANNEL);
      if (logChannel) logChannel.send({ embeds: [embed] });

      activeDiscounts.delete(interaction.user.id);

      return interaction.reply({
        content: `✅ Your private order has been created: ${channel}`,
        ephemeral: true
      });
    }

    // ================= CLOSE ORDER =================
    if (interaction.isButton() && interaction.customId.startsWith("close_")) {

      if (!interaction.member.roles.cache.has(STAFF_ROLE_ID))
        return interaction.reply({ content: "❌ Staff only.", ephemeral: true });

      const userId = interaction.customId.split("_")[1];

      openOrders.delete(userId);

      await interaction.reply({ content: "🔒 Closing order in 3 seconds..." });

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 3000);
    }

  });
};
