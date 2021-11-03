module.exports = async function(buttonInteraction) {
    return await buttonInteraction.channel.messages.fetch(buttonInteraction.message.reference.messageId);
};
