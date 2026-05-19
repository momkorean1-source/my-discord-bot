const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    REST,
    Routes,
    EmbedBuilder
} = require("discord.js");

module.exports = (client) => {

    // ===============================
    // CONFIG
    // ===============================

    const CLIENT_ID = "1497005576645906442";
    const GUILD_ID = "1481848532163104940";
    const TOKEN = process.env.TOKEN;

    const BRAND_NAME = "My Bot"; // change this
    const EMBED_COLOR = 0x7a00ff;

    if (!TOKEN) {
        console.error("❌ Missing TOKEN in environment variables.");
        return;
    }

    // ===============================
    // SLASH COMMAND
    // ===============================

    const commands = [
        new SlashCommandBuilder()
            .setName("text")
            .setDescription("Send a professional embed message")
            .addStringOption(option =>
                option
                    .setName("message")
                    .setDescription("Main embed content")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName("title")
                    .setDescription("Optional embed title")
                    .setRequired(false)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    (async () => {
        try {
            console.log("⏳ Registering commands...");

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );

            console.log("✅ /text command registered.");
        } catch (err) {
            console.error("❌ Command register error:", err);
        }
    })();

    // ===============================
    // INTERACTION HANDLER
    // ===============================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "text") {

            const message = interaction.options.getString("message");
            const title = interaction.options.getString("title");

            const embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setDescription(message)
                .setTimestamp()
                .setFooter({ text: BRAND_NAME });

            if (title) {
                embed.setTitle(title);
            }

            await interaction.channel.send({
                embeds: [embed]
            });

            await interaction.reply({
                content: "✅ Sent.",
                ephemeral: true
            });
        }
    });
};
