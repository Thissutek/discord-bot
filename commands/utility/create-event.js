const { SlashCommandBuilder } = require('discord.js');
const { authorize, createEvent } = require('../../calender.js');
const { parse, formatISO } = require('date-fns');

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
				.setDescription('Start time of the event in ISO format (e.g., yyyy-MM-dd HH:mm)')
				.setRequired(true)
		))
		.addStringOption(option => (
			option.setName('end')
				.setDescription('End time of the event in ISO format (e.g., yyyy-MM-dd HH:mm)')
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
		const startInput = interaction.options.getString('start');
		const endInput = interaction.options.getString('end');

		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (commandName === 'create-event') {
			try {
				const auth = await authorize();

				const startDate = parse(startInput, 'yyyy-MM-dd HH:mm', new Date());
				const endDate = parse(endInput, 'yyyy-MM-dd HH:mm', new Date());

				const summary = interaction.options.getString('summary');
				const location = interaction.options.getString('location') || '';
				const description = interaction.options.getString('description') || '';
				const start = formatISO(startDate);
				const end = formatISO(endDate);

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
