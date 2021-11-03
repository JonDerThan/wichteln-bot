const PARTICIPANT_ID_REGEX = /(?<=\()\d+(?=\)$)/gm;

module.exports = function(message) {
    const matches = message.embeds[0].fields[0].value.match(PARTICIPANT_ID_REGEX);

    return matches !== null ? matches : [];
};
