const getOriginalMessage = require('./get_original_message.js');
const getParticipants = require('./get_participants.js');
const excludePairs = require('./exclude_pairs.json');
const { createPairs } = require('./create_pairs.js');

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// got this from stackoverflow
String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

module.exports = async function(interaction) {
    const originalMessage = await getOriginalMessage(interaction);
    const participants = getParticipants(originalMessage);

    await interaction.reply(`Mixing **${participants.length}** participants...`);

    const promise = interaction.guild.members.fetch({ user: participants });

    const pairs = createPairs(participants, excludePairs);

    const members = await promise;

    members.forEach(member => {
        member.user.createDM(true).catch(err => {throw err;});
    });

    // stackoverflow
    const pepper = (Math.random() + 1).toString(36).substring(7);
    const pepper2 = Math.floor(Math.random() * 900 + 100);
    members.forEach(member => member.hash = (String(Number(member.id) * pepper2) + pepper).hashCode());

    await interaction.editReply({
        content: 'Sending direct messages...',
        embeds: [ new MessageEmbed().addField('Pairs', pairsToString(pairs, members)) ],
    });

    const messagesToBeSent = await sendDirectMessages(pairs, members);

    await interaction.editReply({ content: 'Done!' });

    if (messagesToBeSent.length > 0) {
        const ids = messagesToBeSent.map(elem => elem[0].id);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('try_again')
                    .setLabel('Try again')
                    .setStyle('PRIMARY'),
            );

        await interaction.channel.send({
            content: 'Couldn\'t send direct messages to the following users. Please make sure to allow direct messages from members of this server and try again.',
            embeds: [ new MessageEmbed().setDescription(messagesToBeSent.map(elem => `**${elem[0].user.tag}**`).join('\n')) ],
            components: [row],
        }).then(message => {
            const collector = message.createMessageComponentCollector({
                type: 'BUTTON',
                filter: (buttonInteraction) => {
                    return buttonInteraction.customId === 'try_again' && ids.includes(buttonInteraction.user.id);
                },
            });

            collectTryAgain(collector, ids, messagesToBeSent, message);
        });
    }
};

// I'm sure there is a better way to do this, sorry
function collectTryAgain(collector, ids, messagesToBeSent, message) {
    collector.on('collect', tryAgainInteraction => {
        const [ member, messageContent ] = messagesToBeSent.find(elem => elem[0].id === tryAgainInteraction.user.id);

        member.send(messageContent).catch(async () => {
            await tryAgainInteraction.reply({
                content: messageContent,
                ephemeral: true,
            });
        }).finally(async () => {
            ids = ids.filter(id => id !== member.id);
            messagesToBeSent = messagesToBeSent.filter(([ member2 ]) => member.id !== member2.id);

            if (messagesToBeSent.length !== ids.length) throw 'What? 1';

            if (ids.length < 1) {
                await message.edit({
                    content: 'Sent all messages!',
                    embeds: [],
                    components: [],
                });
            }

            else {
                const embeds = [new MessageEmbed().setDescription(messagesToBeSent.map(([ member2 ]) => `**${member2.user.tag}**`).join('\n'))];

                await message.edit({
                    embeds,
                });
            }
        });
    });
}

function pairsToString(pairs, members) {
    let str = '';

    pairs.forEach(pair => {
        str += `**${members.get(pair[0]).user.tag}** -> *${members.get(pair[1]).hash}*\n`;
    });

    return str.trim();
}

function sendDirectMessages(pairs, members) {
    return new Promise((resolve) => {
        const promiseList = [];
        const messagesToBeSent = [];

        pairs.forEach(pair => {
            const messageContent = `**${members.get(pair[1]).user.tag}** (*${members.get(pair[1]).hash}*)`;
            const member = members.get(pair[0]);
            promiseList.push(
                member.send(messageContent)
                    .catch(() => {
                        messagesToBeSent.push([member, messageContent]);
                    }),
            );
        });

        Promise.all(promiseList).then(() => resolve(messagesToBeSent));
    });
}
