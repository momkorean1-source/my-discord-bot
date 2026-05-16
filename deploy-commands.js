const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

    new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock the channel"),

    new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption(option =>
            option.setName("user").setDescription("User").setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .addUserOption(option =>
            option.setName("user").setDescription("User").setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("role")
        .setDescription("Role system")
        .addSubcommand(sub =>
            sub
                .setName("give")
                .setDescription("Give role")
                .addUserOption(o => o.setName("user").setRequired(true))
                .addRoleOption(o => o.setName("role").setRequired(true))
        ),

    new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a user")
        .addUserOption(o =>
            o.setName("user").setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("minutes").setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Remove timeout")
        .addUserOption(o =>
            o.setName("user").setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete messages")
        .addIntegerOption(o =>
            o.setName("amount").setRequired(true)
        )
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Deploying commands...");

        await rest.put(
            Routes.applicationCommands("1497005576645906442"),
            { body: commands }
        );

        console.log("Commands deployed!");
    } catch (err) {
        console.log(err);
    }
})();