const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('greetings')
		.setDescription('Greets the user!'),
	async execute(interaction) {
		await interaction.reply(`Greetings ${interaction.user}, how may I be of service.`);
	},
};