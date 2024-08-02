const { SlashCommandBuilder } = require('discord.js');
const { authorize, listEvents } = require('../../calender.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('events')
		.setDescription('Provides the next 10 events on your calender'),

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (commandName === 'events') {
			try {
				const auth = await authorize();
				const events = await listEvents(auth);

				const eventsMessage = events || 'No upcoming events found';

				await interaction.reply(`Here are the events coming up for you: \n ${eventsMessage}`);
			}
			catch (error) {
				console.error(error);
				await interaction.reply('There was an error retrieving the events.');
			}
		}
	},
};