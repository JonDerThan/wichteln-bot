const getParticipants = require('../get_participants.js');

module.exports = {
    data: {
        type: 'button',
        name: 'participate',
    },
    async execute(interaction) {
        const message = interaction.message;
        const participantsString = message.embeds[0].fields[0].value;
        const participantsIds = getParticipants(message);
        const field = message.embeds[0].fields[0];

        if (participantsIds.length === 0) {
            field.value = `**${interaction.user.tag}** (${interaction.member.id})`;
        }

        else if (participantsIds.includes(interaction.member.id)) {
            await interaction.reply({
                content: 'You\'re already participating.',
                ephemeral: true,
            });

            return;
        }

        else {
            // TODO: add support for users with >2000 characters
            field.value = participantsString + `\n**${interaction.user.tag}** (${interaction.member.id})`;
        }

        await interaction.update({
            embeds: [{
                fields: [field],
            }],
        });
    },
};
