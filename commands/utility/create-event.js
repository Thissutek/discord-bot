const { SlashCommandBuilder } = require('discord.js');
const { authorize, createEvent } = require('../../calender.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-event')
		.setDescription('Creates a new event with specified details')
		.addStringOption(option => (
			option.setName('summary')
				.setDescription('Title of the event')
				.setRequired(true)
		))
		.addStringOption(option => (
			option.setName('start')
				.setDescription('Start time of the event in ISO format (e.g., 2024-08-01T09:00:00-07:00)')
				.setRequired(true)
		))
		.addStringOption(option => (
			option.setName('end')
				.setDescription('End time of the event in ISO format (e.g., 2024-08-01T10:00:00-07:00)')
				.setRequired(true)
		))
		.addStringOption(option => (
			option.setName('location')
				.setDescription('Location of the event')
		))
		.addStringOption(option => (
			option.setName('description')
				.setDescription('Description of the event')
		)),

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (commandName === 'create-event') {
			try {
				const auth = await authorize();

				const summary = interaction.options.getString('summary');
				const location = interaction.options.getString('location') || '';
				const description = interaction.options.getString('description') || '';
				const start = interaction.options.getString('start');
				const end = interaction.options.getString('end');

				const event = {
					summary,
					location,
					description,
					start: {
						dateTime: start,
						timeZone: 'America/Toronto',
					},
					end: {
						dateTime: end,
						timeZone: 'America/Toronto',
					},
				};

				const createdEvent = await createEvent(auth, event);

				await interaction.reply(`Event Created: ${createdEvent.htmlLink}`);
			}
			catch (error) {
				console.error(error);
				await interaction.reply('There was an error creating the event.');
			}
		}
	},
};
