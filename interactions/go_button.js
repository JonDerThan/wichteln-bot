const getInvokedUser = require('../get_invoked_user.js');
const getParticipants = require('../get_participants.js');
const disableButtons = require('../disable_buttons.js');

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        type: 'button',
        name: 'go',
    },
    async execute(interaction) {
        const participants = getParticipants(interaction.message);

        if (getInvokedUser(interaction) !== interaction.user.id) {
            await interaction.reply({
                content: 'Only the creator of the event can initate the start.',
                ephemeral: true,
            });

            return;
        }

        else if (participants.length < 2) {
            await interaction.reply({
                content: 'There are not enough members participating yet.',
                ephemeral: true,
            });
        }

        else {
            await disableButtons(interaction.message);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('start_dismiss')
                        .setLabel('Dismiss')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('start_confirm')
                        .setLabel('START')
                        .setStyle('SUCCESS'),
                );

            // caches guild members to get them in the next line
            await interaction.guild.members.fetch();
            const channelMembers = interaction.channel.members.filter(member => !member.user.bot).map(member => member.id);

            const nonParticipants = Math.max(channelMembers.length, participants.length) - participants.length;

            let messageContent = 'Are you sure you want to start the event?';

            if (nonParticipants > 0) messageContent += ` There ${nonParticipants === 1 ? 'is **1** member in this channel that is' : `are **${nonParticipants}** members in this channel that are`}  not yet participating.`;

            await interaction.reply({
                content: messageContent,
                components: [row],
            });
        }
    },
};
