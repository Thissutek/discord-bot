const { SlashCommandBuilder } = require('discord.js');
const { listItems } = require('../../refrigeratorReminder');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-items')
		.setDescription('list all items in the refrigerator'),
	async execute(interaction) {
		const items = await listItems();
		if (items.length === 0) {
			await interaction.reply('Your refrigerator is empty');
		}
		else {
			const itemList = items.map(item => {

				const expiryDuration = Number(item.expiryDuration);

				const expiryDate = item.exactExpiryDate
					? new Date(item.exactExpiryDate).toLocaleDateString()
					: new Date(new Date(item.purchaseDate).setDate(new Date(item.purchaseDate).getDate() + expiryDuration)).toLocaleDateString();

				return `${item.name} (${item.category}) - Expires: ${expiryDate}`;
			}).join('\n');

			await interaction.reply(`Refrigerator contents: \n${itemList}`);
		}
	},
};