const getOriginalMessage = require('../get_original_message.js');
const disableButtons = require('../disable_buttons.js');
const startEvent = require('../start_event.js');

module.exports = {
    data: {
        type: 'button',
        name: 'start_confirm',
    },
    async execute(interaction) {
        const originalMessage = await getOriginalMessage(interaction);

        if (originalMessage.interaction.user.id !== interaction.user.id) {
            await interaction.reply({
                content: 'Only the creator of the event can initate the start.',
                ephemeral: true,
            });

            return;
        }

        else {
            disableButtons(interaction.message);

            await startEvent(interaction);
        }
    },
};
