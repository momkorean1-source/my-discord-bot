const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    REST,
    Routes
} = require("discord.js");

module.exports = (client) => {

    // ===============================
    // CONFIG
    // ===============================

    const CLIENT_ID = "1497005576645906442";
    const GUILD_ID = "1481848532163104940";

    // ===============================
    // REGISTER COMMAND
    // ===============================

    const commands = [

        new SlashCommandBuilder()

            .setName("text")

            .setDescription("Make the bot send a custom embed message")

            .addStringOption(option =>
                option
                    .setName("message")
                    .setDescription("Message")
                    .setRequired(true)
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            )

    ].map(command => command.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    (async () => {

        try {

            await rest.put(
                Routes.applicationGuildCommands(
                    CLIENT_ID,
                    GUILD_ID
                ),
                { body: commands }
            );

            console.log("✅ /text command loaded.");

        } catch (err) {

            console.log(err);

        }

    })();

    // ===============================
    // INTERACTION
    // ===============================

    client.on("interactionCreate", async interaction => {

        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "text") {

            const message =
                interaction.options.getString("message");

            await interaction.reply({
                content: "✅ Message sent.",
                ephemeral: true
            });

            await interaction.channel.send({
                embeds: [
                    {
                        color: 0x7a00ff,
                        description: message
                    }
                ]
            });

        }

    });

};
