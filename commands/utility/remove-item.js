const { SlashCommandBuilder } = require('discord.js');
const { removeItem } = require('../../refrigeratorReminder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-item')
		.setDescription('Remove an item from your refrigerator')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the food item to remove')
				.setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const updatedItems = await removeItem(name);

		if (updatedItems === null) {
			await interaction.reply(`No item named "${name}" was found in the refrigerator.`);
		}
		else {
			await interaction.reply(`${name} has been removed from the refrigerator`);
		}
	},
};