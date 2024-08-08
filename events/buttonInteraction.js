const { Events, AttachmentBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    let gifUrl;
    let replyMessage;

    switch (interaction.customId) {
      case 'emoji_1':
        gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTFlMnNwZmV1dGQ4YnJpemMzNWh0NXd6dTA3MXAwczd1bG04YzdyYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TdfyKrN7HGTIY/giphy.gif';
        replyMessage = 'How delightful to hear that you are in high spirits! Your positivity is indeed quite infectious. Allow me to provide a small token to help keep that smile alight. Enjoy your splendid day!'
        break;
      case 'emoji_2':
        gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2p3aGx3eDBpeXV3Ynl0OW9idHE0MGNjbmQ2cDM2OHJsZ3NxdDl6NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/meKp1tKwRNbZ05sPo7/giphy.gif';
        replyMessage = '"My dear friend, it pains me to hear that you are feeling downcast. It’s perfectly acceptable to have such days; they are part of the human experience. Here is a virtual embrace to remind you that you are never alone in this. Should you wish to talk or seek comfort, I am always at your service.'
        break;
      case 'emoji_3':
        gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmN5Y3N0YWdqbTd6OXg0emR2MWZpMGswbnBwN2lxcjY4YTZmNjQzaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bmrxNoGqGNMAM/giphy.gif';
        replyMessage = 'I recognize that you’re experiencing a surge of anger. It’s a perfectly valid emotion, but I daresay it’s best not to dwell on it for too long. Allow me to offer you a small gesture to help lighten your mood.'
        break;
      case 'emoji_4':
          gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHV1Z2lydG5kcDRrNWVnc2VhaWJvcDVpd3I3dzNtZnV6bGdlZDNqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eH4O6F2Drxa8SE5hor/giphy.gif';
          replyMessage = 'Ah, I see you’re feeling rather fatigued. A most understandable sentiment, I assure you. Do take a moment to rest and rejuvenate; even the most steadfast require a brief respite. Allow me to provide a small token to lift your spirits.'
        break;
      case 'emoji_5':
          gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDFwNnk2ZzV2NzZ3ZDVnODdtbmNkaWo0MnNkMGwzYjdxc2k3cDdyYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xULW8PLGQwyZNaw68U/giphy.gif';
          replyMessage = 'Ah, I see you’re feeling a tad uninspired. A most unfortunate state, indeed. Might I suggest finding a stimulating distraction? Allow me to provide a bit of levity to brighten your spirits.'
        break;
      default:
        await interaction.reply({ content: 'I apologize but you may choose an option', ephemeral: true });
        return;
    }

    try {
      const attachment = new AttachmentBuilder(gifUrl);
     
      await interaction.reply({ content: replyMessage, files: [attachment] });
    } catch (error) {
      console.error('Error sending GIF:', error);
      await interaction.reply({ content: 'There was an error sending the GIF.', ephemeral: true });
    }
  },
};