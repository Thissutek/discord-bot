const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('greetings')
		.setDescription('Greets the user and provides emoji response'),
	async execute(interaction) {
		try {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('emoji_1')
						.setLabel('😊')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('emoji_2')
						.setLabel('😢')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('emoji_3')
						.setLabel('😠')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('emoji_4')
						.setLabel('😴')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('emoji_5')
						.setLabel('😒')
						.setStyle(ButtonStyle.Primary),
				);
			await interaction.reply({ content: `Greetings ${interaction.user}, how are you doing today?`, components: [row] });
		}
		catch (error) {
			console.error('Error executing the command', error);
			await interaction.reply({ content: 'I apologize, but unfortunately, I am unable to fulfill that request at this time. However, if there is anything else I can assist with or if you\'d like me to look into alternative solutions, please let me know' });
		}
	},

};