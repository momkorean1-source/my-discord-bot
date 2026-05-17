const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require("discord.js");

module.exports = (client) => {

  client.on(Events.GuildMemberAdd, async member => {

    try {

      const embed = new EmbedBuilder()
        .setColor("#a855f7")
        .setTitle("💜 Welcome To ZYN Hub")
        .setThumbnail(member.guild.iconURL({ dynamic: true }))
        .setDescription(`
# Hello ${member}

Thanks for joining **ZYN Hub** 💜

We create the BEST and cheapest custom Discord bots.

━━━━━━━━━━━━━━━━━━

🔥 WHAT WE OFFER

🛒 Custom Discord Bots  
🎮 Bots linked with your GAME server  
🎫 Ticket Systems  
👋 Welcome Systems  
🛡️ Security Systems  
📊 Statistics Systems  
⚡ Fast & Optimized Bots  
💎 Premium Designs  

━━━━━━━━━━━━━━━━━━

💜 WHY US?

✅ Daily Discounts  
✅ Cheap Prices  
✅ Professional Support  
✅ Fast Delivery  
✅ Custom Designs  
✅ TEST BOTS Available  

If you're hesitating to buy,
you can TEST the bot first with:

🖼️ Your Server Logo  
📛 Your Server Name  
⚙️ Features You Want  

Example:
\`welcomer\`
\`ticket tool\`
\`security system\`
\`logs\`
and MUCH more.

━━━━━━━━━━━━━━━━━━

🔥 We also provide BIG discounts for clusters & large servers.
        `)
        .setFooter({
          text: "ZYN Hub • Premium Custom Bots"
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
          .setLabel("💜 Join Server")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/De4bPZGqKc"),

        new ButtonBuilder()
          .setLabel("🛒 Open Ticket")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/De4bPZGqKc")

      );

      await member.send({
        embeds: [embed],
        components: [row]
      });

      console.log(`📩 DM sent to ${member.user.tag}`);

    } catch (err) {

      console.log("DM WELCOME ERROR:", err);
    }

  });

};
