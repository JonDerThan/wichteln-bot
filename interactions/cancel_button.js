const getInvokedUser = require('../get_invoked_user.js');
const disableButtons = require('../disable_buttons.js');

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        type: 'button',
        name: 'cancel',
    },
    async execute(interaction) {
        if (getInvokedUser(interaction) !== interaction.user.id) {
            await interaction.reply({
                content: 'Only the creator of the event can cancel it.',
                ephemeral: true,
            });

            return;
        }

        else {
            await disableButtons(interaction.message);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('cancel_dismiss')
                        .setLabel('Dismiss')
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('cancel_confirm')
                        .setLabel('CANCEL')
                        .setStyle('DANGER'),
                );

            await interaction.reply({
                content: 'Are you sure you want to cancel this event?',
                components: [row],
            });
        }
    },
};
