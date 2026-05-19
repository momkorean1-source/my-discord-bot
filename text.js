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

    const OWNER_ID = "1481848532163104940";
    const BRAND_NAME = "My Bot";
    const EMBED_COLOR = 0x7a00ff;

    if (!TOKEN) {
        console.error("❌ Missing TOKEN in environment variables.");
        return;
    }

    // ===============================
    // SLASH COMMANDS
    // ===============================

    const commands = [
        new SlashCommandBuilder()
            .setName("text")
            .setDescription("Send a professional embed message")
            .addStringOption(option =>
                option.setName("message")
                    .setDescription("Main embed content")
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName("title")
                    .setDescription("Optional embed title")
                    .setRequired(false)
            )
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        // =========================
        // DELETE COMMAND
        // =========================
        new SlashCommandBuilder()
            .setName("delete")
            .setDescription("Delete this channel (OWNER ONLY)")
    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    (async () => {
        try {
            console.log("⏳ Registering commands...");

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );

            console.log("✅ Commands registered.");
        } catch (err) {
            console.error("❌ Command register error:", err);
        }
    })();

    // ===============================
    // INTERACTIONS
    // ===============================

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isChatInputCommand()) return;

        // =========================
        // /text command
        // =========================
        if (interaction.commandName === "text") {

            const message = interaction.options.getString("message");
            const title = interaction.options.getString("title");

            const embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setDescription(message)
                .setTimestamp()
                .setFooter({ text: BRAND_NAME });

            if (title) embed.setTitle(title);

            await interaction.channel.send({ embeds: [embed] });

            return interaction.reply({
                content: "✅ Sent.",
                ephemeral: true
            });
        }

        // =========================
        // /delete command
        // =========================
        if (interaction.commandName === "delete") {

            // OWNER ONLY CHECK
            if (interaction.user.id !== OWNER_ID) {
                return interaction.reply({
                    content: "❌ You are not allowed to use this command.",
                    ephemeral: true
                });
            }

            // BOT PERMISSION CHECK
            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply({
                    content: "❌ I don't have permission to delete channels.",
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: "🗑️ Deleting channel...",
                ephemeral: true
            });

            await interaction.channel.delete().catch(() => {});
        }
    });
};
