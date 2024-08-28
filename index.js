const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { authorize, initializeCalender, syncEvents } = require('./calender.js');
const { startExpiryCheck } = require('./events/checkExpiry.js');
const { startEventNotificationCheck } = require('./events/checkUpcomingEvents.js')


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageTyping,
	],
	partials: [
		'CHANNEL',
		'MESSAGE',
		'GUILD_MEMBER',
		'USER',
	],
});

client.cooldowns = new Collection();
client.commands = new Collection();

// Loads Commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Collects Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function startBot() {
	try {
		await client.login(token);
		const auth = await authorize();
		await initializeCalender(auth);

		console.log('Syncing event data with Google Calender...');
		await syncEvents(auth);
		console.log('Event data sync successful');

		startExpiryCheck(client);
		startEventNotificationCheck(client);
		// Periodically Syncs event data every 10 mins
		setInterval(async () => {
			try {
				console.log('Syncing event data with Google Calender...');
				await syncEvents(auth);
				console.log('Event data synced successfully.');
			}
			catch (error) {
				console.error('Error during event data sync:', error);
			}
		}, 600000);


		console.log('Alfred is ready to serve...');
	}
	catch (error) {
		console.error('Failed to start bot.', error);
		process.exit(1);
	}
}

startBot();