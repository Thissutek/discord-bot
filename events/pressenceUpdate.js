const { Events } = require('discord.js');
const cron = require('node-cron');

// Timer for hydration check
// const HYDRATION_INTERVAL = 30 * 60 * 1000;
// const EXERCISE_INTERVAL =  * 60 * 60 * 1000

const hydrationReminders = new Map();
const dailyExerciseReminders = new Map();

module.exports = {
	name: Events.PresenceUpdate,
	async execute(oldPresence, newPresence) {
		if (newPresence.status === 'online' && (!oldPresence || oldPresence.status !== 'online')) {
			const userId = newPresence.user.username;
			const user = await newPresence.client.users.fetch(newPresence.user.id);
			const welcomeMessage = `Welcome back, Master ${userId} It's a pleasure to see you online once more. Do remember to take break.`;

			try {
				await user.send({ content: welcomeMessage });
				scheduleExerciseReminders(user);
				scheduleHydrationReminders(user);
			}
			catch (error) {
				console.error('Error sending welcome message', error);
			}
		}

		if (newPresence.status === 'offline' && oldPresence && oldPresence.status === 'online') {
			clearHydrationReminders(newPresence.user);
			clearExerciseReminders(newPresence.user);
		}
	},
};

function scheduleExerciseReminders(user) {
	if (dailyExerciseReminders.has(user.id)) {
	  dailyExerciseReminders.get(user.id).forEach(task => task.stop());
	  dailyExerciseReminders.delete(user.id);
	}

	const times = ['0 9 * * *', '0 13 * * *', '0 18 * * *'];
	const tasks = times.map(time =>
	  cron.schedule(time, async () => {
			try {
		  await user.send('Time for some exercise, Master! Remember to take a break and stretch your muscles.');
			}
			catch (error) {
		  console.error('Error sending exercise reminder:', error);
			}
	  }),
	);
	dailyExerciseReminders.set(user.id, tasks);
}

function scheduleHydrationReminders(user) {
	if (hydrationReminders.has(user.id)) {
	  hydrationReminders.get(user.id).stop();
	  hydrationReminders.delete(user.id);
	}

	const task = cron.schedule('*/45 8-23 * * * ', async () => {
	  try {
			await user.send('Master, a quick reminder: staying hydrated is crucial. Do take a moment to drink some water—it is good for you.');
	  }
		catch (error) {
			console.error('Error sending hydration reminder:', error);
			task.stop();
			hydrationReminders.delete(user.id);
	  }
	});

	hydrationReminders.set(user.id, task);
}

function clearExerciseReminders(user) {
	if (dailyExerciseReminders.has(user.id)) {
	  dailyExerciseReminders.get(user.id).forEach(task => task.stop());
	  dailyExerciseReminders.delete(user.id);
	}
}

function clearHydrationReminders(user) {
	if (hydrationReminders.has(user.id)) {
	  hydrationReminders.get(user.id).stop();
	  hydrationReminders.delete(user.id);
	}
}
