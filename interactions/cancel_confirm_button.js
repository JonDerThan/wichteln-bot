const getOriginalMessage = require('../get_original_message.js');
const disableButtons = require('../disable_buttons.js');

module.exports = {
    data: {
        type: 'button',
        name: 'cancel_confirm',
    },
    async execute(interaction) {
        const originalMessage = await getOriginalMessage(interaction);

        if (originalMessage.interaction.user.id !== interaction.user.id) {
            await interaction.reply({
                content: 'Only the creator of the event can cancel it.',
                ephemeral: true,
            });

            return;
        }

        else {
            disableButtons(interaction.message);

            await interaction.reply(`<@${interaction.user.id}> cancelled the event.`);
        }
    },
};
