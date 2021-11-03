const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts the event.'),
    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('participate')
                    .setLabel('Participate')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('go')
                    .setLabel('Go')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER'),
            );

        const embed = new MessageEmbed()
            .addField('Participants', 'None');

        await interaction.reply({
            components: [row],
            embeds: [embed],
        });
    },
};
