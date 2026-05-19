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

    if (!TOKEN) {
        console.error("❌ Bot token not found in environment variables.");
        return;
    }

    // ===============================
    // COMMAND SETUP
    // ===============================

    const commands = [
        new SlashCommandBuilder()
            .setName("text")
            .setDescription("Send a custom embed message")
            .addStringOption(option =>
                option
                    .setName("message")
                    .setDescription("The message content for the embed")
                    .setRequired(true)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    // Register slash command
    (async () => {
        try {
            console.log("⏳ Registering slash commands...");

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );

            console.log("✅ /text command successfully registered.");
        } catch (error) {
            console.error("❌ Failed to register commands:", error);
        }
    })();

    // ===============================
    // INTERACTION HANDLER
    // ===============================

    client.on("interactionCreate", async (interaction) => {
        try {

            if (!interaction.isChatInputCommand()) return;

            if (interaction.commandName === "text") {

                const message = interaction.options.getString("message");

                const embed = new EmbedBuilder()
                    .setColor(0x7a00ff)
                    .setDescription(message)
                    .setFooter({ text: `Sent by ${interaction.user.tag}` })
                    .setTimestamp();

                await interaction.reply({
                    content: "✅ Message sent successfully.",
                    ephemeral: true
                });

                await interaction.channel.send({
                    embeds: [embed]
                });
            }

        } catch (error) {
            console.error("❌ Interaction error:", error);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });
            }
        }
    });
};
