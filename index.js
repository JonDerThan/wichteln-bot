const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();
client.interactions = new Collection()
    .set('button', new Collection());
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const interactionFiles = fs.readdirSync('./interactions/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

for (const file of interactionFiles) {
    const interaction = require(`./interactions/${file}`);

    if (!client.interactions.has(interaction.data.type)) client.interactions.set(interaction.data.type, new Collection());

    client.interactions.set(
        interaction.data.type,
        client.interactions.get(interaction.data.type)
            .set(interaction.data.name, interaction),
    );
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    else if (interaction.isButton()) {
        const i = client.interactions.get('button').get(interaction.customId);

        if (!i) return;

        try {
            await i.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.followUp({ content: 'There was an error while executing this interaction!', ephemeral: true });
        }
    }
});

client.login(config.token);
