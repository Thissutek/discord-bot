const { Events, AttachmentBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    let gifUrl;
    switch (interaction.customId) {
      case 'emoji_1':
        gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTFlMnNwZmV1dGQ4YnJpemMzNWh0NXd6dTA3MXAwczd1bG04YzdyYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TdfyKrN7HGTIY/giphy.gif';
        break;
      case 'emoji_2':
        gifUrl = 'https://media.giphy.com/media/l1J9qI9kwLQZmTQZK/giphy.gif';
        break;
      case 'emoji_3':
        gifUrl = 'https://media.giphy.com/media/3o6Zt8zBc8yG3Ch8nG/giphy.gif';
        break;
      default:
        await interaction.reply({ content: 'I apologize but you may choose an option', ephemeral: true });
        return;
    }

    try {
      const attachment = new AttachmentBuilder(gifUrl);
     
      await interaction.reply({ content: `Please accept this small token of appreciation. I hope it brings you joy and enhances your day. Should you require any further assistance, do not hesitate to let me know. Have a wonderful day`, files: [attachment] });
    } catch (error) {
      console.error('Error sending GIF:', error);
      await interaction.reply({ content: 'There was an error sending the GIF.', ephemeral: true });
    }
  },
};