// const { SlashCommandBuilder } = require('discord.js');
// const { authorize, deleteEvent } = require('../../calender.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('delete-event')
// 		.setDescription('Delete an event')
// 		.addStringOption(option => (
// 			option.setName('event-id')
// 				.setDescription('the events ID')
// 				.setRequired(true)
// 		))
// 	async execute(interaction) {
// 		if (!interaction.isCommand()) return;

// 		const { commandName } = interaction;

// 		if (commandName === 'delete-event') {
// 			try {
// 				const auth = await authorize();




// 				await interaction.reply(``);
// 			}
// 			catch (error) {
// 				console.error(error);
// 				await interaction.reply('There was an error deleting the event.');
// 			}
// 		}
// 	},
// };
