module.exports = {
    createPairs,
    isValidPair,
    checkPairsAreValid,
};

function createPairs(participants, disallowedPairs) {
    const pairs = [];

    // clone participants into new array
    let receivers = participants.map(x => x);

    participants.forEach(participant => {
        const possibleReceivers = receivers.filter(receiver => isValidPair(participant, receiver, disallowedPairs));

        // repeat the method if there aren't any valid pairs left
        if (possibleReceivers.length < 1) return createPairs(participants);
        const receiver = possibleReceivers[Math.floor(Math.random() * possibleReceivers.length)];

        pairs.push([participant, receiver]);

        receivers = receivers.filter(elem => elem !== receiver);
    });

    if (receivers.length > 0 || !checkPairsAreValid(participants, pairs, disallowedPairs)) throw 'What? qwer';

    return pairs;
}

function isValidPair(user1, user2, disallowedPairs) {
    let error = false;
    if (user1 === user2) return false;

    disallowedPairs.forEach(disallowedPair => {
        if (disallowedPair.includes(user1) && disallowedPair.includes(user2)) {
            error = true;
            return false;
        }
    });
    if (error) return false;

    return true;
}

// Just to make sure everyone is included
function checkPairsAreValid(participants, pairs, disallowedPairs) {
    let error = false;
    if (participants.length !== pairs.length) return;
    const list1 = pairs.map(pair => pair[0]);
    const list2 = pairs.map(pair => pair[1]);

    participants.forEach(participant => {
        // check if user receives and gives exactly one present
        if (list1.filter(user => user === participant).length !== 1 || list2.filter(user => user === participant).length !== 1) {
            error = true;
            return false;
        }
    });
    if (error) return false;

    pairs.forEach((pair) => {
        if (pair[0] === pair[1]) {
            error = true;
            return false;
        }

        disallowedPairs.forEach(disallowedPair => {
            if (disallowedPair.includes(pair[0]) && disallowedPair.includes(pair[1])) {
                error = true;
                return false;
            }
        });
        if (error) return false;
    });
    if (error) return false;

    return true;
}
