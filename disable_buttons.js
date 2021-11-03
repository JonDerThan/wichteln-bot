module.exports = async function(message, disable = true) {
    message.components[0].components.forEach(button => button.setDisabled(disable));
    return message.edit({
        components: message.components,
    });
};
