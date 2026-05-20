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

  const PANEL_CHANNEL_ID = "1481879215812116571";
  const STAFF_LOG_CHANNEL = "1481850766049153267";

  const discountCodes = {
    HRN: 15,
    Neon: 20,
    99111: 30
  };

  const activeDiscounts = new Map();

  function generateOrderID() {
    return Math.floor(10000 + Math.random() * 90000);
  }

  client.on(Events.InteractionCreate, async interaction => {

    // ===== /panel =====
    if (interaction.isChatInputCommand() && interaction.commandName === 'panel') {

      if (interaction.channel.id !== PANEL_CHANNEL_ID)
        return interaction.reply({ content: "Wrong channel.", ephemeral: true });

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("💎 ZYN SHOP SYSTEM")
        .setDescription(`
━━━━━━━━━━━━━━━━━━
🔥 Premium Custom Discord Bots
⚡ Fast Delivery
🛡 Secure Systems
━━━━━━━━━━━━━━━━━━

Click below to create your order.
        `);

      const button = new ButtonBuilder()
        .setCustomId('create_order')
        .setLabel('🛒 Create Order')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.channel.send({ embeds: [embed], components: [row] });
      return interaction.reply({ content: "Panel sent.", ephemeral: true });
    }

    // ===== /usecode =====
    if (interaction.isChatInputCommand() && interaction.commandName === 'usecode') {

      const code = interaction.options.getString('code');

      if (discountCodes[code]) {
        activeDiscounts.set(interaction.user.id, discountCodes[code]);
        return interaction.reply({
          content: "✅ Discount code applied successfully.",
          ephemeral: true
        });
      } else {
        return interaction.reply({
          content: "❌ Invalid code.",
          ephemeral: true
        });
      }
    }

    // ===== CREATE ORDER BUTTON =====
    if (interaction.isButton() && interaction.customId === 'create_order') {

      const modal = new ModalBuilder()
        .setCustomId('order_modal')
        .setTitle('Create Your Order');

      const product = new TextInputBuilder()
        .setCustomId('product')
        .setLabel("What do you want to buy?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const budget = new TextInputBuilder()
        .setCustomId('budget')
        .setLabel("Your Budget?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const details = new TextInputBuilder()
        .setCustomId('details')
        .setLabel("Extra Details")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(product),
        new ActionRowBuilder().addComponents(budget),
        new ActionRowBuilder().addComponents(details)
      );

      return interaction.showModal(modal);
    }

    // ===== MODAL SUBMIT =====
    if (interaction.isModalSubmit() && interaction.customId === 'order_modal') {

      const product = interaction.fields.getTextInputValue('product');
      const budget = interaction.fields.getTextInputValue('budget');
      const details = interaction.fields.getTextInputValue('details');

      const orderID = generateOrderID();
      const discount = activeDiscounts.get(interaction.user.id) || 0;

      const channel = await interaction.guild.channels.create({
        name: `order-${orderID}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle(`🧾 Order #${orderID}`)
        .setDescription(`
👤 Client: <@${interaction.user.id}>
📦 Product: ${product}
💰 Budget: ${budget}
🎟 Discount: ${discount}%

📝 Details:
${details}
        `);

      const closeBtn = new ButtonBuilder()
        .setCustomId(`close_${orderID}`)
        .setLabel("🔒 Close Order")
        .setStyle(ButtonStyle.Danger);

      await channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(closeBtn)]
      });

      activeDiscounts.delete(interaction.user.id);

      return interaction.reply({
        content: `✅ Your order has been created: ${channel}`,
        ephemeral: true
      });
    }

    // ===== CLOSE BUTTON =====
    if (interaction.isButton() && interaction.customId.startsWith("close_")) {
      await interaction.reply({ content: "Order closed.", ephemeral: true });
      setTimeout(() => interaction.channel.delete(), 3000);
    }

  });
};
