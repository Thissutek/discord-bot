const { SlashCommandBuilder } = require('discord.js');
const { authorize, deleteEvent } = require('../../calender.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-event')
		.setDescription('Delete an event')
		.addStringOption(option => (
			option.setName('eventid')
				.setDescription('the simple ID of the event to delete')
				.setRequired(true)
		)),

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const eventId = interaction.options.getString('eventid');
		try {
			const auth = await authorize();
			const result = await deleteEvent(auth, eventId);
			await interaction.reply(result);
		}
		catch (error) {
			console.error('Error in execute command', error);
			await interaction.reply('There was an error deleting the event.');
		}
	},
};
